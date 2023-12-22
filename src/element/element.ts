import { MatchResult } from "../match";
import { Parser } from "../parser";
import { Pass } from "../pass/pass";
import { Statement } from "../statement/statement";

export abstract class Element {
    public getElementType(): ElementType { return null };
    public abstract visit(pass: Pass, statement: Statement): boolean;
    public abstract initialize();
}

export enum ElementType {
    STRUCTURE,
    EVENT,
    EFFECT,
    EXPRESSION,
    TYPE
}