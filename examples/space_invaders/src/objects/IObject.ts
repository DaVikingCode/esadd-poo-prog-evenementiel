import { Container } from "pixi.js";

export interface IObject {
    x: number;
    y: number;
    width: number;
    height: number;
    kill: boolean;
    update(timeDelta: number): void;
    content: Container;
}
