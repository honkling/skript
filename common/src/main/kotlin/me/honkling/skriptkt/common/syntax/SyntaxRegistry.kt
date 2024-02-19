package me.honkling.skriptkt.common.syntax

import me.honkling.skriptkt.common.annotations.Syntax
import me.honkling.skriptkt.common.pattern.compilePattern
import me.honkling.skriptkt.common.pattern.element.Sentence

class SyntaxRegistry {
    private var acceptingRegistration = true

    val patterns = mutableMapOf<Class<out SyntaxElement>, Sentence>()
    val expressions = mutableListOf<Class<out Expression<*>>>()
    val structures = mutableListOf<Class<out Structure>>()
    val sections = mutableListOf<Class<out Section>>()
    val events = mutableListOf<Class<out Event<*>>>()
    val effects = mutableListOf<Class<out Effect>>()
    val types = mutableMapOf<String, Type<*>>()

    @Suppress("UNCHECKED_CAST")
    fun register(syntaxElement: Class<out SyntaxElement>) {
        if (!acceptingRegistration)
            throw IllegalStateException("Skript is no longer accepting registration for syntax.")

        when {
            Event::class.java.isAssignableFrom(syntaxElement) -> {
                events.add(syntaxElement as Class<out Event<*>>)
            }

            Section::class.java.isAssignableFrom(syntaxElement) -> {
                sections.add(syntaxElement as Class<out Section>)
            }

            Structure::class.java.isAssignableFrom(syntaxElement) -> {
                structures.add(syntaxElement as Class<out Structure>)
            }

            Effect::class.java.isAssignableFrom(syntaxElement) -> {
                effects.add(syntaxElement as Class<out Effect>)
            }

            Expression::class.java.isAssignableFrom(syntaxElement) -> {
                expressions.add(syntaxElement as Class<out Expression<*>>)
            }

            Type::class.java.isAssignableFrom(syntaxElement) -> {
                val instance = syntaxElement.construct() as Type<*>
                types[instance.id] = instance
                types[instance.plural] = instance
            }

            else -> throw IllegalArgumentException("Attempted to register syntax with an unknown type.")
        }

        if (!Type::class.java.isAssignableFrom(syntaxElement))
            patterns[syntaxElement] = compilePattern(getInformation(syntaxElement).pattern)
    }

    fun endRegistration() {
        acceptingRegistration = false

        expressions.sortBy(::getPriority)
        structures.sortBy(::getPriority)
        sections.sortBy(::getPriority)
        effects.sortBy(::getPriority)
        events.sortBy(::getPriority)
    }

    private fun getPriority(clazz: Class<out SyntaxElement>): Int {
        return getInformation(clazz).priority.ordinal
    }

    private fun getInformation(clazz: Class<out SyntaxElement>): Syntax {
        return clazz.getAnnotation(Syntax::class.java)
    }
}