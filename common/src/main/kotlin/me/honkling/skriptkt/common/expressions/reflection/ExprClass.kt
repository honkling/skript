package me.honkling.skriptkt.common.expressions.reflection

import me.honkling.skriptkt.common.annotations.ExprType
import me.honkling.skriptkt.common.annotations.Syntax
import me.honkling.skriptkt.common.parser.Parser
import me.honkling.skriptkt.common.statement.ExpressionStatement
import me.honkling.skriptkt.common.statement.Statement
import me.honkling.skriptkt.common.syntax.Expression

@ExprType("class")
@Syntax("class [from] %string%")
class ExprClass : Expression<Class<*>>("class") {
    private lateinit var clazz: Class<*>

    override fun accept(statement: ExpressionStatement<Class<*>>): Class<*> {
        return clazz
    }

    override fun initialize(parser: Parser, statement: Statement): Boolean {
        val name = statement.matchResult.expressions[0].value!! as String

        try {
            clazz = Class.forName(name)
        } catch (e: ClassNotFoundException) {
            return false
        }

        return true
    }
}