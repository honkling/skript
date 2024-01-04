import { ElementPriority, ElementType } from "../element/element";
import { Expression } from "../element/expression";
import { Integer } from "../integer";
import { Pass } from "../pass/pass";
import { register } from "../registry";
import { ExpressionStatement } from "../statement/expression";
import { Statement } from "../statement/statement";

export default class ExprString implements Expression<string> {
    public getPriority(): ElementPriority {
        return ElementPriority.NORMAL;
    }

    public get(pass: Pass, statement: ExpressionStatement<string>): string[] {
        const value = statement.match.regexes[0][0].replace(/\\"/g, "\"");

        return [value.substring(1, value.length - 1)];
    }

    public getElementType(): ElementType {
        return ElementType.EXPRESSION;
    }

    public visit(pass: Pass, statement: Statement): boolean {
        return true;
    }

    public initialize() {
        register(this, "<\"(\\\\\"|[^\"])*\">");
    }

    public getReturnType(): Function {
        return String;
    }
}