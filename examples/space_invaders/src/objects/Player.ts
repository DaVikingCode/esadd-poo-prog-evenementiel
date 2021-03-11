import { Texture } from "pixi.js";
import { Main } from "..";
import { AObject } from "./AObject";

export class Player extends AObject {
    public direction = Direction.Idle;

    private _hit = false;
    get hit() {
        return this._hit;
    }
    set hit(value: boolean) {
        this.texture = Texture.from("spaceship_02.png");
        this._hit = value;
    }

    private _speed = 5;

    constructor(texture: Texture) {
        super(texture);
    }

    public update(timeDelta: number) {
        super.update(timeDelta);

        if (!this._hit) {
            if (this.direction == Direction.Left) this.x -= this._speed * timeDelta;
            else if (this.direction == Direction.Right) this.x += this._speed * timeDelta;

            if (this.x > Main.SCREEN_WIDTH) this.x = 0;
            else if (this.x < 0) this.x = Main.SCREEN_WIDTH - this.width;
        }
    }
}

export enum Direction {
    Left,
    Idle,
    Right,
}
