package me.honkling.skriptkt.common.syntax

import me.honkling.skriptkt.common.parser.Parser
import me.honkling.skriptkt.common.statement.SectionStatement
import me.honkling.skriptkt.common.statement.Statement
import me.honkling.skriptkt.common.statement.StructureStatement

abstract class Section : SyntaxElement() {
    abstract fun accept(statement: SectionStatement)
    abstract fun initialize(parser: Parser, statement: SectionStatement): Boolean

    override fun accept(statement: Statement) {
        if (statement !is SectionStatement)
            throw IllegalStateException("Passed non-section statement to section")

        accept(statement)
    }

    override fun initialize(parser: Parser, statement: Statement): Boolean {
        if (statement !is SectionStatement)
            throw IllegalStateException("Passed non-section statement to section")

        return initialize(parser, statement)
    }
}