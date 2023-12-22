"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StructEvent = void 0;
const element_1 = require("../element/element");
const registry_1 = require("../registry");
const lexer_1 = require("../lexer");
const stream_1 = require("../stream");
class StructEvent {
    visit(parser, result) {
        const name = result.regexes[0][0];
        const [event, match] = this.parseEvent(parser, name);
        event.visit(parser, match);
        return true;
    }
    getElementType() {
        return element_1.ElementType.STRUCTURE;
    }
    initialize() {
        (0, registry_1.register)(this, "[on] <[^:]+>");
    }
    parseEvent(parser, name) {
        const tokens = new lexer_1.Lexer(name)
            .lex()
            .filter((t) => t.type !== lexer_1.TokenTypes.WHITESPACE);
        const stream = new stream_1.TokenStream(tokens);
        for (const [event, pattern] of registry_1.events.entries()) {
            const match = parser.matchPattern(pattern.compiledPattern, stream);
            if (!match)
                continue;
            return [event, match];
        }
        throw new Error("Invalid event");
    }
}
exports.StructEvent = StructEvent;
