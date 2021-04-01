import { Texture } from "pixi.js";
import { Main } from "..";
import { AObject } from "./AObject";
import { IObject, ObjectType } from "./IObject";

export class Bullet extends AObject {
    get fromPlayer() {
        return this._fromPlayer;
    }
    constructor(private _fromPlayer = true) {
        super(Texture.from(_fromPlayer ? "s_bullet.png" : "p_bullet.png"));

        this._type = ObjectType.Bullet;
    }

    public update(timeDelta: number) {
        super.update(timeDelta);

        if (this._fromPlayer) {
            this.y -= 10 * timeDelta;

            if (this.y < 0) this.kill = true;
        } else {
            this.y += 5 * timeDelta;

            if (this.y > Main.SCREEN_HEIGHT) this.kill = true;
        }
    }

    public static isBullet(object: IObject): object is Bullet {
        return (object as Bullet).type == ObjectType.Bullet;
    }
}
