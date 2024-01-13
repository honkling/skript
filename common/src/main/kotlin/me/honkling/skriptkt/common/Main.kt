package me.honkling.skriptkt.common

import me.honkling.skriptkt.common.events.ScriptLoadEvent
import java.io.File

fun main() {
    Skript.syntaxRegistry.endRegistration()

    val file = File("/media/rosalyn/DATA/IDEAProjects/SkriptKt/common/main.sk")
    val scripts = Skript.scriptManager.loadScripts(file)

    for ((script, parseResult) in scripts.entries) {
        if (parseResult.errors.isEmpty())
            Skript.listeners.callEvent(ScriptLoadEvent(script))
    }
}