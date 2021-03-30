import { AnimatedSprite, Sprite, Texture } from "pixi.js";
import { AObjectAnimated } from "./AObjectAnimated";
import { IObject } from "./IObject";

export class Enemy extends AObjectAnimated {
    private _hit = false;
    get hit() {
        return this._hit;
    }
    set hit(value: boolean) {
        if (value) {
            this._sprites.stop();
            this.removeChild(this._sprites);

            this.addChild(Sprite.from("p_die.png"));
        }

        this._hit = value;
    }

    private _sprites: AnimatedSprite;
    private _timeBeforeDestruction = 0;
    constructor(textures: Texture[]) {
        super();

        this._sprites = new AnimatedSprite(textures);

        this._sprites.tint = 0xff0000;
        this._sprites.animationSpeed = 0.05;

        this._sprites.play();

        this.addChild(this._sprites);
    }

    public update(timeDelta: number) {
        super.update(timeDelta);

        if (this._hit) {
            this._timeBeforeDestruction += timeDelta;

            if (this._timeBeforeDestruction > 2) this.kill = true;
        }
    }

    public static isEnemy(object: IObject): object is Enemy {
        return (object as Enemy).hit !== undefined;
    }
}
