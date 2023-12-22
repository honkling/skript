import { readFileSync } from "fs";
import { join } from "path";
import { Lexer, TokenTypes } from "./lexer";
import { TokenStream } from "./stream";
import { Parser } from "./parser";
import { PassManager } from "./pass/manager";
import { DefaultPass } from "./pass/index";
import { registerAll } from "./registry";

const input = readFileSync(join(__dirname, "../test.sk"), "utf8");

(async () => {
    await registerAll("types", "structures", "events", "effects", "expressions");
    
    const lexer = new Lexer(input);
    const tokens = lexer.lex().filter((t) => t.type !== TokenTypes.WHITESPACE);
    const stream = new TokenStream(tokens);
    
    const parser = new Parser(stream);
    const structures = parser.parse();
    
    const passes = new PassManager();
    passes.register(new DefaultPass());
    
    for (const structure of structures)
        passes.accept(structure);
})();