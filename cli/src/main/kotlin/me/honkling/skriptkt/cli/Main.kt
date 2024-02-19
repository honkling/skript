package me.honkling.skriptkt.cli

import me.honkling.skriptkt.common.Skript
import java.io.File

fun main() {
    Skript.syntaxRegistry.endRegistration()

    val file = File("/media/rosalyn/DATA/IDEAProjects/SkriptKt/common/main.sk")
    val scripts = Skript.scriptManager.reloadScripts(file)

    println(scripts)
}