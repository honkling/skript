package me.honkling.skriptkt.common

import me.honkling.skriptkt.common.events.EventHandler
import me.honkling.skriptkt.common.parser.Parser
import me.honkling.skriptkt.common.script.ScriptManager
import me.honkling.skriptkt.common.syntax.SyntaxRegistry
import java.io.File

object Skript : SkriptAddon() {
    // Scripts
    val scriptManager = ScriptManager()
    val listeners = EventHandler()

    // Parsing
    lateinit var currentlyParsing: File
    lateinit var parser: Parser

    // Addons / syntax
    val addons = mutableListOf<SkriptAddon>()
    val syntaxRegistry = SyntaxRegistry()

    init {
        registerSyntax(
            "me.honkling.skriptkt.common",
            "types",
            "structures",
            "events",
            "effects",
            "expressions"
        )
    }

    /**
     * Register your plugin / mod / etc as a Skript addon.
     * @param addon The addon instance.
     */
    fun registerAddon(addon: SkriptAddon) {
        addons += addon
    }
}