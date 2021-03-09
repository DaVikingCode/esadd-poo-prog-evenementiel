import { AnimatedSprite, Application, Loader, Sprite, Texture, TilingSprite } from "pixi.js";
import { AScreen } from "./screens/AScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { GameScreen } from "./screens/GameScreen";
import { GameOver } from "./screens/GameOver";

export class Main extends Application {
    public static readonly SCREEN_WIDTH = 500;
    public static readonly SCREEN_HEIGHT = 671;

    private static _instance: Main;
    public static get instance(): Main {
        return Main._instance;
    }

    private _currentScreen!: AScreen;

    constructor() {
        super({ backgroundColor: 0xFFFFFF, width: Main.SCREEN_WIDTH, height: Main.SCREEN_HEIGHT });
        document.body.appendChild(this.view);

        Main._instance = this;

        this.start();

        let loader = new Loader();
        loader.add("assets/flappy_bird.json");
        loader.load(() => {
            const background = Sprite.from("background.png");
            this.stage.addChild(background);

            this.openHomeScreen();

            this.stage.on("GAME_OVER", this.gameOverScreen.bind(this));

            this.ticker.add(this.update.bind(this));
        });

    }

    public openHomeScreen() {
        if (this._currentScreen)
            this.stage.removeChild(this._currentScreen);

        this._currentScreen = new HomeScreen();
        this.stage.addChild(this._currentScreen);
    }

    public launchGame() {

        this.stage.removeChild(this._currentScreen);

        this._currentScreen = new GameScreen();
        this.stage.addChild(this._currentScreen);
    }

    public gameOverScreen() {
        this.stage.removeChild(this._currentScreen);

        this._currentScreen = new GameOver();
        this.stage.addChild(this._currentScreen);
    }

    public update() {

        this._currentScreen.update();
    }
}

new Main();