package me.honkling.skriptkt.common.annotations

import me.honkling.skriptkt.common.pattern.compilePattern
import me.honkling.skriptkt.common.pattern.element.Sentence
import me.honkling.skriptkt.common.syntax.SyntaxPriority

annotation class Syntax(
    val pattern: String,
    val priority: SyntaxPriority = SyntaxPriority.NORMAL
)