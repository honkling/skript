package me.honkling.skriptkt.common.pattern.element

import me.honkling.skriptkt.common.syntax.Type

data class Expression<T>(val id: String, val type: Type<T>) : PatternElement() {
    val isPlural = type.plural == id

    override fun getLength(): Int {
        return id.length + 2
    }
}
