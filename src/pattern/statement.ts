import { Type } from "../element/type";

export interface PatternElement {
    data: any;
}

export class Sentence implements PatternElement {
    constructor(public data: PatternElement[]) {}
}

export class Literal implements PatternElement {
    constructor(public data: string) {}
}

export class Optional implements PatternElement {
    constructor(public data: Sentence) {}
}

export class Union implements PatternElement {
    constructor(public data: Sentence[]) {}
}

export class Regex implements PatternElement {
    constructor(public data: RegExp) {}
}

export class Expression implements PatternElement {
    constructor(public data: {
        type: Type<unknown>,
        plural: boolean
    }) {}
}