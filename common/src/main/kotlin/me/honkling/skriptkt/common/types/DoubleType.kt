package me.honkling.skriptkt.common.types

import me.honkling.skriptkt.common.syntax.Type

class DoubleType : Type<Double>("double", "doubles") {
    override fun canParse(): Boolean = false
    override fun fromStringRepresentation(input: String): Double = input.toDouble()
    override fun toStringRepresentation(input: Double): String = input.toString()
}