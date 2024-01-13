package me.honkling.skriptkt.common.statement

import me.honkling.skriptkt.common.Skript
import me.honkling.skriptkt.common.node.Block
import me.honkling.skriptkt.common.parser.Parser
import me.honkling.skriptkt.common.parser.PatternMatchResult
import me.honkling.skriptkt.common.syntax.Effect

class EffectStatement(
    parser: Parser,
    parent: Block?,
    val effect: Effect,
    matchResult: PatternMatchResult
) : Statement(parser, parent, matchResult) {
    init {
        initializeExpressions()
        effect.initialize(parser, this)
    }

    override fun accept() {
        matchResult.expressions
        effect.accept(this)
    }

    override fun toString(): String {
        return "EffectStatement(effect=$effect, matchResult=$matchResult)"
    }
}