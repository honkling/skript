package me.honkling.skriptkt.common.lexer

// todo: migrate tokens to a character-by-character lexer instead of regex
enum class TokenType(regex: String) {
    NEWLINE("\n"),
    WHITESPACE("[\t ]+"),
    IDENTIFIER("\\S+");

    val regex = Regex("^$regex")
}