import { ElementPriority, ElementType } from "../element/element";
import { Structure } from "../element/structure";
import { Event } from "../element/event";
import { MatchResult } from "../match";
import { events, register, types } from "../registry";
import { Parser } from "../parser";
import { Lexer, TokenTypes } from "../lexer";
import { TokenStream } from "../stream";
import { StructureStatement } from "../statement/structure";
import { Pass } from "../pass/pass";
import { Type } from "../element/type";
import { Function } from "../function/function";
import { registerFunction } from "../function/registry";

export default class StructFunction implements Structure {
    public getPriority(): ElementPriority {
        return ElementPriority.NORMAL;
    }

    public visit(pass: Pass, statement: StructureStatement): boolean {
        const func = new Function(
            statement.match.regexes[0][0],
            [],
            types.get("null"),
            statement.block
        );

        registerFunction(func);

        return true;
    }

    public getElementType(): ElementType {
        return ElementType.STRUCTURE;
    }

    public initialize() {
        register(this, "function <[a-zA-Z0-9]+>\\(\\)");
    }
}