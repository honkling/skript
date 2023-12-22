import { MatchResult } from "../match";
import { Parser } from "../parser";
import { events } from "../registry";
import { StructureStatement } from "../statement/structure";
import { Element, ElementType } from "./element";

export abstract class Event implements Element {
    public getElementType(): ElementType {
        return ElementType.EVENT;
    }

    public abstract visit(statement: StructureStatement): boolean;
    public abstract initialize();
}