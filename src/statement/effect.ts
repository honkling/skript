import { Effect } from "../element/effect";
import { MatchResult } from "../match";
import { Parser } from "../parser";
import { Pass } from "../pass/pass";
import { Statement } from "./statement";

export class EffectStatement implements Statement {
    constructor(
        public parser: Parser,
        public effect: Effect,
        public match: MatchResult
    ) {}

    public accept(pass: Pass) {
        for (const expression of this.match.expressions)
            expression.accept(pass);
            
        this.effect.visit(pass, this);
    }
}