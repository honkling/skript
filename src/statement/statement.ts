import { Pass } from "../pass/pass";
import { Node } from "./node";

export abstract class Statement implements Node {
    public abstract accept(pass: Pass);
}