import { ElementType } from "../element/element";
import { Structure } from "../element/structure";
import { Event } from "../element/event";
import { MatchResult } from "../match";
import { events, register } from "../registry";
import { Parser } from "../parser";
import { Lexer, TokenTypes } from "../lexer";
import { TokenStream } from "../stream";

export class StructEvent implements Structure {
    public visit(parser: Parser, result: MatchResult): boolean {
        const name = result.regexes[0][0];
        const [event, match] = this.parseEvent(parser, name);

        event.visit(parser, match);

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
            const match = parser.matchPattern(pattern.compiledPattern, stream)

            if (!match)
                continue;

            return [event, match];
        }

        throw new Error("Invalid event");
    }
}