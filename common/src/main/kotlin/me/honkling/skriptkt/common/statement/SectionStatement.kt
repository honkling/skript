package me.honkling.skriptkt.common.statement

import me.honkling.skriptkt.common.node.Block
import me.honkling.skriptkt.common.parser.Parser
import me.honkling.skriptkt.common.parser.PatternMatchResult
import me.honkling.skriptkt.common.script.Script
import me.honkling.skriptkt.common.syntax.Section
import me.honkling.skriptkt.common.syntax.Structure

class SectionStatement(
    parser: Parser,
    parent: Block,
    val section: Section,
    val block: Block,
    matchResult: PatternMatchResult
) : Statement(parser, parent, matchResult) {
    init {
        initializeExpressions()
        section.initialize(parser, this)
    }

    override fun accept() {
        section.accept(this)
        block.accept()
    }

    override fun toString(): String {
        return "SectionStatement(section=$section, block=$block, matchResult=$matchResult)"
    }
}