package me.honkling.skriptkt.common.output

import me.honkling.skriptkt.common.Skript

val emittedErrors = mutableListOf<Error>()
val emittedWarnings = mutableListOf<Warning>()

fun emitError(message: String) {
    val parser = Skript.parser
    val start = parser.stream.peekOrLastToken().start

    val error = Error(parser.file, start, message)
    emittedErrors += error
}

fun emitWarning(message: String) {
    val parser = Skript.parser
    val start = parser.stream.peekOrLastToken().start

    val warning = Warning(parser.file, start, message)
    emittedWarnings += warning
}