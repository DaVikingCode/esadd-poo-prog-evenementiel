export interface IObject {
    kill: boolean;
    type: ObjectType;
    update(timeDelta: number): void;
}

export enum ObjectType {
    Undefined,
    Boss,
    Bullet,
    Enemy,
    Player,
}
