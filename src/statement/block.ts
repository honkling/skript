import { Pass } from "../pass/pass";
import { Node } from "./node";
import { Statement } from "./statement";

export class Block implements Node {
    constructor(public statements: Statement[]) {}

    public accept(pass: Pass): void {
        pass.visitBlock(this);
    }
}