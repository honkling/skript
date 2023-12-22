"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvtScriptLoad = void 0;
const element_1 = require("../element/element");
const registry_1 = require("../registry");
class EvtScriptLoad {
    visit(parser, result) {
        console.log("script load!");
        return true;
    }
    getElementType() {
        return element_1.ElementType.EVENT;
    }
    initialize() {
        (0, registry_1.register)(this, "script load");
    }
}
exports.EvtScriptLoad = EvtScriptLoad;
