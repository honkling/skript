import { stat } from "fs";
import { ElementPriority, ElementType } from "../element/element";
import { Event } from "../element/event";
import { MatchResult } from "../match";
import { Parser } from "../parser";
import { Pass } from "../pass/pass";
import { events, register } from "../registry";
import { Statement } from "../statement/statement";
import { StructureStatement } from "../statement/structure";

export default class EvtScriptLoad implements Event {
    public getPriority(): ElementPriority {
        return ElementPriority.NORMAL;
    }

    public visit(pass: Pass, statement: StructureStatement): boolean {
        statement.block.accept(pass);
        return true;
    }

    public getElementType(): ElementType {
        return ElementType.EVENT;
    }

    public initialize() {
        register(this, "script load");
    }
}