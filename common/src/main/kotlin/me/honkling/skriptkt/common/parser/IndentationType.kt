package me.honkling.skriptkt.common.parser

enum class IndentationType(val character: Char) {
    SPACE(' '),
    TAB('\t');

    override fun toString(): String {
        return name.lowercase()
    }
}

fun getType(character: Char): IndentationType {
    return IndentationType.entries.find { it.character == character }
        ?: throw IllegalArgumentException("Invalid character for indentation.")
}