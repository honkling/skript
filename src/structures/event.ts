import { ElementType } from "../element/element";
import { Structure } from "../element/structure";
import { Event } from "../element/event";
import { MatchResult } from "../match";
import { events, register } from "../registry";
import { Parser } from "../parser";
import { Lexer, TokenTypes } from "../lexer";
import { TokenStream } from "../stream";
import { StructureStatement } from "../statement/structure";
import { Pass } from "../pass/pass";

export default class StructEvent implements Structure {
    public visit(pass: Pass, statement: StructureStatement): boolean {
        const { match: result, parser } = statement;
        const name = result.regexes[0][0];
        const [event, match] = this.parseEvent(parser, name);

        console.log("visiting event");
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
            const match = parser.matchPattern(pattern.compiledPattern, stream)

            if (!match)
                continue;

            return [event, match];
        }

        throw new Error("Invalid event");
    }
}