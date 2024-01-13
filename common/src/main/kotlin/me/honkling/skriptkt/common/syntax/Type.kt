package me.honkling.skriptkt.common.syntax

import me.honkling.skriptkt.common.parser.Parser
import me.honkling.skriptkt.common.statement.Statement

abstract class Type<T>(val id: String, val plural: String) : SyntaxElement() {
    override fun accept(statement: Statement) {}
    override fun initialize(parser: Parser, statement: Statement): Boolean = true

    abstract fun canParse(): Boolean
    abstract fun fromStringRepresentation(input: String): T
    abstract fun toStringRepresentation(input: T): String
}
