import { Effect } from "../element/effect";
import { ElementType } from "../element/element";
import { MatchResult } from "../match";
import { Parser } from "../parser";
import { register } from "../registry";

export class EffTest implements Effect {
    public visit(parser: Parser, result: MatchResult): boolean {
        return true;
    }

    public getElementType(): ElementType {
        return ElementType.EFFECT;
    }

    public initialize() {
        register(this, "run test effect");
    }

}