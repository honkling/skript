package me.honkling.skriptkt.fabric

import me.honkling.skriptkt.common.Skript
import me.honkling.skriptkt.common.SkriptAddon
import me.honkling.skriptkt.fabric.manager.CommandManager
import net.fabricmc.api.ClientModInitializer
import net.fabricmc.loader.api.FabricLoader
import net.kyori.adventure.text.minimessage.MiniMessage
import org.apache.logging.log4j.LogManager
import kotlin.io.path.createDirectory
import kotlin.io.path.exists

val configFolder = FabricLoader.getInstance().configDir.resolve("SkriptKt")
val scriptsFolder = configFolder.resolve("scripts")
val logger = LogManager.getLogger("SkriptKt")
val mm = MiniMessage.miniMessage()

class SkriptKt : ClientModInitializer, SkriptAddon() {
    override fun onInitializeClient() {
        setupScripts()
        registerCommands()
        registerSyntax()

        Skript.syntaxRegistry.endRegistration()

        logger.info("SkriptKt is ready.")
    }

    private fun registerSyntax() {
        registerSyntax(
            "me.honkling.skriptkt.fabric",
            "types",
            "effects",
            "expressions",
            "structures",
            "events"
        )
    }

    private fun setupScripts() {
        if (!scriptsFolder.exists()) {
            configFolder.createDirectory()
            scriptsFolder.createDirectory()
        }
    }

    private fun registerCommands() {
        val manager = CommandManager(logger)
        manager.registerCommands("me.honkling.skriptkt.fabric.commands")
    }
}