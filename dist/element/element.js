"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElementType = exports.Element = void 0;
class Element {
    getElementType() { return null; }
    ;
}
exports.Element = Element;
var ElementType;
(function (ElementType) {
    ElementType[ElementType["STRUCTURE"] = 0] = "STRUCTURE";
    ElementType[ElementType["EVENT"] = 1] = "EVENT";
    ElementType[ElementType["EFFECT"] = 2] = "EFFECT";
})(ElementType || (exports.ElementType = ElementType = {}));
