package me.honkling.skriptkt.common.parser

import me.honkling.skriptkt.common.lexer.Token

class TokenStream(var tokens: List<Token>, private var index: Int = 0) {
    fun walkBack() {
        index--
    }

    fun peek(): Token {
        return tokens[index]
    }

    fun consume(): Token {
        return tokens[index++]
    }

    fun peekOrLastToken(): Token {
        return if (isEnd()) tokens.last()
               else tokens[index]
    }

    fun isEnd(): Boolean {
        return index >= tokens.size
    }

    fun branch(): TokenStream {
        return TokenStream(tokens.map { it.clone() }, index)
    }

    fun merge(stream: TokenStream) {
        tokens = stream.tokens
        index = stream.index
    }
}