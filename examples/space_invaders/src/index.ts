import { AnimatedSprite, Application, Loader, Sprite, Texture, TilingSprite } from "pixi.js";

export class Main extends Application {
    public static readonly SCREEN_WIDTH = 480;
    public static readonly SCREEN_HEIGHT = 640;

    private static _instance: Main;
    public static get instance(): Main {
        return Main._instance;
    }
    constructor() {
        super({ backgroundColor: 0xFFFFFF, width: Main.SCREEN_WIDTH, height: Main.SCREEN_HEIGHT });
        document.body.appendChild(this.view);

        Main._instance = this;

        this.start();

        let loader = new Loader();
        loader.add("assets/flappy_bird.json");
        loader.load(() => {

            this.ticker.add(this.update.bind(this));
        });

    }

    public update() {
    }
}

new Main();