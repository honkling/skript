import { Type } from "../element/type";

export class SymbolValue<T> {
    constructor(
        public type: Type<T>,
        public isList: boolean,
        public values: T[]
    ) {}
}

export class SymbolTable extends Map<string, SymbolValue<unknown>> {};
export const symbolTable = new SymbolTable();