export interface IObject {
    kill: boolean;
    update(timeDelta: number): void;
}
