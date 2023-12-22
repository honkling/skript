import { ElementType } from "../element/element";
import { Event } from "../element/event";
import { MatchResult } from "../match";
import { Parser } from "../parser";
import { events, register } from "../registry";
import { Statement } from "../statement/statement";
import { StructureStatement } from "../statement/structure";

export class EvtScriptLoad implements Event {
    public visit(statement: Statement): boolean {
        
        return true;
    }

    public getElementType(): ElementType {
        return ElementType.EVENT;
    }

    public initialize() {
        register(this, "script load");
    }
}