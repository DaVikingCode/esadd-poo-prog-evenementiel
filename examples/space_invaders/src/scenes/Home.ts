import gsap from "gsap/all";
import { BitmapText } from "pixi.js";
import { Main } from "..";
import { AScene } from "./AScene";
import { Game } from "./Game";

export class Home extends AScene {
    private _title = new BitmapText("Space Invaders", { fontName: "Space Invaders", fontSize: 20 });
    private _instructions = new BitmapText(
        "Deplacez votre vaisseau avec l'accelerometre et detruisez les vaisseaux ennemis en appuyant sur l'ecran.\n\nVous n'avez qu'une seule vie alors faites attention !",
        { fontName: "Space Invaders", fontSize: 10 }
    );

    constructor() {
        super();
    }

    public initialize() {
        super.initialize();

        this._title.x = (Main.SCREEN_WIDTH - this._title.width) * 0.5;
        this._title.y = 150;
        this._title.alpha = 0;
        this.addChild(this._title);

        gsap.to(this._title, { alpha: 1, duration: 0.3, delay: 0.3 });

        this._instructions.maxWidth = Main.SCREEN_WIDTH * 0.75;
        this._instructions.x = -this._instructions.width;
        this._instructions.y = Main.SCREEN_HEIGHT * 0.5 + 125;
        this._instructions.alpha = 0;
        this.addChild(this._instructions);

        gsap.to(this._instructions, {
            x: (Main.SCREEN_WIDTH - this._instructions.width) / 2,
            alpha: 1,
            duration: 0.5,
            delay: 0.3,
        });

        this.interactive = this.buttonMode = true;

        this.once("pointerdown", () => (Main.instance.scene = new Game()));
    }
}
