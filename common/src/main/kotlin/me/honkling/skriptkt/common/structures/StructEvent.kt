package me.honkling.skriptkt.common.structures

import me.honkling.skriptkt.common.Skript
import me.honkling.skriptkt.common.annotations.Syntax
import me.honkling.skriptkt.common.lexer.Lexer
import me.honkling.skriptkt.common.output.emitError
import me.honkling.skriptkt.common.parser.Parser
import me.honkling.skriptkt.common.parser.TokenStream
import me.honkling.skriptkt.common.statement.StructureStatement
import me.honkling.skriptkt.common.syntax.Event
import me.honkling.skriptkt.common.syntax.Structure
import me.honkling.skriptkt.common.syntax.SyntaxPriority
import me.honkling.skriptkt.common.syntax.construct

@Syntax("[on] <([^:]|:(?!$))+>", SyntaxPriority.LOW)
class StructEvent : Structure() {
    lateinit var event: Event<*>

    override fun accept(statement: StructureStatement) {
        event.accept(statement)
    }

    override fun initialize(parser: Parser, statement: StructureStatement): Boolean {
        val name = statement.matchResult.regexes[0].value
        val event = parseEvent(parser, name)

        if (event == null) {
            emitError("Invalid event")
            return false
        }

        this.event = event
        Skript.listeners.registerListener(Skript.currentlyParsing, event.event, statement)
        return true
    }

    private fun parseEvent(parser: Parser, name: String): Event<*>? {
        val tokens = Lexer(name).lex()
        val stream = TokenStream(tokens)

        val events = Skript.syntaxRegistry.events
        val clazz = parser.parseSyntaxElement(events, null, stream)?.first as Class<out Event<*>>?

        return clazz?.construct() as Event<*>?
    }
}