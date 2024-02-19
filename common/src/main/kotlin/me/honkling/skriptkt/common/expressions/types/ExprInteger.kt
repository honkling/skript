package me.honkling.skriptkt.common.expressions.types

import me.honkling.skriptkt.common.annotations.ExprType
import me.honkling.skriptkt.common.annotations.Syntax
import me.honkling.skriptkt.common.parser.Parser
import me.honkling.skriptkt.common.statement.ExpressionStatement
import me.honkling.skriptkt.common.statement.Statement
import me.honkling.skriptkt.common.syntax.Expression

@ExprType("integer")
@Syntax("<\\d+>")
class ExprInteger : Expression<Int>("integer") {
    override fun accept(statement: ExpressionStatement<Int>): Int {
        return statement.matchResult.regexes[0].value.toInt()
    }

    override fun initialize(parser: Parser, statement: Statement): Boolean {
        return true
    }
}