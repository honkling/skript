"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenStream = void 0;
class TokenStream {
    tokens;
    index;
    constructor(tokens, index = 0) {
        this.tokens = tokens;
        this.index = index;
    }
    peek() {
        if (this.index >= this.tokens.length)
            throw new Error("Unexpected end of file");
        return this.tokens[this.index];
    }
    consume() {
        if (this.index >= this.tokens.length)
            throw new Error("Unexpected end of file");
        return this.tokens[this.index++];
    }
    branch() {
        return new TokenStream(this.tokens, this.index);
    }
    merge(stream) {
        this.index = stream.index;
    }
    isEnd() {
        return this.index + 1 >= this.tokens.length;
    }
}
exports.TokenStream = TokenStream;
