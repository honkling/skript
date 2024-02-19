@file:Command("skript")

package me.honkling.skriptkt.fabric.commands

import me.honkling.skriptkt.common.Skript
import me.honkling.skriptkt.common.output.LocatedOutput
import me.honkling.skriptkt.common.output.OutputType
import me.honkling.skriptkt.fabric.manager.annotations.Command
import me.honkling.skriptkt.fabric.scriptsFolder
import net.minecraft.client.network.ClientPlayerEntity
import net.minecraft.text.Text
import net.minecraft.util.Formatting
import java.io.File

fun skript(player: ClientPlayerEntity) {
    player.sendMessage(Text.literal("Working!"))
}

fun reload(player: ClientPlayerEntity, path: String) {
    val file = scriptsFolder.resolve(path).toFile()
    val scripts = Skript.scriptManager.reloadScripts(file)

    for ((script, parseResult) in scripts.entries) {
        val input = script.file.readText()

        parseResult.errors.forEach { sendOutput(player, input, it) }
        parseResult.warnings.forEach { sendOutput(player, input, it) }
    }

    player.sendMessage(Text
        .literal("Reloaded ${scripts.size} script")
        .append(Text
            .literal(if (scripts.size == 1) "" else "s"))
        .append(Text.literal(".")))
}

private fun sendOutput(player: ClientPlayerEntity, input: String, output: LocatedOutput) {
    val (lineNumber, column) = output.getPosition(input)

    val prefix = Text
        .literal(if (output.type == OutputType.ERROR) "error:" else "warning:")
        .formatted(if (output.type == OutputType.ERROR) Formatting.RED else Formatting.GOLD)

    player.sendMessage(prefix
        .append(Text.literal(" ${output.message} (${output.file.name}:$lineNumber:$column)"))
        .append(Text.literal("\n"))
        .append(Text
            .literal(output.getLine(input))
            .formatted(Formatting.WHITE))
        .append(Text.literal("\n")))
}