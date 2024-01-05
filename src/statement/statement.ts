import { Pass } from "../pass/pass";
import { Block } from "./block";
import { Node } from "./node";

export abstract class Statement implements Node {
    constructor(public parent: Block) {}

    public abstract accept(pass: Pass);
}