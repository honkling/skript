import { Effect } from "../element/effect";
import { Statement } from "./statement";

export class EffectStatement implements Statement {
    constructor(public effect: Effect) {}

    public visit() {
        
    }
}