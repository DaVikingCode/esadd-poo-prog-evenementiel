import "./style.css";
import gsap, { Linear } from "gsap";
import { Application, Container, Graphics, Loader, Rectangle } from "pixi.js";
import { AScene } from "./scenes/AScene";
import { Home } from "./scenes/Home";
import { Maths } from "./utils/Maths";

export class Main extends Application {
    public static readonly SCREEN_WIDTH = 480;
    public static readonly SCREEN_HEIGHT = 640;

    private static _instance: Main;
    public static get instance(): Main {
        return Main._instance;
    }

    public playing = true;

    private _scene: AScene | null = null;
    get scene(): AScene | null {
        if (this._newScene != null) return this._newScene;

        return this._scene;
    }
    set scene(value: AScene | null) {
        this._newScene = value;
    }
    private _newScene: AScene | null = null;

    private _loader = new Loader();

    private _container = new Container();
    get container() {
        return this._container;
    }

    constructor() {
        super({
            backgroundColor: 0x000000,
            width: Main.SCREEN_WIDTH,
            height: Main.SCREEN_HEIGHT,
            resizeTo: window,
            autoDensity: true,
            resolution: window.devicePixelRatio || 1,
        });

        Main._instance = this;

        document.body.appendChild(this.view);

        this.start();

        this._loader.add("assets/space_invaders_font.fnt");
        this._loader.add("assets/sprites.json");

        this._loader.load(this._onLoaded.bind(this));

        window.onfocus = this._windowGetFocus.bind(this);
        window.onblur = this._windowLostFocus.bind(this);
    }

    private _onLoaded() {
        this.ticker.add(this.update, this);
        window.onresize = this._onResize.bind(this);

        // container for having something solid in the background
        let graphics = new Graphics();
        graphics.beginFill(0x000000);
        graphics.drawRect(0, 0, Main.SCREEN_WIDTH, Main.SCREEN_HEIGHT);
        graphics.endFill();
        this._container.addChild(graphics);

        // mask so everything out of the SCREEN_WIDTH && SCREEN_HEIGHT are masked, need a proper container (see top) for a good resizing.
        graphics = new Graphics();
        graphics.beginFill(0x0ff000);
        graphics.drawRect(0, 0, Main.SCREEN_WIDTH, Main.SCREEN_HEIGHT);
        graphics.endFill();
        this._container.mask = graphics;
        this._container.addChild(graphics);

        this.stage.addChild(this._container);

        this._onResize();

        this.scene = new Home();
    }

    public update() {
        if (this.playing) {
            if (this._newScene) {
                let introAnimation = false; // no animation for first scene setup

                if (this._scene) {
                    const tmpScene = this._scene;
                    introAnimation = true;

                    gsap.to(tmpScene, {
                        duration: 0.5,
                        x: -Main.SCREEN_WIDTH,
                        ease: Linear.easeNone,
                        onComplete: () => {
                            tmpScene.dispose();
                            this._container.removeChild(tmpScene);
                        },
                    });
                }

                this._scene = this._newScene;
                this._newScene = null;

                if (introAnimation) {
                    this._scene.x = Main.SCREEN_WIDTH;
                    gsap.to(this._scene, {
                        duration: 0.5,
                        x: 0,
                        ease: Linear.easeNone,
                        onComplete: () => this._scene?.transitionIntroCompleted(),
                    });
                }

                this._container.addChild(this._scene);
                this._scene.initialize();
            }

            if (this._scene) this._scene.update(this.ticker.deltaTime);
        }
    }

    private _onResize() {
        const vpw = window.innerWidth;
        const vph = window.innerHeight;

        const fit = Maths.getBestFitRatio(
            new Rectangle(0, 0, Main.SCREEN_WIDTH, Main.SCREEN_HEIGHT),
            new Rectangle(0, 0, vpw, vph)
        );

        this.renderer.resize(vpw, vph);

        this.resize();

        this._container.scale.set(fit);
        const cx = vpw / 2 - (Main.SCREEN_WIDTH * fit) / 2;
        const cy = vph / 2 - (Main.SCREEN_HEIGHT * fit) / 2;
        this._container.position.set(cx, cy);

        // fix damn iPhone bug with adress bar popping in landscape mode
        window.scrollTo(0, 0);
    }

    private _windowGetFocus() {
        this.playing = true;
    }

    private _windowLostFocus() {
        this.playing = false;
    }
}

new Main();
