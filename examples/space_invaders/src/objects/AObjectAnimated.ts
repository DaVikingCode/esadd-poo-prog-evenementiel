import { Container } from "pixi.js";
import { IObject } from "./IObject";

export abstract class AObjectAnimated extends Container implements IObject {
    public kill = false;

    constructor() {
        super();
    }

    public update(timeDelta: number) {}
}
