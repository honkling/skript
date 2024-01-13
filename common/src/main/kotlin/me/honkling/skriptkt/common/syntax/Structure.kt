package me.honkling.skriptkt.common.syntax

import me.honkling.skriptkt.common.parser.Parser
import me.honkling.skriptkt.common.statement.Statement
import me.honkling.skriptkt.common.statement.StructureStatement

abstract class Structure : SyntaxElement() {
    abstract fun accept(statement: StructureStatement)
    abstract fun initialize(parser: Parser, statement: StructureStatement): Boolean

    override fun accept(statement: Statement) {
        if (statement !is StructureStatement)
            throw IllegalStateException("Passed non-structure statement to structure")

        accept(statement)
    }

    override fun initialize(parser: Parser, statement: Statement): Boolean {
        if (statement !is StructureStatement)
            throw IllegalStateException("Passed non-structure statement to structure")

        return initialize(parser, statement)
    }
}