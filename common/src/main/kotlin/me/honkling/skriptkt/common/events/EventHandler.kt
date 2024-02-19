package me.honkling.skriptkt.common.events

import me.honkling.skriptkt.common.script.Script
import me.honkling.skriptkt.common.statement.StructureStatement
import me.honkling.skriptkt.common.structures.StructEvent

class EventHandler {
    private val handlers = mutableMapOf<Script, MutableMap<Class<out Event>, MutableList<StructureStatement>>>()

    fun registerListener(script: Script, event: Class<out Event>, statement: StructureStatement) {
        if (statement.structure !is StructEvent)
            throw IllegalStateException("Statement isn't an event handler")

        val scriptHandlers = handlers.putIfAbsent(script, mutableMapOf()) ?: handlers[script]!!
        val eventHandlers = scriptHandlers.putIfAbsent(event, mutableListOf()) ?: scriptHandlers[event]!!
        eventHandlers.add(statement)
    }

    fun clearListeners(script: Script) {
        handlers.remove(script)
    }

    fun callEvent(event: Event) {
        for (scriptHandlers in handlers.values)
            for (statement in scriptHandlers[event::class.java] ?: emptyList())
                if (shouldBeCalled(event, statement))
                   statement.accept()
    }

    private fun <T : Event> shouldBeCalled(event: T, statement: StructureStatement): Boolean {
        val structure = statement.structure as StructEvent
        val structureEvent = structure.event as me.honkling.skriptkt.common.syntax.Event<T>

        return structureEvent.event == event::class.java && structureEvent.check(event, statement)
    }
}