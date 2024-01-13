package me.honkling.skriptkt.common.types

import me.honkling.skriptkt.common.syntax.Type

class BooleanType : Type<Boolean>("boolean", "booleans") {
    override fun canParse(): Boolean = false
    override fun fromStringRepresentation(input: String): Boolean = input.lowercase() != "false"
    override fun toStringRepresentation(input: Boolean): String = input.toString()
}