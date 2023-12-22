import { Effect } from "./element/effect";
import { Element, ElementType } from "./element/element";
import { Event } from "./element/event";
import { Structure } from "./element/structure";
import { Pattern } from "./pattern/pattern";

export function getRegistryByType(element: Element): Map<Element, Pattern> {
    const type = element.getElementType();

    switch (type) {
        case ElementType.EVENT: return events;
        case ElementType.STRUCTURE: return structures;
        case ElementType.EFFECT: return effects;
        default: throw new Error("Unknown element type.");
    }
}

export function register(element: Element, pattern: string) {
    const compiledPattern = new Pattern(pattern);
    const registry = getRegistryByType(element);

    registry.set(element, compiledPattern);
}

export const structures = new Map<Structure, Pattern>();
export const effects = new Map<Effect, Pattern>();
export const events = new Map<Event, Pattern>();