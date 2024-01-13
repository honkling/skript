package me.honkling.skriptkt.common.syntax

import me.honkling.skriptkt.common.Skript
import me.honkling.skriptkt.common.node.Node
import me.honkling.skriptkt.common.parser.Parser
import me.honkling.skriptkt.common.parser.PatternMatchResult
import me.honkling.skriptkt.common.pattern.compilePattern
import me.honkling.skriptkt.common.pattern.element.Sentence
import me.honkling.skriptkt.common.statement.Statement

abstract class SyntaxElement : Node() {
    override fun accept() {
        throw IllegalStateException("Incorrect accept usage")
    }

    abstract fun accept(statement: Statement)
    abstract fun initialize(parser: Parser, statement: Statement): Boolean
}

fun Class<out SyntaxElement>.getPattern(): Sentence? {
    return Skript.syntaxRegistry.patterns[this]
}

fun Class<out SyntaxElement>.construct(): SyntaxElement {
    return getConstructor().newInstance()
}