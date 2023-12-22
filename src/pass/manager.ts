import { StructureStatement } from "../statement/structure";
import { Pass } from "./pass";

export class PassManager {
    public passes = [] as Pass[];

    public register(pass: Pass) {
        this.passes.push(pass);
    }

    public accept(statement: StructureStatement) {
        for (const pass of this.passes)
            pass.visitStatement(statement);
    }
}