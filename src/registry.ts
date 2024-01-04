import { readdirSync } from "fs";
import { join } from "path";
import { Effect } from "./element/effect";
import { Element, ElementType } from "./element/element";
import { Event } from "./element/event";
import { Structure } from "./element/structure";
import { Pattern } from "./pattern/pattern";
import { Type } from "./element/type";
import { Expression } from "./element/expression";

export function getRegistryByType(element: Element): Map<Element, Pattern> {
    const type = element.getElementType();

    switch (type) {
        case ElementType.EVENT: return events;
        case ElementType.STRUCTURE: return structures;
        case ElementType.EFFECT: return effects;
        case ElementType.EXPRESSION: return expressions;
        default: throw new Error("Unknown element type.");
    }
}

export async function registerAll(...directories: string[]) {
    for (const directory of directories) {
        const directoryPath = join(__dirname, directory);
        const names = readdirSync(directoryPath);

        for (const name of names) {
            try {
                const path = join(directoryPath, name);
                const exports = await import(path);
                const clazz = exports.default;
    
                if (!clazz)
                    continue;
    
                const instance = new clazz.default();
                instance.initialize();
            } catch (e) {
                console.error(`An error occurred registering syntax '${directory}/${name}'`);
                throw e;
            }
        }
    }
}

export function register(element: Element, pattern: string) {
    const compiledPattern = new Pattern(pattern);
    const registry = getRegistryByType(element);
    registry.set(element, compiledPattern);
}

export function registerType(type: Type<unknown>) {
    types.set(type.id, type);
    types.set(type.plural, type);
}

export const expressions = new Map<Expression<unknown>, Pattern>();
export const structures = new Map<Structure, Pattern>();
export const types = new Map<string, Type<unknown>>();
export const effects = new Map<Effect, Pattern>();
export const events = new Map<Event, Pattern>();