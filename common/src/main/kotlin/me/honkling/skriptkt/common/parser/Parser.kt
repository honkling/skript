package me.honkling.skriptkt.common.parser

import me.honkling.skriptkt.common.Skript
import me.honkling.skriptkt.common.annotations.ExprType
import me.honkling.skriptkt.common.lexer.ExpectType
import me.honkling.skriptkt.common.lexer.Lexer
import me.honkling.skriptkt.common.lexer.TokenType
import me.honkling.skriptkt.common.node.Block
import me.honkling.skriptkt.common.output.emitError
import me.honkling.skriptkt.common.output.emitWarning
import me.honkling.skriptkt.common.output.emittedErrors
import me.honkling.skriptkt.common.output.emittedWarnings
import me.honkling.skriptkt.common.pattern.element.*
import me.honkling.skriptkt.common.pattern.element.Expression
import me.honkling.skriptkt.common.script.Script
import me.honkling.skriptkt.common.statement.*
import me.honkling.skriptkt.common.syntax.Expression as SyntaxExpression
import me.honkling.skriptkt.common.syntax.*

class Parser(val script: Script, val stream: TokenStream) {
    val file = script.file

    fun parse(): ParseResult {
        val statements = mutableListOf<Statement>()

        while (!stream.isEnd()) {
            val structure = parseStructure() ?: continue

            statements += structure
        }

        return ParseResult(
            file,
            emittedErrors,
            emittedWarnings,
            statements,
            emptyMap())
    }

    private fun parseStructure(): StructureStatement? {
        val structures = Skript.syntaxRegistry.structures
        val result = parseSyntaxElement(structures, null)

        if (result == null) {
            skipBlock()
            emitError("Invalid structure.")
            return null
        }

        val (structure, match) = result
        val block = parseBlock(null)

        if (block == null) {
            emitError("Invalid section. Does the section contain errors?")
            skipBlock()
            return null
        }

        return StructureStatement(this, script, structure.construct() as Structure, block, match)
    }

    private fun parseSection(parent: Block): SectionStatement? {
        val sections = Skript.syntaxRegistry.sections
        val result = parseSyntaxElement(sections, parent)

        if (result == null) {
            emitError("Invalid section.")
            return null
        }

        val (section, match) = result
        val block = parseBlock(null)

        if (block == null) {
            emitError("Invalid section. Does the section contain errors?")
            skipBlock()
            return null
        }

        return SectionStatement(this, parent, section.construct() as Section, block, match)
    }

    private fun parseBlock(parent: Block?): Block? {
        val block = Block(parent, mutableListOf())

        if (stream.consume().expectSymbol(ExpectType.EQUALS, ":") == null)
            return null

        if (stream.isEnd()) {
            emitWarning("Empty section.")
            return block
        }

        if (stream.consume().expect(TokenType.NEWLINE) == null)
            return null

        if (stream.isEnd() || stream.peek().type != TokenType.WHITESPACE) {
            emitWarning("Empty section.")
            return block
        }

        var indentation = -1
        var indentType = null as IndentationType?
        var depth = 1

        while (!stream.isEnd()) {
            if (stream.peek().type == TokenType.NEWLINE)
                stream.consume()

            if (stream.isEnd())
                break

            // Detect indentation of the block & subsequent sections.
            if (indentation == -1) {
                val token = stream.peek()
                indentation = token.raw.length
                indentType = getType(token.raw[0])
            }

            if (stream.peek().type == TokenType.IDENTIFIER)
                break

            val token = stream.consume().expect(TokenType.WHITESPACE)
                ?: return null

            val requirement = indentation * depth
            if (token.raw.length != requirement) {
                emitError("Expected $requirement $indentType, found ${token.raw.length} ${getType(token.raw[0])}")
                return null
            }

            if (!stream.isEnd() && stream.peek().type == TokenType.NEWLINE) {
                stream.consume()
                continue
            }

            val statement = parseEffect(block)
                ?: return null

            if (!stream.isEnd() && stream.consume().expect(TokenType.NEWLINE) == null)
                return null

            block.statements.add(statement)
        }

        return block
    }

    private fun parseEffect(parent: Block): EffectStatement? {
        val effects = Skript.syntaxRegistry.effects
        val result = parseSyntaxElement(effects, parent)

        if (result == null) {
            emitError("Invalid effect.")
            return null
        }

        val (effect, match) = result
        return EffectStatement(this, parent, effect.construct() as Effect, match)
    }

    private fun <T : Any?> parseExpression(type: Type<T>, parent: Block?, stream: TokenStream = this.stream): ExpressionStatement<T>? {
        val expressions = Skript.syntaxRegistry.expressions
        val result = parseSyntaxElement(expressions, parent, stream) {
            val id = it.getAnnotation(ExprType::class.java).type
            id == type.id || id == type.plural
        }

        if (result == null) {
            emitError("Invalid expression.")
            return null
        }

        val (expression, match) = result
        return ExpressionStatement(this, parent, expression.construct() as SyntaxExpression<*>, match) as ExpressionStatement<T>
    }

    fun parseSyntaxElement(
        elements: List<Class<out SyntaxElement>>,
        parent: Block?,
        stream: TokenStream = this.stream,
        filter: (Class<out SyntaxElement>) -> Boolean = { true }
    ): Pair<Class<out SyntaxElement>, PatternMatchResult>? {
        for (element in elements) {
            if (!filter.invoke(element))
                continue

            val pattern = element.getPattern() ?: continue
            return element to (matchPattern(pattern, parent, stream)
                ?: continue)
        }

        return null
    }

    private fun matchPattern(pattern: Sentence, parent: Block?, stream: TokenStream = this.stream): PatternMatchResult? {
        val expressions = mutableListOf<ExpressionStatement<*>>()
        val regexes = mutableListOf<MatchResult>()
        val tags = mutableListOf<String>()
        val branch = stream.branch()

        top@for (patternElement in pattern.elements) {
            when (patternElement) {
                is Literal -> {
                    val token = branch.peek()
                    val raw = token.raw.lowercase()
                    val value = patternElement.value.lowercase()

                    if (raw != value) {
                        if (raw.startsWith(value)) {
                            token.raw = token.raw.substring(value.length)
                            token.start += value.length
                            continue
                        }

                        return null
                    }

                    branch.consume()
                }

                is Optional -> {
                    val match = matchPattern(patternElement.sentence, parent, branch) ?: continue
                    regexes += match.regexes
                    expressions += match.expressions
                    tags += match.tags
                }

                is Choice -> {
                    for ((choice, tag) in patternElement.choices) {
                        val match = matchPattern(choice, parent, branch) ?: continue

                        regexes += match.regexes
                        expressions += match.expressions
                        if (tag != null)
                            tags += tag

                        continue@top
                    }

                    return null
                }

                is RegEx -> {
                    val input = constructInput(branch)
                    val match = patternElement.regex.find(input)
                        ?: return null

                    // todo: is there a better way than lexing the match?
                    for (token in Lexer(match.value).lex()) {
                        val currentToken = branch.peek()
                        val currentRaw = currentToken.raw.lowercase()
                        val raw = token.raw.lowercase()

                        if (currentRaw != raw && currentRaw.startsWith(raw)) {
                            currentToken.raw = currentToken.raw.substring(raw.length)
                            currentToken.start += raw.length
                            continue
                        }

                        branch.consume().expect(token.type)
                    }

                    regexes += match
                }

                is Expression<*> -> {
                    val type = patternElement.type
                    val expression = parseExpression(type, parent, branch)
                        ?: return null

                    expressions.add(expression)
                }
            }

            skipWhitespace(branch)
        }

        stream.merge(branch)
        return PatternMatchResult(regexes, expressions, tags)
    }

    private fun constructInput(stream: TokenStream): String {
        val builder = StringBuilder()
        val branch = stream.branch()

        while (!branch.isEnd()) {
            val first = branch.consume()
            val next = branch.peekOrLastToken()

            if (first.type == TokenType.NEWLINE)
                break

            builder.append(first.raw)

            if (!branch.isEnd() && first.type == TokenType.IDENTIFIER && next.type == TokenType.IDENTIFIER)
                builder.append(" ")
        }

        return builder.toString()
    }

    private fun skipBlock() {
        while (!stream.isEnd()) {
            val token = stream.consume()

            if (!stream.isEnd() && token.type == TokenType.NEWLINE && stream.peek().type == TokenType.IDENTIFIER)
                break
        }
    }

    private fun skipWhitespace(stream: TokenStream) {
        if (!stream.isEnd() && stream.peek().type == TokenType.WHITESPACE)
            stream.consume()
    }
}