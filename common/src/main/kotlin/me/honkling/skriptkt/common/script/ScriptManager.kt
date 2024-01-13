package me.honkling.skriptkt.common.script

import me.honkling.skriptkt.common.parser.ParseResult
import java.io.File

class ScriptManager {
    val loadedScripts = mutableMapOf<File, Script>()

    fun loadScripts(entry: File): Map<Script, ParseResult> {
        val scripts = mutableMapOf<Script, ParseResult>()

        if (entry.isFile) {
            val script = Script(entry)
            loadedScripts[entry] = script
            scripts[script] = script.reload()
            return scripts
        }

        val children = (entry.listFiles() ?: emptyArray<File>()).toList()
        children.map(::loadScripts).forEach(scripts::putAll)
        return scripts
    }
}