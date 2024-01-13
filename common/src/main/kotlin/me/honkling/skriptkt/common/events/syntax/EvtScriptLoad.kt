package me.honkling.skriptkt.common.events.syntax

import me.honkling.skriptkt.common.annotations.Syntax
import me.honkling.skriptkt.common.events.ScriptLoadEvent
import me.honkling.skriptkt.common.parser.Parser
import me.honkling.skriptkt.common.statement.StructureStatement
import me.honkling.skriptkt.common.syntax.Event

@Syntax("script load")
class EvtScriptLoad : Event<ScriptLoadEvent>(ScriptLoadEvent::class.java) {
    override fun check(event: ScriptLoadEvent, statement: StructureStatement): Boolean {
        return event.script == statement.script
    }

    override fun accept(statement: StructureStatement) {}
    override fun initialize(parser: Parser, statement: StructureStatement): Boolean {
        return true
    }
}