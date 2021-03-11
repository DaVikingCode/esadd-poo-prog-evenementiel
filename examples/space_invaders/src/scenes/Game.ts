import { AScene } from "./AScene";
import { Bullet } from "../objects/Bullet";
import { Player, Direction } from "../objects/Player";
import { BitmapText, Texture } from "pixi.js";
import { Main } from "..";
import { AObject } from "../objects/AObject";
import { Enemy } from "../objects/Enemy";
import { Maths } from "../utils/Maths";

export class Game extends AScene {
    private _timeTxt = new BitmapText("0 s", { fontName: "Space Invaders", fontSize: 30 });
    private _time = 0;

    private _player = new Player(Texture.from("spaceship_01.png"));

    private _objects: AObject[] = [];

    // moving enemies
    private _moveEnemyPos = 0;
    private _moveEnemyInvert = false;
    private _accMovementEnemies = 0;

    // fire from enemies
    private _timeBeforeMissile = 0;
    private _missileTime = Math.random() * 3;

    private _win = false;

    constructor() {
        super();
    }

    public initialize() {
        super.initialize();

        this._player.x = (Main.SCREEN_WIDTH - this._player.width) * 0.5;
        this._player.y = Main.SCREEN_HEIGHT - this._player.height - 50;
        this.addChild(this._player);

        for (let i = 0; i < 8; ++i)
            for (let j = 0; j < 3; ++j) {
                const enemy = new Enemy([
                    Texture.from("p" + (j + 1) + "_01.png"),
                    Texture.from("p" + (j + 1) + "_02.png"),
                ]);
                enemy.x = i * 50 + (j % 2 == 0 ? 25 : 0);
                enemy.y = 50 + (j + 1) * 25;
                this.addChild(enemy);

                this._objects.push(enemy);
            }

        this._timeTxt.x = 10;
        this._timeTxt.y = 20;
        this.addChild(this._timeTxt);

        document.body.addEventListener("click", this._shoot.bind(this));
        window.addEventListener("keydown", this._onKeyboard.bind(this));
        window.addEventListener("keyup", this._onKeyboard.bind(this));
    }

    public dipose() {
        document.body.removeEventListener("click", this._shoot.bind(this));
        window.removeEventListener("keydown", this._onKeyboard.bind(this));
        window.removeEventListener("keyup", this._onKeyboard.bind(this));

        super.dispose();
    }

    public update(timeDelta: number) {
        super.update(timeDelta);

        //moving enemies
        this._accMovementEnemies += timeDelta / 100;
        if (this._accMovementEnemies > 0.3) {
            this._accMovementEnemies = 0;

            if (this._moveEnemyPos < 10 && !this._moveEnemyInvert) {
                ++this._moveEnemyPos;
                this._moveEnemyInvert = this._moveEnemyPos == 10;

                for (const enemy of this._objects.filter((obj) => obj instanceof Enemy)) {
                    if (this._moveEnemyInvert) enemy.y += 5;
                    else enemy.x += 5;
                }
            } else if (this._moveEnemyPos > 0 && this._moveEnemyInvert) {
                --this._moveEnemyPos;
                this._moveEnemyInvert = this._moveEnemyPos != 0;

                for (const enemy of this._objects.filter((obj) => obj instanceof Enemy)) {
                    if (!this._moveEnemyInvert) enemy.y += 5;
                    else enemy.x -= 5;
                }
            }
        }

        // update loop
        this._player.update(timeDelta);
        for (const object of this._objects) {
            object.update(timeDelta);
        }

        // fire enemies
        this._timeBeforeMissile += timeDelta / 20;
        const enemies = this._objects.filter((obj) => obj instanceof Enemy);
        if (this._timeBeforeMissile > this._missileTime && enemies.length > 0) {
            const enemy = enemies[Maths.randomIntBetweenTwoNumbers(0, enemies.length)];
            const bullet = new Bullet(false);
            bullet.x = enemy.x + (enemy.getWidth() - bullet.width) / 2;
            bullet.y = enemy.y + enemy.height + 5;
            this.addChild(bullet);
            this._objects.push(bullet);

            this._missileTime = Math.random() * 3;
            this._timeBeforeMissile = 0;
        }

        //check collisions
        for (const bullet of this._objects.filter((obj) => obj instanceof Bullet)) {
            for (const enemy of this._objects.filter((obj) => obj instanceof Enemy)) {
                if (!(enemy as Enemy).hit && (bullet as Bullet).fromPlayer && this._isIntersecting(enemy, bullet)) {
                    bullet.kill = true;
                    (enemy as Enemy).hit = true;
                }
            }
            if (!this._player.hit && !(bullet as Bullet).fromPlayer && this._isIntersecting(this._player, bullet)) {
                bullet.kill = true;
                this._player.hit = true;

                setTimeout(() => {
                    Main.instance.scene = new Game();
                }, 300);
            }
        }

        // garbage
        for (const object of this._objects) {
            if (object.kill) {
                this.removeChild(object);
                this._objects.splice(this._objects.indexOf(object), 1);
            }
        }

        this._time += timeDelta / 100;
        this._timeTxt.text = Math.floor(this._time) + " s";
    }

    private _isIntersecting(r1: AObject, r2: AObject): boolean {
        return !(
            r2.x > r1.x + r1.getWidth() ||
            r2.x + r2.getWidth() < r1.x ||
            r2.y > r1.y + r1.getHeihght() ||
            r2.y + r2.getHeihght() < r1.y
        );
    }

    private _shoot() {
        if (!this._player.hit) {
            let bullet = new Bullet();
            bullet.x = this._player.x + (this._player.width - bullet.width) / 2;
            bullet.y = this._player.y - bullet.height - 5;
            this.addChild(bullet);

            this._objects.push(bullet);
        }
    }

    private _onKeyboard(kEvt: KeyboardEvent) {
        if (kEvt.key == "ArrowLeft") this._player.direction = kEvt.type == "keydown" ? Direction.Left : Direction.Idle;
        else if (kEvt.key == "ArrowRight")
            this._player.direction = kEvt.type == "keydown" ? Direction.Right : Direction.Idle;
    }
}
