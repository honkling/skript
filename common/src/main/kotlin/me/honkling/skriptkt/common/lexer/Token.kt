package me.honkling.skriptkt.common.lexer

import me.honkling.skriptkt.common.output.emitError

data class Token(
    val type: TokenType,
    var raw: String,
    var start: Int
) : Cloneable {
    fun expect(type: TokenType): Token? {
        if (this.type == type)
            return this

        emitError("Expected $type, found ${this.type}")
        return null
    }

    fun expectSymbol(type: ExpectType, symbol: String): Token? {
        if (when (type) {
            ExpectType.EQUALS -> raw == symbol
            ExpectType.CONTAINS -> symbol in raw
            ExpectType.STARTS_WITH -> raw.startsWith(symbol)
            ExpectType.ENDS_WITH -> raw.endsWith(symbol)
        }) return this

        emitError("Expected '$symbol', found '$raw'")
        return null
    }

    public override fun clone(): Token {
        return super.clone() as Token
    }
}
