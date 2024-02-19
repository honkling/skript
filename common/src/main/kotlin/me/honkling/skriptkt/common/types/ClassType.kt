package me.honkling.skriptkt.common.types

import me.honkling.skriptkt.common.syntax.Type

class ClassType : Type<Class<*>>("class", "classes") {
    override fun canParse(): Boolean = true
    override fun fromStringRepresentation(input: String): Class<*> {
        return Class.forName(input)
    }

    override fun toStringRepresentation(input: Class<*>): String {
        return input.name
    }
}