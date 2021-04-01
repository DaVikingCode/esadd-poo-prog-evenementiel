import { Sprite, Texture } from "pixi.js";
import { IObject, ObjectType } from "./IObject";

export abstract class AObject extends Sprite implements IObject {
    public kill = false;
    protected _type = ObjectType.Undefined;
    get type(): ObjectType {
        return this._type;
    }

    constructor(texture: Texture) {
        super(texture);
    }

    public update(timeDelta: number) {}
}
