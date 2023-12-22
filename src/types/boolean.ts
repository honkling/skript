import { ElementType } from "../element/element";
import { Type } from "../element/type";
import { Pass } from "../pass/pass";
import { registerType } from "../registry";
import { Statement } from "../statement/statement";

export default class IntegerType extends Type<boolean> {
    constructor() {
        super("boolean", "booleans", Boolean);
    }

    public getElementType(): ElementType {
        return ElementType.TYPE;
    }

    public initialize() {
        registerType(this);
    }

    public visit(pass: Pass, statement: Statement): boolean {
        return true;
    }

    public canParse(): boolean {
        return true;
    }

    public fromStringRepresentation(input: string): boolean {
        return input.toLowerCase() !== "false";
    }

    public toStringRepresentation(input: boolean): string {
        return input.toString();
    }
}