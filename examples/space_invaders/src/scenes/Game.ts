import { AScene } from "./AScene";
import { EndGame } from "./EndGame";
import { Bullet } from "../objects/Bullet";
import { Player, Direction } from "../objects/Player";
import { BitmapText, Container, Texture } from "pixi.js";
import { Main } from "..";
import { Boss } from "../objects/Boss";
import { Enemy } from "../objects/Enemy";
import { Maths } from "../utils/Maths";
import { IObject } from "../objects/IObject";

export class Game extends AScene {
    private _timeTxt = new BitmapText("0 s", { fontName: "Space Invaders", fontSize: 30 });
    private _time = 0;

    private _player = new Player(Texture.from("spaceship_01.png"));
    private _boss = new Boss(Texture.from("boss.png"));

    private _objects: IObject[] = [];

    // moving enemies
    private _moveEnemyPos = 0;
    private _moveEnemyInvert = false;
    private _accMovementEnemies = 0;

    // fire from enemies
    private _timeBeforeMissile = 0;
    private _missileTime = Math.random() * 3;

    private _gameOver = false;
    private _win = false;

    constructor() {
        super();
    }

    public initialize() {
        super.initialize();

        this._player.x = (Main.SCREEN_WIDTH - this._player.width) * 0.5;
        this._player.y = Main.SCREEN_HEIGHT - this._player.height - 50;
        this.addChild(this._player);
        this._objects.push(this._player);

        this._boss.y = 40;
        this.addChild(this._boss);
        this._objects.push(this._boss);

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

        const bullets: Bullet[] = this._objects.filter(Bullet.isBullet);
        const enemies: Enemy[] = this._objects.filter(Enemy.isEnemy); // better than this._objects.filter((obj) => obj instanceof Enemy) because typed!

        //moving enemies
        this._accMovementEnemies += timeDelta / 100;
        if (this._accMovementEnemies > 0.3) {
            this._accMovementEnemies = 0;

            if (this._moveEnemyPos < 10 && !this._moveEnemyInvert) {
                ++this._moveEnemyPos;
                this._moveEnemyInvert = this._moveEnemyPos == 10;

                for (const enemy of enemies) {
                    if (this._moveEnemyInvert) enemy.y += 5;
                    else enemy.x += 5;
                }
            } else if (this._moveEnemyPos > 0 && this._moveEnemyInvert) {
                --this._moveEnemyPos;
                this._moveEnemyInvert = this._moveEnemyPos != 0;

                for (const enemy of enemies) {
                    if (!this._moveEnemyInvert) enemy.y += 5;
                    else enemy.x -= 5;
                }
            }
        }

        // update loop
        for (const object of this._objects) object.update(timeDelta);

        // fire enemies
        this._timeBeforeMissile += timeDelta / 20;
        if (this._timeBeforeMissile > this._missileTime && enemies.length > 0) {
            const enemy = enemies[Maths.randomIntBetweenTwoNumbers(0, enemies.length)] as Enemy;

            this.enemyBullet(enemy);

            this._missileTime = Math.random() * 3;
            this._timeBeforeMissile = 0;
        }

        //check collisions
        for (const bullet of bullets) {
            for (const enemy of enemies) {
                if (!enemy.hit && bullet.fromPlayer && Maths.isIntersecting(enemy, bullet)) {
                    bullet.kill = true;
                    enemy.hit = true;
                }
            }

            if (!this._boss.hit && bullet.fromPlayer && Maths.isIntersecting(this._boss, bullet)) {
                bullet.kill = true;
                this._boss.hit = true;
            }

            if (!this._player.hit && !bullet.fromPlayer && Maths.isIntersecting(this._player, bullet)) {
                bullet.kill = true;
                this._player.hit = true;

                if (!this._gameOver) setTimeout(() => (Main.instance.scene = new EndGame(false)), 300);

                this._gameOver = true;
            }
        }

        // garbage
        for (const object of this._objects) {
            if (object.kill) {
                this.removeChild((object as unknown) as Container); // this is madness https://basarat.gitbook.io/typescript/type-system/type-assertion#double-assertion
                this._objects.splice(this._objects.indexOf(object), 1);
            }
        }

        this._time += timeDelta / 100;
        this._timeTxt.text = Math.floor(this._time) + " s";

        if (!this._win && this._boss.kill && enemies.length == 0) {
            this._win = true;

            setTimeout(() => (Main.instance.scene = new EndGame(true, Math.floor(this._time))), 300);
        }
    }

    public enemyBullet(from: Container) {
        const bullet = new Bullet(false);
        bullet.x = from.x + (from.width - bullet.width) / 2;
        bullet.y = from.y + from.height + 5;
        this.addChild(bullet);

        this._objects.push(bullet);
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
