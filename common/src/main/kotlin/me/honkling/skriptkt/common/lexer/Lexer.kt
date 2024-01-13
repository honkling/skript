package me.honkling.skriptkt.common.lexer

class Lexer(private val input: String) {
    private var index = 0

    fun lex(): List<Token> {
        val tokens = mutableListOf<Token>()

        while (!isEnd()) {
            tokens += getNextToken()
            index += tokens.last().raw.length
        }

        return tokens
    }

    private fun getNextToken(): Token {
        val input = input.substring(index)

        for (type in TokenType.entries)
            if (type.regex.containsMatchIn(input))
                return Token(
                    type,
                    type.regex.find(input)!!.value,
                    index
                )

        // This should never happen.
        throw IllegalStateException("Found unexpected token.")
    }

    private fun isEnd(): Boolean {
        return index >= input.length
    }
}