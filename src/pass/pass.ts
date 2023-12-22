import { Block } from "../statement/block";
import { Node } from "../statement/node";
import { Statement } from "../statement/statement";

export abstract class Pass {
    public abstract visitStatement(statement: Statement);
    public abstract visitBlock(block: Block);
    public visit(node: Node) {
        node.accept(this)
    }
}