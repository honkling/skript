import { Effect } from "../element/effect";
import { ElementPriority, ElementType } from "../element/element";
import { Pass } from "../pass/pass";
import { register } from "../registry";
import { EffectStatement } from "../statement/effect";

export default class EffTest implements Effect {
    public getPriority(): ElementPriority {
        return ElementPriority.NORMAL;
    }

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