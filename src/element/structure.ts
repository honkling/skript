import { MatchResult } from "../match";
import { Parser } from "../parser";
import { Pass } from "../pass/pass";
import { StructureStatement } from "../statement/structure";
import { Element, ElementType } from "./element";

export abstract class Structure implements Element {
    public getElementType(): ElementType {
        return ElementType.STRUCTURE;
    }

    public abstract visit(pass: Pass, statement: StructureStatement): boolean;
    public abstract initialize();
}