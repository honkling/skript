import { MatchResult } from "../match";
import { Parser } from "../parser";
import { Pass } from "../pass/pass";
import { Statement } from "../statement/statement";
import { Element, ElementPriority, ElementType } from "./element";

export abstract class Effect implements Element {
    public getPriority(): ElementPriority {
        return ElementPriority.NORMAL;
    }

    public getElementType(): ElementType {
        return ElementType.EFFECT;
    }

    public abstract visit(pass: Pass, statement: Statement): boolean;
    public abstract initialize();
}