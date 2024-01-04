import { Type } from "../element/type";
import { Block } from "../statement/block";
import { Parameter } from "./parameter";

export class Function<T> {
    constructor(
        public name: string,
        public parameters: Parameter<unknown>[],
        public returnType: Type<T>,
        public block: Block
    ) {}
}