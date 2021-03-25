import { Sprite, Texture } from "pixi.js";
import { IObject } from "./IObject";

export abstract class AObject extends Sprite implements IObject {
    public kill = false;
    public content = this;

    constructor(texture: Texture) {
        super(texture);
    }

    public update(timeDelta: number) {}
}
