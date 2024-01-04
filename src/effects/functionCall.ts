import { Effect } from "../element/effect";
import { ElementPriority, ElementType } from "../element/element";
import { functions } from "../function/registry";
import { Pass } from "../pass/pass";
import { register } from "../registry";
import { EffectStatement } from "../statement/effect";

export default class EffFunctionCall implements Effect {
    public getPriority(): ElementPriority {
        return ElementPriority.NORMAL;
    }

    public getElementType(): ElementType {
        return ElementType.EFFECT;
    }

    public visit(pass: Pass, statement: EffectStatement): boolean {
        const name = statement.match.regexes[0][0];
        const func = functions.get(name);

        if (!func)
            throw new Error(`Couldn't find a function named '${name}'`);

        func.block.accept(pass);
        
        return true;
    }

    public initialize() {
        register(this, "<[0-9a-zA-Z]+>\\(\\)");
    }
}