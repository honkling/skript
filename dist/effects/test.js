"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EffTest = void 0;
const element_1 = require("../element/element");
const registry_1 = require("../registry");
class EffTest {
    visit(parser, result) {
        return true;
    }
    getElementType() {
        return element_1.ElementType.EFFECT;
    }
    initialize() {
        (0, registry_1.register)(this, "run test effect");
    }
}
exports.EffTest = EffTest;
