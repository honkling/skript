package me.honkling.skriptkt.fabric.manager

import com.mojang.brigadier.arguments.StringArgumentType
import com.mojang.brigadier.context.CommandContext
import me.honkling.skriptkt.fabric.manager.tree.CommandNode
import me.honkling.skriptkt.fabric.manager.tree.SubcommandNode
import me.honkling.skriptkt.fabric.manager.types.*
import net.fabricmc.fabric.api.client.command.v2.ClientCommandManager.argument
import net.fabricmc.fabric.api.client.command.v2.ClientCommandManager.literal
import net.fabricmc.fabric.api.client.command.v2.ClientCommandRegistrationCallback
import net.fabricmc.fabric.api.client.command.v2.FabricClientCommandSource
import net.minecraft.entity.player.PlayerEntity
import org.apache.logging.log4j.Logger

class CommandManager(val logger: Logger) {
    val commands = mutableMapOf<String, CommandNode>()
    val types = mutableMapOf<Class<*>, Type<*>>(
            Boolean::class.java to BooleanType,
            Double::class.java to DoubleType,
            Int::class.java to IntegerType,
            PlayerEntity::class.java to PlayerType,
            String::class.java to StringType
    )

    fun registerCommands(vararg packages: String) {
        ClientCommandRegistrationCallback.EVENT.register { dispatcher, _ ->
            for (pkg in packages)
                for (command in scanForCommands(this, pkg))
                    commands[command.name.lowercase()] = command

            for ((_, node) in commands) {
                val command = literal(node.name)
                    .then(argument("args", StringArgumentType.greedyString())
                        .executes(::onCommand))
                    .executes(::onCommand)

                val root = dispatcher.register(command)

                for (alias in node.aliases) {
                    val redirect = literal(alias).redirect(root)
                    dispatcher.register(redirect)
                }
            }
        }
    }

    private fun onCommand(context: CommandContext<FabricClientCommandSource>): Int {
        val source = context.source
        val args = context.input.split(" ").toMutableList()
        val name = args.removeAt(0)

        val command = commands[name] ?: return 0
        val (subcommand, parameters) = getCommand(source, command, args.toList()) ?: return 0

        subcommand.method.invoke(null, source.player, *parameters.toTypedArray())

        return 1
    }

    private fun getCommand(sender: FabricClientCommandSource, command: CommandNode, args: List<String>): Pair<SubcommandNode, List<Any>>? {
        val postFirst = args.slice(1..<args.size)

        for (node in command.children) {
            when (node) {
                is CommandNode -> {
                    if (args.isEmpty())
                        continue

                    return getCommand(sender, node, postFirst) ?: continue
                }
                is SubcommandNode -> {
                    if (node.name != command.name && (args.isEmpty() || args.first().lowercase() != node.name))
                        continue

                    val (isValid, parameters) = parseArguments(sender, node, if (node.name == command.name) args else postFirst)

                    if (!isValid)
                        continue

                    return node to parameters
                }
            }
        }

        return null
    }

    private fun parseArguments(sender: FabricClientCommandSource, command: SubcommandNode, args: List<String>): Pair<Boolean, List<Any>> {
        @Suppress("NAME_SHADOWING") var args = args
        val parameters = mutableListOf<Any>()

        for (parameter in command.parameters) {
            if (args.isEmpty())
                return !parameter.required to parameters

            val type = types[parameter.type]

            if (type == null) {
                logger.warn("Failed to find type for class '${parameter.type.name}'. Did you delete the type after registering commands?")
                return false to parameters
            }

            val input = args.joinToString(" ")

            if (!type.validate(sender, input))
                return false to parameters

            val (parsed, size) = type.parse(sender, input)
            args = args.slice(size..<args.size)
            parameters.add(parsed!!)
        }

        if (args.isNotEmpty())
            return false to parameters

        return true to parameters
    }
}