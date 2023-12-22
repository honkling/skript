"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pattern = void 0;
const statement_1 = require("./statement");
class Pattern {
    pattern;
    compiledPattern;
    index = 0;
    constructor(pattern) {
        this.pattern = pattern;
        this.compiledPattern = this.compile();
    }
    compile() {
        const elements = [];
        while (this.index < this.pattern.length)
            elements.push(this.compileElement());
        return new statement_1.Sentence(elements);
    }
    compileElement() {
        const rest = this.getRest();
        let literal = "";
        switch (rest[0]) {
            case "[": {
                const element = this.compileOptional();
                const char = this.pattern[this.index];
                if (char === " " || char === "\n")
                    this.index++;
                return element;
            }
            case "(": {
                const element = this.compileUnion();
                const char = this.pattern[this.index];
                if (char === " " || char === "\n")
                    this.index++;
                return element;
            }
            case "<": {
                const element = this.compileRegex();
                const char = this.pattern[this.index];
                if (char === " " || char === "\n")
                    this.index++;
                return element;
            }
        }
        while (this.index < this.pattern.length) {
            const char = this.pattern[this.index];
            if (char === " " || char === "\n") {
                this.index++;
                break;
            }
            if (char === "\\") {
                const next = this.pattern[this.index + 1];
                if (!"[]()<>|\\".includes(next))
                    throw new Error("Invalid escape");
                literal += next;
                this.index += 2;
                continue;
            }
            if ("])|>".includes(char))
                break;
            literal += char;
            this.index++;
        }
        return new statement_1.Literal(literal);
    }
    compileOptional() {
        let rest = this.getRest();
        let elements = [];
        if (!rest.startsWith("["))
            throw new Error("Expected [ when parsing optional");
        this.index++;
        while (!(rest = this.getRest()).startsWith("]")) {
            if (rest.length === 0)
                throw new Error("Optional is not closed");
            elements.push(this.compileElement());
        }
        if (this.pattern[this.index] !== "]")
            throw new Error("Expected ] when parsing optional");
        this.index++;
        return new statement_1.Optional(new statement_1.Sentence(elements));
    }
    compileRegex() {
        let regex = "^";
        if (this.pattern[this.index] !== "<")
            throw new Error("Expected < when parsing regex");
        this.index++;
        let char;
        while ((char = this.pattern[this.index]) !== ">") {
            if (!char)
                throw new Error("Regex is not closed");
            if (char === "\\") {
                const next = this.pattern[this.index + 1];
                if (!"\\>".includes(next))
                    throw new Error("Invalid escape");
                regex += next;
                this.index += 2;
                continue;
            }
            regex += char;
            this.index++;
        }
        if (char !== ">")
            throw new Error("Expected > when parsing regex");
        this.index++;
        return new statement_1.Regex(new RegExp(regex, "im"));
    }
    compileUnion() {
        let rest = this.getRest();
        const choices = [];
        let elements = [];
        if (!rest.startsWith("("))
            throw new Error("Expected ( when parsing union");
        this.index++;
        while (!(rest = this.getRest()).startsWith(")")) {
            if (rest.length === 0)
                throw new Error("Union is not closed");
            if (rest.startsWith("|")) {
                choices.push(new statement_1.Sentence(elements));
                elements = [];
                this.index++;
            }
            elements.push(this.compileElement());
        }
        choices.push(new statement_1.Sentence(elements));
        if (!rest.startsWith(")"))
            throw new Error("Expected ) when parsing union");
        this.index++;
        return new statement_1.Union(choices);
    }
    getRest() {
        return this.pattern.substring(this.index);
    }
}
exports.Pattern = Pattern;
