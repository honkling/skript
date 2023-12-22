import { stat } from "fs";
import { Block } from "../statement/block";
import { Node } from "../statement/node";
import { Statement } from "../statement/statement";
import { Pass } from "./pass";

export class DefaultPass implements Pass {
    public visitStatement(statement: Statement) {
        statement.accept(this);
    }

    public visitBlock(block: Block) {
        for (const statement of block.statements)
            statement.accept(this);
    }

    public visit(node: Node): void {
        node.accept(this);
    }
}