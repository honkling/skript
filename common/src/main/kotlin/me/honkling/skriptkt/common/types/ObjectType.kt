package me.honkling.skriptkt.common.types

import me.honkling.skriptkt.common.syntax.Type

class ObjectType : Type<Any?>("object", "objects") {
    override fun canParse(): Boolean = false
    override fun fromStringRepresentation(input: String): Any? = null
    override fun toStringRepresentation(input: Any?): String = input.toString()
}