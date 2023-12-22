import { ElementType } from "../element/element";
import { Type } from "../element/type";
import { Pass } from "../pass/pass";
import { registerType } from "../registry";
import { Statement } from "../statement/statement";

export default class StringType extends Type<string> {
    constructor() {
        super("string", "strings", String);
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

    public fromStringRepresentation(input: string): string {
        return input;
    }

    public toStringRepresentation(input: string): string {
        return input;
    }
}