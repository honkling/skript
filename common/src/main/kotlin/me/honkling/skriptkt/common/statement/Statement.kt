package me.honkling.skriptkt.common.statement

import me.honkling.skriptkt.common.Skript
import me.honkling.skriptkt.common.node.Block
import me.honkling.skriptkt.common.node.Node
import me.honkling.skriptkt.common.parser.Parser
import me.honkling.skriptkt.common.parser.PatternMatchResult

abstract class Statement(
    val parser: Parser,
    parent: Block?,
    val matchResult: PatternMatchResult
) : Node(parent) {
    protected fun initializeExpressions() {
        matchResult.expressions.forEach {
            if (it.expression.initialize(parser, it))
                it.accept()
        }
    }
}