package me.honkling.skriptkt.common.script

import me.honkling.skriptkt.common.Skript
import me.honkling.skriptkt.common.events.ScriptLoadEvent
import me.honkling.skriptkt.common.parser.ParseResult
import java.io.File

class ScriptManager {
    val loadedScripts = mutableMapOf<File, Script>()

    fun reloadScripts(entry: File): Map<Script, ParseResult> {
        val scripts = loadScripts0(entry)

        for ((script, parseResult) in scripts.entries) {
            if (parseResult.errors.isEmpty())
                Skript.listeners.callEvent(ScriptLoadEvent(script))
        }

        return scripts
    }

    private fun loadScripts0(entry: File): Map<Script, ParseResult> {
        val scripts = mutableMapOf<Script, ParseResult>()

        if (entry.isFile) {
            val script = Script(entry)
            loadedScripts[entry] = script
            scripts[script] = script.reload()
            return scripts
        }

        val children = (entry.listFiles() ?: emptyArray<File>()).toList()
        children.map(::loadScripts0).forEach(scripts::putAll)
        return scripts
    }
}