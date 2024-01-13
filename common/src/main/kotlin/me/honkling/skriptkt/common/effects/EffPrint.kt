package me.honkling.skriptkt.common.effects

import me.honkling.skriptkt.common.annotations.Syntax
import me.honkling.skriptkt.common.parser.Parser
import me.honkling.skriptkt.common.statement.EffectStatement
import me.honkling.skriptkt.common.statement.Statement
import me.honkling.skriptkt.common.syntax.Effect

@Syntax("print %strings%")
class EffPrint : Effect() {
    override fun accept(statement: EffectStatement) {
        val strings = statement.matchResult.expressions[0].value
        println(strings)
    }

    override fun initialize(parser: Parser, statement: Statement): Boolean {
        return true
    }
}