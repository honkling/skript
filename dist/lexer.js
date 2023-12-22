"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenTypes = exports.TokenType = exports.Token = exports.Lexer = void 0;
class Lexer {
    input;
    line = 1;
    col = 1;
    index = 0;
    constructor(input) {
        this.input = input;
    }
    lex() {
        const tokens = [];
        while (this.index < this.input.length) {
            const token = this.getNextToken();
            this.index += token.value.length;
            if (token.type === exports.TokenTypes.NEWLINE) {
                this.line++;
                this.col = 1;
            }
            tokens.push(token);
        }
        return tokens;
    }
    getNextToken() {
        const rest = this.input.substring(this.index);
        for (const type of Object.values(exports.TokenTypes)) {
            const match = rest.match(type.regex);
            if (match)
                return new Token(type, match[0]);
        }
        throw new Error(`Unexpected token found (${this.line}:${this.col})`);
    }
}
exports.Lexer = Lexer;
class Token {
    type;
    value;
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
    expect(type) {
        if (this.type !== type)
            throw new Error(`Expected ${type.name}, got ${this.type.name}`);
        return this;
    }
}
exports.Token = Token;
class TokenType {
    name;
    regex;
    constructor(name, regex) {
        this.name = name;
        this.regex = regex;
    }
}
exports.TokenType = TokenType;
exports.TokenTypes = {
    LITERAL_STRING: new TokenType("LITERAL_STRING", /^"(\\\"|[^"])*"/),
    LITERAL_INTEGER: new TokenType("LITERAL_INTEGER", /^\d+/),
    LITERAL_NUMBER: new TokenType("LITERAL_NUMBER", /^\d+\.\d+/),
    LITERAL_BOOLEAN: new TokenType("LITERAL_BOOLEAN", /^(true|false)/),
    TAB: new TokenType("TAB", /^( {2,4}|\t)/),
    WHITESPACE: new TokenType("WHITESPACE", /^ +/),
    NEWLINE: new TokenType("NEWLINE", /^\n/),
    SYMBOL_OPEN_PAREN: new TokenType("SYMBOL_OPEN_PAREN", /^\(/),
    SYMBOL_CLOSE_PAREN: new TokenType("SYMBOL_CLOSE_PAREN", /^\)/),
    SYMBOL_EQUALS: new TokenType("SYMBOL_EQUALS", /^=/),
    SYMBOL_COLON: new TokenType("SYMBOL_COLON", /^:/),
    COMMENT: new TokenType("COMMENT", /^#.*/),
    IDENTIFIER: new TokenType("IDENTIFIER", /^[^\s()[\]=:]+/)
};
