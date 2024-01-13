package me.honkling.skriptkt.common.syntax

import me.honkling.skriptkt.common.events.Event
import me.honkling.skriptkt.common.statement.StructureStatement

abstract class Event<T : Event>(val event: Class<T>) : Structure() {
    abstract fun check(event: T, statement: StructureStatement): Boolean
}
