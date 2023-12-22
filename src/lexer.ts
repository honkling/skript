export class Lexer {
    public line = 1;
    public col = 1;
    public index = 0;

    constructor(public input: string) {}

    public lex(): Token[] {
        const tokens = [];

        while (this.index < this.input.length) {
            const token = this.getNextToken();
            this.index += token.value.length;

            if (token.type === TokenTypes.NEWLINE) {
                this.line++;
                this.col = 1;
            }

            tokens.push(token);
        }

        return tokens;
    }

    private getNextToken() {
        const rest = this.input.substring(this.index);

        for (const type of Object.values(TokenTypes) as TokenType[]) {
            const match = rest.match(type.regex);

            if (match)
                return new Token(type, match[0]);
        }

        throw new Error(`Unexpected token found (${this.line}:${this.col})`);
    }
}

export class Token {
    constructor(
        public type: TokenType,
        public value: string
    ) {}

    public expect(type: TokenType): Token {
        if (this.type !== type)
            throw new Error(`Expected ${type.name}, got ${this.type.name}`);

        return this;
    }
}

export class TokenType {
    constructor(
        public name: string,
        public regex: RegExp
    ) {}
}

export let TokenTypes = {
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