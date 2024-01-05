import { Pass } from "../pass/pass";
import { SymbolTable } from "../symbols/symbolTable";
import { Node } from "./node";
import { Statement } from "./statement";

export class Block implements Node {
    public symbolTable = new SymbolTable();

    constructor(public statements: Statement[], public parent: Block | null) {}

    public accept(pass: Pass): void {
        pass.visitBlock(this);
    }

    public getSymbolByName(name: string): any {
        if (this.symbolTable.has(name))
            return this.symbolTable.get(name);

        if (this.parent)
            return this.parent.getSymbolByName(name);

        return null;
    }
}