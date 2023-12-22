import { Effect } from "../element/effect";
import { ElementType } from "../element/element";
import { Pass } from "../pass/pass";
import { register } from "../registry";
import { Statement } from "../statement/statement";

export default class EffPrint implements Effect {
    public getElementType(): ElementType {
        return ElementType.EFFECT;
    }

    public visit(pass: Pass, statement: Statement): boolean {
        
        
        return true;
    }

    public initialize() {
        register(this, "print %strings%");
    }
}