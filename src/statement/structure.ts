import { Structure } from "../element/structure";
import { MatchResult } from "../match";
import { Parser } from "../parser";
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
    
    public visit() {
        
    }

}