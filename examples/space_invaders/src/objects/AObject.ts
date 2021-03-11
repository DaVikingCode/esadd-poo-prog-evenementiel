import { Sprite, Texture } from "pixi.js";

export abstract class AObject extends Sprite {
    public kill = false;

    constructor(texture: Texture | undefined) {
        super(texture);
    }

    public update(timeDelta: number) {}

    public getWidth() {
        return this.width;
    }

    public getHeihght() {
        return this.height;
    }
}
