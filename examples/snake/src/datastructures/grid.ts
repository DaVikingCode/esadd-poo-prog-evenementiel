import { Main } from "../index"
import { Cell, CaseType } from "./cell";

export class Grid {

    public static readonly CASE_SIZE = 20;

    private _gridTab: Cell[][];
    get gridTab(): Cell[][] {
        return this._gridTab;
    }

    constructor() {
        this._gridTab = [];
        for (let i = 0; i < Main.SCREEN_WIDTH / Grid.CASE_SIZE; ++i) {
            this._gridTab[i] = [];
            for (let j = 0; j < Main.SCREEN_HEIGHT / Grid.CASE_SIZE; ++j) {
                this._gridTab[i][j] = new Cell(i, j, CaseType.EMPTY);
            }
        }
    }

    public getRandomEmptyCell(): Cell {

        let cellFound = false;

        let emptyCell: Cell;

        while (!cellFound) {
            emptyCell = this._gridTab[this.randomInt(0, Main.SCREEN_WIDTH / Grid.CASE_SIZE)][this.randomInt(0, Main.SCREEN_HEIGHT / Grid.CASE_SIZE)];

            if (emptyCell.type == CaseType.EMPTY)
                cellFound = true;
        }

        return emptyCell!;
    }

    public randomInt(min: number, max: number): number {

        return Math.floor(Math.random() * (1 + max - min)) + min;
    }
}