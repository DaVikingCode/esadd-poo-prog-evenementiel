import { AnimatedSprite, Texture, TilingSprite } from "pixi.js";
import { Main } from "..";
import { AScreen } from "./AScreen";

export class GameScreen extends AScreen {
    private _bird = AnimatedSprite.fromFrames(["bird0.png", "bird1.png", "bird2.png", "bird3.png"]);
    private _ground: TilingSprite;
    constructor() {
        super();

        this._bird.x = 200;
        this._bird.y = 200;
        this.addChild(this._bird);
        this._bird.animationSpeed = 0.1;
        this._bird.play();

        this._ground = new TilingSprite(Texture.from("ground.png"), 681, 83);
        this._ground.y = Main.SCREEN_HEIGHT - this._ground.height;
        this.addChild(this._ground)
    }

    public update() {
        super.update();

        this._ground.tilePosition.x -= 0.5;

        this._bird.x += 2;
        if (this._bird.x > Main.SCREEN_WIDTH)
            Main.instance.stage.emit("GAME_OVER");
    }
}