import { type } from "os";
import { types } from "../registry";
import { Expression, Literal, Optional, PatternElement, Regex, Sentence, Union } from "./statement";

export class Pattern {
    public compiledPattern: Sentence;
    private index = 0;

    constructor(public pattern: string) {
        this.compiledPattern = this.compile();
    }

    private compile(): Sentence {
        const elements = [];

        while (this.index < this.pattern.length)
            elements.push(this.compileElement());

        return new Sentence(elements);
    }

    private compileElement(): PatternElement {
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
            case "%": {
                const element = this.compileExpression();
                const char = this.pattern[this.index];

                if (char === " " || char === "\n")
                    this.index++;

                return element;
            }
        }

        while (this.index < this.pattern.length) {
            const char = this.pattern[this.index];

            if ("[(<|%".includes(char))
                break;

            if (char === " " || char === "\n") {
                this.index++;
                break;
            }

            if (char === "\\") {
                const next = this.pattern[this.index + 1];

                if (!"[]()<>|%\\".includes(next))
                    throw new Error("Invalid escape");

                if (literal !== "")
                    break;

                literal += next;
                this.index += 2;
                break;
            }

            if ("])|>%".includes(char))
                break;

            literal += char;
            this.index++;
        }

        return new Literal(literal);
    }

    private compileOptional(): Optional {
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

        return new Optional(new Sentence(elements));
    }

    private compileExpression(): Expression {
        let id = "";

        if (this.pattern[this.index] !== "%")
            throw new Error("Expected % when parsing expression");

        this.index++;
        let char;

        while ((char = this.pattern[this.index]) !== "%") {
            if (!char)
                throw new Error("Expression is not closed");

            id += char;
            this.index++;
        }

        if (char !== "%")
            throw new Error("Expected % when parsing expression");

        const type = types.get(id);
        
        if (!type)
            throw new Error("Unknown type.");

        this.index++;
        return new Expression({
            type: type,
            plural: id === type.plural
        });
    }

    private compileRegex(): Regex {
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

                if (next === ">") {
                    regex += next;
                    this.index += 2;
                    continue;
                }
            }

            regex += char;
            this.index++;
        }

        if (char !== ">")
            throw new Error("Expected > when parsing regex");

        this.index++;
        return new Regex(new RegExp(regex, "im"));
    }

    private compileUnion(): Union {
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
                choices.push(new Sentence(elements));
                elements = [];
                this.index++;
            }

            elements.push(this.compileElement());
        }

        choices.push(new Sentence(elements));

        if (!rest.startsWith(")"))
            throw new Error("Expected ) when parsing union");

        this.index++;

        return new Union(choices);
    }

    private getRest(): string {
        return this.pattern.substring(this.index);
    }
}

