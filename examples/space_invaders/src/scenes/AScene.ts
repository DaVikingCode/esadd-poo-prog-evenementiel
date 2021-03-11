import { Container } from "pixi.js";

export abstract class AScene extends Container {
    constructor() {
        super();
    }

    public initialize() {}

    public transitionIntroCompleted() {}

    public update(timeDelta: number) {}

    public dispose() {}
}
