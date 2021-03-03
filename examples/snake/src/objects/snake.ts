import { Graphics } from "pixi.js";
import { Main } from "..";
import { Cell, CaseType } from "../datastructures/cell";
import { Grid } from "../datastructures/grid";

export class Snake extends Graphics {
    private _grid: Grid;
    private _body: Cell[] = [];

    public giveMeApple = true;

    constructor(grid: Grid) {
        super();

        this._grid = grid;

        this._grid.gridTab[4][0].type = CaseType.SNAKE_HEAD;
        this._grid.gridTab[3][0].type = CaseType.SNAKE;
        this._grid.gridTab[2][0].type = CaseType.SNAKE;
        this._grid.gridTab[1][0].type = CaseType.SNAKE;

        this._body.push(this._grid.gridTab[4][0]);
        this._body.push(this._grid.gridTab[3][0]);
        this._body.push(this._grid.gridTab[2][0]);
        this._body.push(this._grid.gridTab[1][0]);
    }

    public moveOn(direction: string) {

        let futureHead = this._getNextCell(direction);

        if (futureHead.type == CaseType.SNAKE) {
            this.emit("GAME_OVER");
            return;
        }

        let head = this._body[0];
        head.type = CaseType.SNAKE;

        if (futureHead.type != CaseType.APPLE) {
            let oldQueue = this._body.pop();
            if (oldQueue)
                oldQueue.type = CaseType.EMPTY;
        } else
            this.giveMeApple = true;

        futureHead.type = CaseType.SNAKE_HEAD;

        this._body.unshift(futureHead);
    }

    public draw() {

        this.clear();

        for (let i = 0; i < Main.SCREEN_WIDTH / Grid.CASE_SIZE; ++i)
            for (let j = 0; j < Main.SCREEN_HEIGHT / Grid.CASE_SIZE; ++j)
                if (this._grid.gridTab[i][j].type != CaseType.EMPTY) {

                    let color = 0;
                    switch (this._grid.gridTab[i][j].type) {
                        case CaseType.APPLE:
                            color = 0xFF0000;
                            break;
                        case CaseType.SNAKE:
                            color = 0x00AAFF;
                            break;
                        case CaseType.SNAKE_HEAD:
                            color = 0x00CCFF;
                            break;
                    }
                    this.beginFill(color);
                    this.drawRect(i * Grid.CASE_SIZE, j * Grid.CASE_SIZE, Grid.CASE_SIZE, Grid.CASE_SIZE);
                }

        this.endFill();
    }

    private _getNextCell(direction: string): Cell {
        let head = this._body[0];
        let futureHead: Cell;

        if (direction == "ArrowRight")
            futureHead = this._grid.gridTab[head.i + 1 == this._grid.gridTab.length ? 0 : head.i + 1][head.j];
        else if (direction == "ArrowLeft")
            futureHead = this._grid.gridTab[head.i - 1 == -1 ? this._grid.gridTab.length - 1 : head.i - 1][head.j];
        else if (direction == "ArrowDown")
            futureHead = this._grid.gridTab[head.i][head.j + 1 == this._grid.gridTab[head.i].length ? 0 : head.j + 1];
        else if (direction == "ArrowUp")
            futureHead = this._grid.gridTab[head.i][head.j - 1 == -1 ? this._grid.gridTab[head.i].length - 1 : head.j - 1];

        return futureHead!;
    }
}