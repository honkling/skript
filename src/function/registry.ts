import { Function } from "./function";

export function registerFunction(func: Function<unknown>) {
    functions.set(func.name, func);
}

export const functions = new Map<string, Function<unknown>>();