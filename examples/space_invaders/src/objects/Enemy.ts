import { AnimatedSprite, Texture } from "pixi.js";
import { AObject } from "./AObject";

export class Enemy extends AObject {
    private _hit = false;
    get hit() {
        return this._hit;
    }
    set hit(value: boolean) {
        if (value) {
            this._sprites.stop();
            this.removeChild(this._sprites);

            this.texture = Texture.from("p_die.png");
        }

        this._hit = value;
    }

    private _sprites: AnimatedSprite;
    private _timeBeforeDestruction = 0;
    constructor(textures: Texture[]) {
        super(undefined);

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

    public getWidth() {
        return this._sprites.width;
    }

    public getHeihght() {
        return this._sprites.height;
    }
}
