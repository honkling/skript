package me.honkling.skriptkt.common.pattern

import me.honkling.skriptkt.common.Skript
import me.honkling.skriptkt.common.pattern.element.*

fun compilePattern(pattern: String, vararg breakIf: Char): Sentence {
    val elements = mutableListOf<PatternElement>()
    var index = 0

    while (index < pattern.length) {
        val first = pattern[index]

        when {
            first == ' ' -> index++
            first == '(' -> {
                val choice = compileChoice(pattern, index)
                index += choice.getLength()
                elements.add(choice)
            }
            first == '[' -> {
                val optional = compileOptional(pattern, index)
                index += optional.getLength()
                elements.add(optional)
            }
            first == '<' -> {
                val regex = compileRegex(pattern, index)
                index += regex.getLength()
                elements.add(regex)
            }
            first == '%' -> {
                val expression = compileExpression(pattern, index)
                index += expression.getLength()
                elements.add(expression)
            }
            first in breakIf -> break
            else -> {
                val builder = StringBuilder()
                var char = pattern[index]

                while (index < pattern.length && char !in " ([<${breakIf.joinToString("")}") {
                    index++
                    builder.append(char)

                    if (index < pattern.length)
                        char = pattern[index]
                }

                val literal = Literal(builder.toString())
                elements.add(literal)
            }
        }
    }

    return Sentence(elements)
}

private fun compileExpression(pattern: String, originalIndex: Int): Expression<*> {
    if (pattern[originalIndex] != '%')
        throw IllegalArgumentException("Expected '%', found '${pattern[originalIndex]}'")

    val builder = StringBuilder()
    var index = originalIndex
    index++

    var char = pattern[index]
    while (char != '%') {
        index++
        builder.append(char)
        char = pattern[index]
    }

    val id = builder.toString()
    val type = Skript.syntaxRegistry.types[id]
        ?: throw IllegalArgumentException("Invalid type '$id'.")

    return Expression(id, type)
}

private fun compileRegex(pattern: String, originalIndex: Int): RegEx {
    if (pattern[originalIndex] != '<')
        throw IllegalArgumentException("Expected '<', found '${pattern[originalIndex]}'")

    val builder = StringBuilder()
    var index = originalIndex
    index++

    var char = pattern[index]
    while (char != '>') {
        if (char == '\\') {
            val next = pattern[index + 1]

            if (next == '>') {
                builder.append(next)
                index += 2
                continue
            }
        }

        index++
        builder.append(char)
        char = pattern[index]
    }

    return RegEx(Regex(builder.toString()))
}

private fun compileOptional(pattern: String, index: Int): Optional {
    if (pattern[index] != '[')
        throw IllegalArgumentException("Expected '[', found '${pattern[index]}'")

    val sentence = compilePattern(pattern.substring(index + 1), ']')
    return Optional(sentence)
}

private fun compileChoice(pattern: String, originalIndex: Int): Choice {
    if (pattern[originalIndex] != '(')
        throw IllegalArgumentException("Expected '(', found '${pattern[originalIndex]}'")

    val choices = mutableListOf<Sentence>()
    var index = originalIndex

    while (pattern[index] == '|' || index == originalIndex) {
        index++
        choices += compilePattern(pattern.substring(index), '|', ')')
    }

    return Choice(choices)
}