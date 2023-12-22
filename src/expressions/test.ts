import { ElementType } from "../element/element";
import { Expression } from "../element/expression";
import { Integer } from "../integer";
import { Pass } from "../pass/pass";
import { register } from "../registry";
import { Statement } from "../statement/statement";

export default class ExprTest implements Expression<number> {
    public get(pass: Pass, statement: Statement): number {
        return 10;
    }

    public getElementType(): ElementType {
        return ElementType.EXPRESSION;
    }

    public visit(pass: Pass, statement: Statement): boolean {
        return true;
    }

    public initialize() {
        register(this, "test expression");
    }

    public getReturnType(): Function {
        return Integer;
    }
}