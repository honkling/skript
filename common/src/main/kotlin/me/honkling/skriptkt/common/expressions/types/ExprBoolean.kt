package me.honkling.skriptkt.common.expressions.types

import me.honkling.skriptkt.common.annotations.ExprType
import me.honkling.skriptkt.common.annotations.Syntax
import me.honkling.skriptkt.common.parser.Parser
import me.honkling.skriptkt.common.statement.ExpressionStatement
import me.honkling.skriptkt.common.statement.Statement
import me.honkling.skriptkt.common.syntax.Expression

@ExprType("boolean")
@Syntax("(true:true|false)")
class ExprBoolean : Expression<Boolean>("boolean") {
    override fun accept(statement: ExpressionStatement<Boolean>): Boolean {
        return "true" in statement.matchResult.tags
    }

    override fun initialize(parser: Parser, statement: Statement): Boolean {
        return true
    }
}