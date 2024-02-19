package me.honkling.skriptkt.fabric.structures

import me.honkling.skriptkt.common.annotations.Syntax
import me.honkling.skriptkt.common.parser.Parser
import me.honkling.skriptkt.common.statement.StructureStatement
import me.honkling.skriptkt.common.syntax.Structure

@Syntax("command [/]<a-zA-Z0-9+> <(([^<[ ][^ ]+|\\[<[^>]+>\\]|<[^>]+>) ?)+>")
class StructCommand : Structure() {
    override fun accept(statement: StructureStatement) {

    }

    override fun initialize(parser: Parser, statement: StructureStatement): Boolean {
        return true
    }

    private fun parseArguments(): Pair<Boolean, >
}