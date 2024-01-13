package me.honkling.skriptkt.common.syntax

import me.honkling.skriptkt.common.Skript
import me.honkling.skriptkt.common.statement.EffectStatement
import me.honkling.skriptkt.common.statement.ExpressionStatement
import me.honkling.skriptkt.common.statement.Statement

abstract class Expression<T : Any?>(type: String) : SyntaxElement() {
    val type = Skript.syntaxRegistry.types[type]!! as Type<T>

    abstract fun accept(statement: ExpressionStatement<T>): T

    override fun accept(statement: Statement) {
        if (statement !is ExpressionStatement<*>)
            throw IllegalStateException("Passed non-expression statement to effect")

        accept(statement)
    }
}
