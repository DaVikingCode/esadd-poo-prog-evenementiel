import { Application } from "pixi.js";
import { CaseType } from "./datastructures/cell";
import { Grid } from "./datastructures/grid";
import { Snake } from "./objects/snake";

export class Main extends Application {
    public static readonly SCREEN_WIDTH = 800;
    public static readonly SCREEN_HEIGHT = 600;

    private _grid = new Grid();
    private _snake = new Snake(this._grid);
    private _direction = "ArrowRight";

    constructor() {
        super({ backgroundColor: 0xFFFFFF, width: Main.SCREEN_WIDTH, height: Main.SCREEN_HEIGHT });
        document.body.appendChild(this.view);
        this.start();

        this.stage.addChild(this._snake);

        this._snake.draw();

        const interval = setInterval(this._onTick.bind(this), 100);
        addEventListener('keydown', this._keyPressed.bind(this));

        this._snake.on("GAME_OVER", () => {
            console.log("game over");
            clearInterval(interval);
        });
    }

    private _onTick() {

        this._snake.moveOn(this._direction);

        this._snake.draw();

        if (this._snake.giveMeApple) {

            let apple = this._grid.getRandomEmptyCell();

            apple.type = CaseType.APPLE;

            this._snake.giveMeApple = false;
        }
    }

    private _keyPressed(kEvt: KeyboardEvent) {

        if (kEvt.key == "ArrowLeft" && this._direction != "ArrowRight")
            this._direction = kEvt.key;
        else if (kEvt.key == "ArrowRight" && this._direction != "ArrowLeft")
            this._direction = kEvt.key;
        else if (kEvt.key == "ArrowUp" && this._direction != "ArrowDown")
            this._direction = kEvt.key;
        else if (kEvt.key == "ArrowDown" && this._direction != "ArrowUp")
            this._direction = kEvt.key;
    }
}

new Main();