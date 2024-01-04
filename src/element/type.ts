import { Pass } from "../pass/pass";
import { Statement } from "../statement/statement";
import { Element, ElementPriority, ElementType } from "./element";

export abstract class Type<T> implements Element {
    public getPriority(): ElementPriority {
        return ElementPriority.NORMAL;
    }

    constructor(public id: string, public plural: string, public type: Function) {}

    public getElementType(): ElementType {
        return ElementType.TYPE;
    }

    public abstract visit(pass: Pass, statement: Statement): boolean;
    public abstract initialize();
    public abstract canParse(): boolean;
    public abstract fromStringRepresentation(input: string): T;
    public abstract toStringRepresentation(input: T): string;
}