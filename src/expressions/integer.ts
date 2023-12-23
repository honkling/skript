import { ElementType } from "../element/element";
import { Expression } from "../element/expression";
import { Integer } from "../integer";
import { Pass } from "../pass/pass";
import { register } from "../registry";
import { ExpressionStatement } from "../statement/expression";
import { Statement } from "../statement/statement";

export default class ExprInteger implements Expression<number> {
    public get(pass: Pass, statement: ExpressionStatement<number>): number[] {
        return [parseInt(statement.match.regexes[0][0])];
    }

    public getElementType(): ElementType {
        return ElementType.EXPRESSION;
    }

    public visit(pass: Pass, statement: Statement): boolean {
        return true;
    }

    public initialize() {
        register(this, "<\\d+(?!\d*\.)>");
    }

    public getReturnType(): Function {
        return Integer;
    }
}