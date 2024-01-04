import { ElementPriority, ElementType } from "../element/element";
import { Expression } from "../element/expression";
import { Integer } from "../integer";
import { Pass } from "../pass/pass";
import { register } from "../registry";
import { ExpressionStatement } from "../statement/expression";
import { Statement } from "../statement/statement";

export default class ExprBoolean implements Expression<boolean> {
    public getPriority(): ElementPriority {
        return ElementPriority.NORMAL;
    }

    public get(pass: Pass, statement: ExpressionStatement<boolean>): boolean[] {
        return [statement.match.regexes[0][0] === "true"];
    }

    public getElementType(): ElementType {
        return ElementType.EXPRESSION;
    }

    public visit(pass: Pass, statement: Statement): boolean {
        return true;
    }

    public initialize() {
        register(this, "<(true|false)>");
    }

    public getReturnType(): Function {
        return Boolean;
    }
}