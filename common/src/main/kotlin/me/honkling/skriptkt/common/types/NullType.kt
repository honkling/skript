package me.honkling.skriptkt.common.types

import me.honkling.skriptkt.common.syntax.Type

class NullType : Type<Unit?>("null", "nulls") {
    override fun canParse(): Boolean = false
    override fun fromStringRepresentation(input: String) = null
    override fun toStringRepresentation(input: Unit?): String = ""
}