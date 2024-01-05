import { readFileSync } from "fs";
import { join } from "path";
import { Lexer, TokenTypes } from "./lexer";
import { TokenStream } from "./stream";
import { Parser } from "./parser";
import { PassManager } from "./pass/manager";
import { DefaultPass } from "./pass/index";
import { registerAll } from "./registry";
import { FileInput, logger } from "./logger";

const name = "test.sk";
const path = join(__dirname, "..", name);
const input = readFileSync(path, "utf8");

(async () => {
    await registerAll("types", "structures", "events", "effects", "expressions");

    logger.setFile(new FileInput(name, input));

    const lexer = new Lexer(input);
    const tokens = lexer.lex().filter((t) => t.type !== TokenTypes.WHITESPACE);
    const stream = new TokenStream(tokens);

    logger.setFile(new FileInput(name, input)); // Set again to reset logger index
    
    const parser = new Parser(stream);
    const structures = parser.parse();

    logger.release();
    
    const passes = new PassManager();
    passes.register(new DefaultPass());
    
    for (const structure of structures)
        passes.accept(structure);
})();