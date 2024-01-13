package me.honkling.skriptkt.common.statement

import me.honkling.skriptkt.common.Skript
import me.honkling.skriptkt.common.node.Block
import me.honkling.skriptkt.common.parser.Parser
import me.honkling.skriptkt.common.parser.PatternMatchResult
import me.honkling.skriptkt.common.script.Script
import me.honkling.skriptkt.common.syntax.Structure

class StructureStatement(
    parser: Parser,
    val script: Script,
    val structure: Structure,
    val block: Block,
    matchResult: PatternMatchResult
) : Statement(parser, null, matchResult) {
    init {
        initializeExpressions()
        structure.initialize(parser, this)
    }

    override fun accept() {
        structure.accept(this)
        block.accept()
    }

    override fun toString(): String {
        return "StructureStatement(structure=$structure, block=$block, matchResult=$matchResult)"
    }
}