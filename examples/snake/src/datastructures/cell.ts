export class Cell {
    private _i: number;
    get i(): number { return this._i; }
    private _j: number;
    get j(): number { return this._j; }
    public type: CaseType;
    constructor(i: number, j: number, type: CaseType) {
        this._i = i;
        this._j = j;
        this.type = type;
    }
}

export enum CaseType {
    EMPTY = 0,
    SNAKE = 1,
    SNAKE_HEAD = 2,
    APPLE = 3
}