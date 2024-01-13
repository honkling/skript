package me.honkling.skriptkt.common.expressions

import me.honkling.skriptkt.common.annotations.ExprType
import me.honkling.skriptkt.common.annotations.Syntax
import me.honkling.skriptkt.common.parser.Parser
import me.honkling.skriptkt.common.statement.ExpressionStatement
import me.honkling.skriptkt.common.statement.Statement
import me.honkling.skriptkt.common.syntax.Expression

@ExprType("number")
@Syntax("<\\d+\\.\\d+>")
class ExprNumber : Expression<Double>("number") {
    override fun accept(statement: ExpressionStatement<Double>): Double {
        return statement.matchResult.regexes[0].value.toDouble()
    }

    override fun initialize(parser: Parser, statement: Statement): Boolean {
        return true
    }
}