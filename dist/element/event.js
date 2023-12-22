"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
const element_1 = require("./element");
class Event {
    getElementType() {
        return element_1.ElementType.EVENT;
    }
}
exports.Event = Event;
