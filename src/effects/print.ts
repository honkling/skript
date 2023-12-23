import { Effect } from "../element/effect";
import { ElementType } from "../element/element";
import { Pass } from "../pass/pass";
import { register } from "../registry";
import { EffectStatement } from "../statement/effect";
import { Statement } from "../statement/statement";

export default class EffPrint implements Effect {
    public getElementType(): ElementType {
        return ElementType.EFFECT;
    }

    public visit(pass: Pass, statement: EffectStatement): boolean {
        for (const message of statement.match.expressions[0].value)
            console.log(message);
        
        return true;
    }

    public initialize() {
        register(this, "print %objects%");
    }
}