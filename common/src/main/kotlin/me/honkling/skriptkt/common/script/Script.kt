package me.honkling.skriptkt.common.script

import me.honkling.skriptkt.common.Skript
import me.honkling.skriptkt.common.events.ScriptLoadEvent
import me.honkling.skriptkt.common.lexer.Lexer
import me.honkling.skriptkt.common.lexer.Token
import me.honkling.skriptkt.common.node.Node
import me.honkling.skriptkt.common.output.emittedErrors
import me.honkling.skriptkt.common.output.emittedWarnings
import me.honkling.skriptkt.common.parser.ParseResult
import me.honkling.skriptkt.common.parser.Parser
import me.honkling.skriptkt.common.parser.TokenStream
import me.honkling.skriptkt.common.statement.StructureStatement
import me.honkling.skriptkt.common.structures.StructEvent
import java.io.File

data class Script(val file: File) {
    val exportedSymbols = mutableMapOf<String, Node>()

    fun reload(): ParseResult {
        // Reset script for reloading
        Skript.listeners.clearListeners(this)
        exportedSymbols.clear()

        // Reset output
        emittedErrors.clear()
        emittedWarnings.clear()

        val tokens = lex()
        val stream = TokenStream(tokens)
        val parseResult = parse(stream)

        exportedSymbols.putAll(parseResult.exportedSymbols)

        return parseResult
    }

    private fun lex(): List<Token> {
        val lexer = Lexer(file.readText())
        return lexer.lex()
    }

    private fun parse(stream: TokenStream): ParseResult {
        val parser = Parser(this, stream)
        Skript.parser = parser
        Skript.currentlyParsing = this
        return parser.parse()
    }
}
