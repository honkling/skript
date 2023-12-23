import { ElementType } from "../element/element";
import { Type } from "../element/type"
import { Pass } from "../pass/pass";
import { registerType } from "../registry";
import { Statement } from "../statement/statement";

export default class ObjectType extends Type<any> {
    constructor() {
        super("object", "objects", Object);
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
        return false;
    }

    public fromStringRepresentation(input: string): any {
        return null;
    }

    public toStringRepresentation(input: object): string {
        return input.toString();
    }
}