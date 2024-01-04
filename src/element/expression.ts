import { Pass } from "../pass/pass";
import { ExpressionStatement } from "../statement/expression";
import { Statement } from "../statement/statement";
import { Element, ElementPriority, ElementType } from "./element";

export abstract class Expression<T> extends Element {
    public getPriority(): ElementPriority {
        return ElementPriority.NORMAL;
    }

    public getElementType(): ElementType {
        return ElementType.EXPRESSION;
    }

    public abstract get(pass: Pass, statement: ExpressionStatement<T>): T[] | null;
    public abstract getReturnType(): Function;
}