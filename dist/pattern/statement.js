"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Regex = exports.Union = exports.Optional = exports.Literal = exports.Sentence = void 0;
class Sentence {
    data;
    constructor(data) {
        this.data = data;
    }
}
exports.Sentence = Sentence;
class Literal {
    data;
    constructor(data) {
        this.data = data;
    }
}
exports.Literal = Literal;
class Optional {
    data;
    constructor(data) {
        this.data = data;
    }
}
exports.Optional = Optional;
class Union {
    data;
    constructor(data) {
        this.data = data;
    }
}
exports.Union = Union;
class Regex {
    data;
    constructor(data) {
        this.data = data;
    }
}
exports.Regex = Regex;
