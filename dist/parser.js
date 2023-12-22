"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const lexer_1 = require("./lexer");
const match_1 = require("./match");
const statement_1 = require("./pattern/statement");
const registry_1 = require("./registry");
const block_1 = require("./statement/block");
const effect_1 = require("./statement/effect");
const structure_1 = require("./statement/structure");
class Parser {
    stream;
    constructor(stream) {
        this.stream = stream;
    }
    parse() {
        const structures = [];
        while (!this.stream.isEnd()) {
            const structure = this.parseStructure();
            structures.push(structure);
        }
        return structures;
    }
    parseEffect() {
        for (const [effect, pattern] of registry_1.effects.entries()) {
            if (!this.matchPattern(pattern.compiledPattern))
                continue;
            if (!this.stream.isEnd())
                this.stream.consume().expect(lexer_1.TokenTypes.NEWLINE);
            return new effect_1.EffectStatement(effect);
        }
        throw new Error("Invalid effect");
    }
    parseStructure() {
        for (const [structure, pattern] of registry_1.structures.entries()) {
            const match = this.matchPattern(pattern.compiledPattern);
            if (!match)
                continue;
            this.stream.peek().expect(lexer_1.TokenTypes.SYMBOL_COLON);
            const block = this.parseBlock();
            return new structure_1.StructureStatement(structure, block, match);
        }
        throw new Error("Invalid structure");
    }
    parseBlock() {
        const statements = [];
        let indentation = 0;
        this.stream.consume().expect(lexer_1.TokenTypes.SYMBOL_COLON);
        if (!this.stream.isEnd())
            this.stream.consume().expect(lexer_1.TokenTypes.NEWLINE);
        if (this.stream.isEnd() || this.stream.peek().type !== lexer_1.TokenTypes.TAB) {
            console.log("[WARN] Empty block");
            return new block_1.Block(statements);
        }
        while (!this.stream.isEnd() && this.stream.peek().type === lexer_1.TokenTypes.TAB) {
            let badEffect = false;
            if (indentation !== 0) {
                for (let i = 0; i < indentation; i++) {
                    if (this.stream.peek().type !== lexer_1.TokenTypes.TAB) {
                        badEffect = true;
                        break;
                    }
                    this.stream.consume().expect(lexer_1.TokenTypes.TAB);
                }
                if (badEffect)
                    break;
                if (this.stream.peek().type === lexer_1.TokenTypes.TAB)
                    throw new Error(`Invalid indentation, expected ${indentation} tabs, found more`);
            }
            if (indentation === 0)
                while (this.stream.peek().type === lexer_1.TokenTypes.TAB) {
                    this.stream.consume();
                    indentation++;
                }
            if (indentation === 0) {
                console.log("[WARN] Empty block");
                return new block_1.Block([]);
            }
            const statement = this.parseEffect();
            statements.push(statement);
        }
        return new block_1.Block(statements);
    }
    matchPattern(sentence, origin = this.stream) {
        const stream = origin.branch();
        const regexes = [];
        for (const index in sentence.data) {
            const first = sentence.data[index];
            const next = sentence.data[parseInt(index) + 1];
            if (first instanceof statement_1.Literal) {
                const token = stream.consume();
                if (first.data != token.value)
                    return null;
            }
            if (first instanceof statement_1.Optional) {
                if (!this.matchPattern(first.data, stream) && !this.matchPattern(next.data, stream))
                    return null;
            }
            if (first instanceof statement_1.Union) {
                let matched = false;
                for (const sentence of first.data) {
                    if (this.matchPattern(sentence, stream)) {
                        matched = true;
                        break;
                    }
                }
                if (!matched)
                    return null;
            }
            if (first instanceof statement_1.Regex) {
                const input = this.constructInput(stream);
                const match = input.match(first.data);
                if (!match)
                    return null;
                regexes.push(match);
                const tokens = new lexer_1.Lexer(match[0])
                    .lex()
                    .filter((t) => t.type !== lexer_1.TokenTypes.WHITESPACE);
                for (const token of tokens)
                    stream.consume().expect(token.type);
            }
        }
        origin.merge(stream);
        return new match_1.MatchResult(regexes);
    }
    constructInput(origin) {
        const stream = origin.branch();
        let input = "";
        while (!stream.isEnd()) {
            const first = stream.consume();
            if (first.type === lexer_1.TokenTypes.NEWLINE)
                break;
            input += first.value;
            if (first.type === lexer_1.TokenTypes.IDENTIFIER && !stream.isEnd() && stream.peek().type === lexer_1.TokenTypes.IDENTIFIER)
                input += " ";
        }
        return input;
    }
}
exports.Parser = Parser;
