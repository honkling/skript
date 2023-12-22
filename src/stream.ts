import { Token } from "./lexer";

export class TokenStream {
    constructor(
        public tokens: Token[],
        public index: number = 0
    ) {}

    public peek(): Token {
        if (this.index >= this.tokens.length)
            throw new Error("Unexpected end of file");

        return this.tokens[this.index];
    }

    public consume(): Token {
        if (this.index >= this.tokens.length)
            throw new Error("Unexpected end of file");

        return this.tokens[this.index++];
    }

    public branch(): TokenStream {
        return new TokenStream(this.tokens, this.index);
    }

    public merge(stream: TokenStream) {
        this.index = stream.index;
    }

    public isEnd(): boolean {
        return this.index + 1 >= this.tokens.length;
    }
}