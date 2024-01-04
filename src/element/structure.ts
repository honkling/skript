import { MatchResult } from "../match";
import { Parser } from "../parser";
import { Pass } from "../pass/pass";
import { StructureStatement } from "../statement/structure";
import { Element, ElementPriority, ElementType } from "./element";

export abstract class Structure implements Element {
    public getPriority(): ElementPriority {
        return ElementPriority.NORMAL;
    }

    public getElementType(): ElementType {
        return ElementType.STRUCTURE;
    }

    public abstract visit(pass: Pass, statement: StructureStatement): boolean;
    public abstract initialize();
}