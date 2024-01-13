package me.honkling.skriptkt.common.types

import me.honkling.skriptkt.common.syntax.Type

class StringType : Type<String>("string", "strings") {
    override fun canParse(): Boolean = false
    override fun fromStringRepresentation(input: String): String = input
    override fun toStringRepresentation(input: String): String = input
}