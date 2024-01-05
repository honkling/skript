import { ElementPriority, ElementType } from "../element/element";
import { Expression } from "../element/expression";
import { Pass } from "../pass/pass";
import { register } from "../registry";
import { ExpressionStatement } from "../statement/expression";
import { Statement } from "../statement/statement";
import { symbolTable } from "../symbols/symbolTable";

export default class ExprVariable implements Expression<any> {
    public getPriority(): ElementPriority {
        return ElementPriority.NORMAL;
    }

    public get(pass: Pass, statement: ExpressionStatement<any>): any[] {
        const name = statement.match.regexes[0][0];
        const isLocal = name.startsWith("_");
        const values = isLocal
            ? statement.parent.getSymbolByName(name)
            : symbolTable.get(name);

        return values.values;
    }

    public getElementType(): ElementType {
        return ElementType.EXPRESSION;
    }

    public visit(pass: Pass, statement: Statement): boolean {
        return true;
    }

    public initialize() {
        register(this, "{<[^}]+>}");
    }

    public getReturnType(): Function {
        return Object;
    }
}