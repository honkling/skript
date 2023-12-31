import { ElementPriority, ElementType } from "../element/element";
import { Structure } from "../element/structure";
import { Event } from "../element/event";
import { MatchResult } from "../match";
import { events, register } from "../registry";
import { Parser } from "../parser";
import { Lexer, TokenTypes } from "../lexer";
import { TokenStream } from "../stream";
import { StructureStatement } from "../statement/structure";
import { Pass } from "../pass/pass";
import { Block } from "../statement/block";

export default class StructEvent implements Structure {
    public getPriority(): ElementPriority {
        return ElementPriority.LOW;
    }

    public visit(pass: Pass, statement: StructureStatement): boolean {
        const { match: result, parser } = statement;
        const name = result.regexes[0][0];
        const [event] = this.parseEvent(parser, name);

        event.visit(pass, statement);

        return true;
    }

    public getElementType(): ElementType {
        return ElementType.STRUCTURE;
    }

    public initialize() {
        register(this, "[on] <[^:]+>");
    }

    private parseEvent(parser: Parser, name: string): [Event, MatchResult] {
        const tokens = new Lexer(name)
            .lex()
            .filter((t) => t.type !== TokenTypes.WHITESPACE);
        const stream = new TokenStream(tokens);

        for (const [event, pattern] of events.entries()) {
            const match = parser.matchPattern(pattern.compiledPattern, null, stream)

            if (!match)
                continue;

            return [event, match];
        }

        throw new Error("Invalid event");
    }
}