import { ElementType } from "../element/element";
import { Type } from "../element/type";
import { Integer } from "../integer";
import { Pass } from "../pass/pass";
import { registerType } from "../registry";
import { Statement } from "../statement/statement";

export default class IntegerType extends Type<number> {
    constructor() {
        super("integer", "integers", Integer);
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

    public fromStringRepresentation(input: string): number {
        return parseInt(input);
    }

    public toStringRepresentation(input: number): string {
        return input.toString();
    }
}