package me.honkling.skriptkt.common.events

import me.honkling.skriptkt.common.statement.StructureStatement
import me.honkling.skriptkt.common.structures.StructEvent

class EventHandler {
    private val handlers = mutableMapOf<Class<out Event>, MutableList<StructureStatement>>()

    fun registerListener(event: Class<out Event>, statement: StructureStatement) {
        if (statement.structure !is StructEvent)
            throw IllegalStateException("Statement isn't an event handler")

        handlers.putIfAbsent(event, mutableListOf())
        handlers[event]!!.add(statement)
    }

    fun callEvent(event: Event) {
        for (statement in handlers[event::class.java] ?: emptyList())
            if (shouldBeCalled(event, statement))
                statement.accept()
    }

    private fun <T : Event> shouldBeCalled(event: T, statement: StructureStatement): Boolean {
        val structure = statement.structure as StructEvent
        val structureEvent = structure.event as me.honkling.skriptkt.common.syntax.Event<T>

        return structureEvent.event == event::class.java && structureEvent.check(event, statement)
    }
}