import { Pass } from "../pass/pass";
import { Statement } from "../statement/statement";
import { Element, ElementType } from "./element";

export abstract class Type<T> implements Element {
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