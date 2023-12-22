import { ExpressionStatement } from "./statement/expression";

export class MatchResult {
    constructor(
        public expressions: ExpressionStatement<unknown>[],
        public regexes: RegExpExecArray[]
    ) {}
}