import { Effect } from "../element/effect";
import { ElementType } from "../element/element";
import { MatchResult } from "../match";
import { Parser } from "../parser";
import { Pass } from "../pass/pass";
import { register } from "../registry";
import { EffectStatement } from "../statement/effect";
import { Statement } from "../statement/statement";

export default class EffTest implements Effect {
    public visit(pass: Pass, statement: EffectStatement): boolean {
        console.log(`test :+${statement.match.expressions[0].value}:`);
        return true;
    }

    public getElementType(): ElementType {
        return ElementType.EFFECT;
    }

    public initialize() {
        register(this, "run test effect as %integer%");
    }

}