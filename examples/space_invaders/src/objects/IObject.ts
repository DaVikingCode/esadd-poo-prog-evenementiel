import { Container } from "pixi.js";

export interface IObject {
    kill: boolean;
    update(timeDelta: number): void;
}
