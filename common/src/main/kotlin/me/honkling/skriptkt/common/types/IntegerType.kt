package me.honkling.skriptkt.common.types

import me.honkling.skriptkt.common.syntax.Type

class IntegerType : Type<Int>("integer", "integers") {
    override fun canParse(): Boolean = false
    override fun fromStringRepresentation(input: String): Int = input.toInt()
    override fun toStringRepresentation(input: Int): String = input.toString()
}