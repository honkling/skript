import { Type } from "../element/type";

export class Parameter<T> {
    constructor(
        public name: string,
        public type: Type<T>,
        public defaultValue?: T
    ) {}
}