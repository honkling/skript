package me.honkling.skriptkt.common.syntax

import me.honkling.skriptkt.common.statement.EffectStatement
import me.honkling.skriptkt.common.statement.Statement

abstract class Effect : SyntaxElement()  {
    abstract fun accept(statement: EffectStatement)

    override fun accept(statement: Statement) {
        if (statement !is EffectStatement)
            throw IllegalStateException("Passed non-effect statement to effect")

        accept(statement)
    }
}
