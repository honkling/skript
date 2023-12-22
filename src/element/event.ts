import { MatchResult } from "../match";
import { Parser } from "../parser";
import { Pass } from "../pass/pass";
import { events } from "../registry";
import { StructureStatement } from "../statement/structure";
import { Element, ElementType } from "./element";

export abstract class Event implements Element {
    public getElementType(): ElementType {
        return ElementType.EVENT;
    }

    public abstract visit(pass: Pass, statement: StructureStatement): boolean;
    public abstract initialize();
}