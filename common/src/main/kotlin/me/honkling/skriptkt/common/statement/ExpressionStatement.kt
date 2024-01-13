package me.honkling.skriptkt.common.statement

import me.honkling.skriptkt.common.Skript
import me.honkling.skriptkt.common.node.Block
import me.honkling.skriptkt.common.parser.Parser
import me.honkling.skriptkt.common.parser.PatternMatchResult
import me.honkling.skriptkt.common.syntax.Effect
import me.honkling.skriptkt.common.syntax.Expression

class ExpressionStatement<T : Any?>(
    parser: Parser,
    parent: Block?,
    val expression: Expression<T>,
    matchResult: PatternMatchResult
) : Statement(parser, parent, matchResult) {
    var value: T? = null

    init {
        initializeExpressions()
        expression.initialize(parser, this)
    }

    override fun accept() {
        value = expression.accept(this)
    }

    override fun toString(): String {
        return "ExpressionStatement(expression=$expression, matchResult=$matchResult)"
    }
}