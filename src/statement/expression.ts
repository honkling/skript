import { Expression } from "../element/expression";
import { MatchResult } from "../match";
import { Parser } from "../parser";
import { Pass } from "../pass/pass";
import { Block } from "./block";

export class ExpressionStatement<T> {
    public value: T[];

    constructor(
        public parser: Parser,
        public expression: Expression<T>,
        public match: MatchResult,
        public parent: Block
    ) {}

    public accept(pass: Pass): T[] | null {
        return this.value = this.expression.get(pass, this);
    }
}