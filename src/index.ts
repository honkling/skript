import { readFileSync } from "fs";
import { join } from "path";
import { Lexer, TokenType, TokenTypes } from "./lexer";
import { TokenStream } from "./stream";
import { Parser } from "./parser";
import { StructEvent } from "./structures/event";
import { EffTest } from "./effects/test";
import { EvtScriptLoad } from "./events/scriptLoad";

const input = readFileSync(join(__dirname, "../test.sk"), "utf8");

new StructEvent().initialize();
new EvtScriptLoad().initialize();
new EffTest().initialize();

const lexer = new Lexer(input);
const tokens = lexer.lex().filter((t) => t.type !== TokenTypes.WHITESPACE);
const stream = new TokenStream(tokens);

const parser = new Parser(stream);
const structures = parser.parse();

structures[0].structure.visit(parser, structures[0].match)