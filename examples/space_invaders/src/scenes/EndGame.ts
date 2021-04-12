import gsap, { Back } from "gsap";
import { BitmapText } from "pixi.js";
import { Main } from "..";
import { AScene } from "./AScene";
import { Home } from "./Home";

export class EndGame extends AScene {
    private _title = new BitmapText("", { fontName: "Space Invaders", fontSize: 40 });
    private _desc = new BitmapText("", { fontName: "Space Invaders", fontSize: 10 });
    constructor(private _success: boolean, private _time = 0) {
        super();
    }

    public initialize() {
        super.initialize();

        this._title.text = this._success ? "Felicitations !!" : "Game Over";
        this._title.x = (Main.SCREEN_WIDTH - this._title.width) * 0.5;
        this._title.y = 150;
        this._title.alpha = 0;
        this.addChild(this._title);

        gsap.to(this._title, { alpha: 1, duration: 1, ease: Back.easeOut });

        this._desc.text = this._success
            ? "Vous avez gagne en " + this._time + "s, essayez de faire mieux !"
            : "Retente ta chance !";
        this._desc.x = -this._desc.width;
        this._desc.y = Main.SCREEN_HEIGHT * 0.5 + 125;
        this._desc.alpha = 0;
        this.addChild(this._desc);

        gsap.to(this._desc, { x: (Main.SCREEN_WIDTH - this._desc.width) / 2, alpha: 1, duration: 0.5, delay: 0.3 });

        this.interactive = this.buttonMode = true;

        this.once("pointerdown", () => (Main.instance.scene = new Home()));
    }
}
