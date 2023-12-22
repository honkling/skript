import { Pass } from "../pass/pass";
import { Statement } from "../statement/statement";
import { Element, ElementType } from "./element";

export abstract class Expression<T> extends Element {
    public getElementType(): ElementType {
        return ElementType.EXPRESSION;
    }

    public abstract get(pass: Pass, statement: Statement): T | null;
    public abstract getReturnType(): Function;
}