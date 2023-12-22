import { MatchResult } from "../match";
import { Parser } from "../parser";
import { Statement } from "../statement/statement";
import { Element, ElementType } from "./element";

export abstract class Effect implements Element {
    public getElementType(): ElementType {
        return ElementType.EFFECT;
    }

    public abstract visit(statement: Statement): boolean;
    public abstract initialize();
}