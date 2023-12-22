import { Element } from "./element/element";
import { Expression } from "./element/expression";
import { Structure } from "./element/structure";
import { Type } from "./element/type";
import { Lexer, TokenTypes } from "./lexer";
import { MatchResult } from "./match";
import { Expression as PatternExpression, Literal, Optional, Regex, Sentence, Union } from "./pattern/statement";
import { effects, expressions, structures } from "./registry";
import { Block } from "./statement/block";
import { EffectStatement } from "./statement/effect";
import { ExpressionStatement } from "./statement/expression";
import { StructureStatement } from "./statement/structure";
import { TokenStream } from "./stream";

export class Parser {
    constructor(public stream: TokenStream) {}

    public parse(): StructureStatement[] {
        const structures = [];

        while (!this.stream.isEnd()) {
            const structure = this.parseStructure();

            structures.push(structure);
        }

        return structures;
    }

    public parseEffect(): EffectStatement {
        for (const [effect, pattern] of effects.entries()) {
            const match = this.matchPattern(pattern.compiledPattern);

            if (!match)
                continue;

            if (!this.stream.isEnd())
                this.stream.consume().expect(TokenTypes.NEWLINE);

            return new EffectStatement(this, effect, match);
        }

        throw new Error("Invalid effect");
    }

    public parseStructure(): StructureStatement {
        for (const [structure, pattern] of structures.entries()) {
            const match = this.matchPattern(pattern.compiledPattern);

            if (!match)
                continue;

            this.stream.peek().expect(TokenTypes.SYMBOL_COLON);

            const block = this.parseBlock();
            return new StructureStatement(this, structure, block, match);
        }

        throw new Error("Invalid structure");
    }

    public parseBlock(): Block {
        const statements = [];
        let indentation = 0;

        this.stream.consume().expect(TokenTypes.SYMBOL_COLON);

        if (!this.stream.isEnd())
            this.stream.consume().expect(TokenTypes.NEWLINE);
        
        if (this.stream.isEnd() || this.stream.peek().type !== TokenTypes.TAB) {
            console.log("[WARN] Empty block");
            return new Block(statements);
        }

        while (!this.stream.isEnd() && this.stream.peek().type === TokenTypes.TAB) {
            let badEffect = false;

            if (indentation !== 0) {
                for (let i = 0; i < indentation; i++) {
                    if (this.stream.peek().type !== TokenTypes.TAB) {
                        badEffect = true;
                        break;
                    }

                    this.stream.consume().expect(TokenTypes.TAB);
                }

                if (badEffect)
                    break;

                if (this.stream.peek().type === TokenTypes.TAB)
                    throw new Error(`Invalid indentation, expected ${indentation} tabs, found more`);
            }

            if (indentation === 0)
                while (this.stream.peek().type === TokenTypes.TAB) {
                    this.stream.consume();
                    indentation++;
                }

            if (indentation === 0) {
                console.log("[WARN] Empty block");
                return new Block([]);
            }

            const statement = this.parseEffect();
            statements.push(statement);
        }

        return new Block(statements);
    }

    public parseExpression<T>(type: Type<T>, stream: TokenStream): ExpressionStatement<T> {
        for (const [expression, pattern] of expressions.entries()) {
            if (expression.getReturnType() !== type.type)
                continue;

            const match = this.matchPattern(pattern.compiledPattern, stream);

            if (!match)
                continue;

            return new ExpressionStatement<T>(this, expression as Expression<T>, match);
        }

        throw new Error("Invalid structure");
    }

    public matchPattern(sentence: Sentence, origin: TokenStream = this.stream): MatchResult | null {
        const stream = origin.branch();
        const expressions = [];
        const regexes = [];

        for (const index in sentence.data) {
            const first = sentence.data[index];
            const next = sentence.data[parseInt(index) + 1];
            
            if (first instanceof Literal) {
                const token = stream.consume();

                if (first.data != token.value)
                    return null;
            }

            if (first instanceof Optional) {
                if (!this.matchPattern(first.data, stream) && !this.matchPattern(next.data, stream))
                    return null;
            }

            if (first instanceof Union) {
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

            if (first instanceof Regex) {
                const input = this.constructInput(stream);
                const match = input.match(first.data);

                if (!match)
                    return null;

                regexes.push(match);

                const tokens = new Lexer(match[0])
                    .lex()
                    .filter((t) => t.type !== TokenTypes.WHITESPACE);

                for (const token of tokens)
                    stream.consume().expect(token.type);
            }

            if (first instanceof PatternExpression) {
                const expression = this.parseExpression(first.data.type, stream);
                expressions.push(expression);
            }
        }

        origin.merge(stream);
        return new MatchResult(expressions, regexes);
    }

    public constructInput(origin: TokenStream): string {
        const stream = origin.branch();

        let input = "";

        while (!stream.isEnd()) {
            const first = stream.consume();

            if (first.type === TokenTypes.NEWLINE)
                break;
            
            input += first.value;

            if (first.type === TokenTypes.IDENTIFIER && !stream.isEnd() && stream.peek().type === TokenTypes.IDENTIFIER)
                input += " ";
        }

        return input;
    }
}