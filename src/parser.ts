import { Element } from "./element/element";
import { Expression } from "./element/expression";
import { Type } from "./element/type";
import { Lexer, TokenTypes } from "./lexer";
import { logger } from "./logger";
import { MatchResult } from "./match";
import { Expression as PatternExpression, Literal, Optional, Regex, Sentence, Union } from "./pattern/statement";
import { effects, expressions, structures } from "./registry";
import { Block } from "./statement/block";
import { EffectStatement } from "./statement/effect";
import { ExpressionStatement } from "./statement/expression";
import { StructureStatement } from "./statement/structure";
import { TokenStream } from "./stream";

export class Parser {
    public structures = this.sort(structures);
    public effects = this.sort(effects);
    public expressions = this.sort(expressions);

    constructor(public stream: TokenStream) {}

    public sort<K extends Element, V>(registry: Map<K, V>): [K, V][] {
        return Array.from(registry.entries())
            .sort(([a], [b]) => {
                const priorityA = a.getPriority();
                const priorityB = b.getPriority();

                if (priorityA < priorityB)
                    return 1;
                else if (priorityA === priorityB)
                    return 0;
                else if (priorityA > priorityB)
                    return -1;
            });
    }

    public parse(): StructureStatement[] {
        const structures = [];

        while (!this.stream.isEnd()) {
            const structure = this.parseStructure();

            if (!structure)
                continue;

            structures.push(structure);
        }

        return structures;
    }

    public parseEffect(parent: Block): EffectStatement {
        for (const [effect, pattern] of this.effects) {
            const match = this.matchPattern(pattern.compiledPattern, parent);

            if (!match)
                continue;

            if (!this.stream.isEnd()) {
                if (this.stream.peek().type === TokenTypes.NEWLINE)
                    this.stream.consume().expect(TokenTypes.NEWLINE);
                else continue;
            }

            return new EffectStatement(this, effect, match, parent);
        }

        logger.error("Invalid effect");
        return null;
    }

    public parseStructure(parent?: Block): StructureStatement {
        for (const [structure, pattern] of this.structures) {
            const match = this.matchPattern(pattern.compiledPattern, parent);

            if (!match)
                continue;

            this.stream.peek().expect(TokenTypes.SYMBOL_COLON);
            const block = this.parseBlock();

            if (!this.stream.isEnd())
                this.stream.consume().expect(TokenTypes.NEWLINE);

            return new StructureStatement(this, structure, block, match, parent);
        }

        logger.error("Invalid structure");
        return null;
    }

    public parseBlock(parent?: Block): Block {
        const block = new Block([], parent);
        let indentation = 0;

        this.stream.consume().expect(TokenTypes.SYMBOL_COLON);

        if (!this.stream.isEnd())
            this.stream.consume().expect(TokenTypes.NEWLINE);
        
        if (this.stream.isEnd() || this.stream.peek().type !== TokenTypes.TAB) {
            console.log("[WARN] Empty block");
            return block;
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

                if (this.stream.peek().type === TokenTypes.TAB) {
                    logger.error(`Invalid indentation, expected ${indentation} tabs, found more`);
                    break;
                }
            }

            if (indentation === 0)
                while (this.stream.peek().type === TokenTypes.TAB) {
                    this.stream.consume();
                    indentation++;
                }

            if (indentation === 0) {
                logger.warn("Empty block");
                return block;
            }

            const statement = this.parseEffect(block);

            if (!statement) {
                while (!this.stream.isEnd() && this.stream.peek().type !== TokenTypes.NEWLINE)
                    this.stream.consume();

                if (!this.stream.isEnd())
                    this.stream.consume().expect(TokenTypes.NEWLINE);

                continue;
            }

            block.statements.push(statement);
        }

        return block;
    }

    public parseExpression<T>(type: Type<T>, stream: TokenStream, parent: Block): ExpressionStatement<T> {
        for (const [expression, pattern] of this.expressions) {
            if (expression.getReturnType() !== type.type && type.type !== Object)
                continue;

            const match = this.matchPattern(pattern.compiledPattern, parent, stream);

            if (!match)
                continue;

            return new ExpressionStatement<T>(this, expression as Expression<T>, match, parent);
        }

        logger.error("Invalid expression");
        return null;
    }

    public matchPattern(sentence: Sentence, parent?: Block, origin: TokenStream = this.stream): MatchResult | null {
        const stream = origin.branch();
        const expressions = [];
        const regexes = [];
        const loggerPosition = logger.position.branch();

        for (const index in sentence.data) {
            const first = sentence.data[index];
            const next = sentence.data[parseInt(index) + 1];
            
            if (first instanceof Literal) {
                const token = stream.consume();

                if (first.data != token.value)
                    return null;

                loggerPosition.advance(token.value.length);
            }

            if (first instanceof Optional) {
                if (!this.matchPattern(first.data, parent, stream) && !this.matchPattern(next.data, parent, stream))
                    return null;
            }

            if (first instanceof Union) {
                let matched = false;

                for (const sentence of first.data) {
                    if (this.matchPattern(sentence, parent, stream)) {
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
                loggerPosition.advance(match[0].length);

                const tokens = new Lexer(match[0])
                    .lex()
                    .filter((t) => t.type !== TokenTypes.WHITESPACE);

                for (const token of tokens)
                    stream.consume().expect(token.type);
            }

            if (first instanceof PatternExpression) {
                const expression = this.parseExpression(first.data.type, stream, parent);

                if (!expression)
                    break;

                expressions.push(expression);
            }
        }

        logger.position.merge(loggerPosition);
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