import { Texture } from "pixi.js";
import { Main } from "..";
import { AObject } from "./AObject";
import { Game } from "../scenes/Game";
import { IObject, ObjectType } from "./IObject";

export class Boss extends AObject {
    private _speed = 2;
    private _accMissile = 0;
    private _timeBeforeDestruction = 0;

    private _hit = false;
    get hit() {
        return this._hit;
    }
    set hit(value: boolean) {
        if (value) {
            this.texture = Texture.from("boss_die.png");
        }

        this._hit = value;
    }

    constructor(texture: Texture) {
        super(texture);
    }

    public update(timeDelta: number) {
        super.update(timeDelta);

        if (!this._hit) {
            this.x += this._speed * timeDelta;

            if (this.x > Main.SCREEN_WIDTH) this.x = -this.width;

            this._accMissile += timeDelta;

            if (this._accMissile > 25) {
                (Main.instance.scene as Game).enemyBullet(this);
                this._accMissile = 0;
            }
        } else {
            this._timeBeforeDestruction += timeDelta;

            if (this._timeBeforeDestruction > 2) this.kill = true;
        }
    }

    public static isBoss(object: IObject): object is Boss {
        return (object as Boss).type == ObjectType.Boss;
    }
}
