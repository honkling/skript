package me.honkling.skriptkt.common.syntax

/**
 * Syntax is ordered by their priority during parse time.
 * The parser will check for syntax with low priority last, and high priority first, for example.
 */
enum class SyntaxPriority {
    HIGH,
    NORMAL,
    LOW
}
