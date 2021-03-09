import { gsap, Back } from "gsap";
import { Sprite } from "pixi.js";
import { Main } from "../index";
import { AScreen } from "./AScreen";

export class HomeScreen extends AScreen {

    private _ready = Sprite.from("get_ready.png");
    private _timeline = gsap.timeline();

    constructor() {
        super();

        this._ready.x = (Main.SCREEN_WIDTH - this._ready.width) / 2;
        this._ready.y = -this._ready.height;
        this.addChild(this._ready);

        const ground = Sprite.from("ground.png");
        ground.y = Main.SCREEN_HEIGHT - ground.height;
        this.addChild(ground);

        this._timeline.to(this._ready, { y: (Main.SCREEN_HEIGHT - this._ready.height) / 2, duration: 0.6, ease: Back.easeOut });
        this._timeline.to(this._ready, { alpha: 0.4, duration: 0.5, yoyo: true, repeat: -1 });

        this._ready.interactive = true;
        this._ready.buttonMode = true;

        this._ready.once("pointerdown", this._play.bind(this));
    }

    private _play() {
        this._timeline.kill();
        this._ready.alpha = 1;
        gsap.to(this._ready, {
            y: -this._ready.height, onComplete: () => Main.instance.launchGame()
        });

    }
}