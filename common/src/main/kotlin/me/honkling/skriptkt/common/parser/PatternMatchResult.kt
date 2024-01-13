package me.honkling.skriptkt.common.parser

import me.honkling.skriptkt.common.statement.ExpressionStatement
import kotlin.text.MatchResult

data class PatternMatchResult(
    val regexes: List<MatchResult>,
    val expressions: List<ExpressionStatement<*>>
)
