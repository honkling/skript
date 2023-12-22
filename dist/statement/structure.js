"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StructureStatement = void 0;
const statement_1 = require("./statement");
class StructureStatement extends statement_1.Statement {
    parser;
    structure;
    block;
    match;
    constructor(parser, structure, block, match) {
        super();
        this.parser = parser;
        this.structure = structure;
        this.block = block;
        this.match = match;
    }
    visit() {
    }
}
exports.StructureStatement = StructureStatement;
