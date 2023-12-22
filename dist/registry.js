"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.events = exports.effects = exports.structures = exports.register = exports.getRegistryByType = void 0;
const element_1 = require("./element/element");
const pattern_1 = require("./pattern/pattern");
function getRegistryByType(element) {
    const type = element.getElementType();
    switch (type) {
        case element_1.ElementType.EVENT: return exports.events;
        case element_1.ElementType.STRUCTURE: return exports.structures;
        case element_1.ElementType.EFFECT: return exports.effects;
        default: throw new Error("Unknown element type.");
    }
}
exports.getRegistryByType = getRegistryByType;
function register(element, pattern) {
    const compiledPattern = new pattern_1.Pattern(pattern);
    const registry = getRegistryByType(element);
    registry.set(element, compiledPattern);
}
exports.register = register;
exports.structures = new Map();
exports.effects = new Map();
exports.events = new Map();
