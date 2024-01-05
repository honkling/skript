import { Pass } from "../pass/pass";
import { Block } from "./block";

export class Node {
    constructor(public parent: Block | null) {}

    public accept(pass: Pass) {}
}