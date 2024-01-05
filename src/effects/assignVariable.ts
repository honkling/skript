import { Effect } from "../element/effect";
import { ElementPriority, ElementType } from "../element/element";
import { Pass } from "../pass/pass";
import { getTypeByConstructor, register } from "../registry";
import { EffectStatement } from "../statement/effect";
import { SymbolValue, symbolTable } from "../symbols/symbolTable";

export default class EffAssignVariable implements Effect {
    public getPriority(): ElementPriority {
        return ElementPriority.NORMAL;
    }

    public visit(pass: Pass, statement: EffectStatement): boolean {
        const name = statement.match.regexes[0][0];
        const [expression] = statement.match.expressions;
        const values = expression.value as any[];
        const type = getTypeByConstructor(expression.expression.getReturnType());

        const isList = name.endsWith("::*");
        const isLocal = name.startsWith("_");
        const value = new SymbolValue(type, isList, values);

        if (isLocal)
            statement.parent.symbolTable.set(name, value);

        symbolTable.set(name, value);

        return true;
    }

    public getElementType(): ElementType {
        return ElementType.EFFECT;
    }

    public initialize() {
        register(this, "set {<[^}]+>} to %objects%");
    }

}