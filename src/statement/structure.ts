import { Structure } from "../element/structure";
import { MatchResult } from "../match";
import { Parser } from "../parser";
import { Pass } from "../pass/pass";
import { Block } from "./block";
import { Statement } from "./statement";

export class StructureStatement extends Statement {
    constructor(
        public parser: Parser,
        public structure: Structure,
        public block: Block,
        public match: MatchResult
    ) {
        super();
    }
    
    public accept(pass: Pass) {
        for (const expression of this.match.expressions)
            expression.accept(pass);
            
        this.structure.visit(pass, this);
    }
}