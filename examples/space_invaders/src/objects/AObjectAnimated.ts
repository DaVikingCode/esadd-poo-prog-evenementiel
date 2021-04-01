import { Container } from "pixi.js";
import { IObject, ObjectType } from "./IObject";

export abstract class AObjectAnimated extends Container implements IObject {
    public kill = false;
    protected _type = ObjectType.Undefined;
    get type(): ObjectType {
        return this._type;
    }

    constructor() {
        super();
    }

    public update(timeDelta: number) {}
}
