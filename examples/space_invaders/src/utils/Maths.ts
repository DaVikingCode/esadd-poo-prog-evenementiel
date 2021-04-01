import { Container, Rectangle } from "pixi.js";

export class Maths {
    // for AABB check https://codepen.io/osublake/pen/eMvZmo?editors=0010
    public static hitTest(
        x1: number,
        y1: number,
        w1: number,
        h1: number,
        x2: number,
        y2: number,
        w2: number,
        h2: number
    ): boolean {
        if (x1 + w1 > x2) if (x1 < x2 + w2) if (y1 + h1 > y2) if (y1 < y2 + h2) return true;

        return false;
    }

    public static isIntersecting(r1: Container, r2: Container): boolean {
        return !(
            r2.x > r1.x + r1.width ||
            r2.x + r2.width < r1.x ||
            r2.y > r1.y + r1.height ||
            r2.y + r2.height < r1.y
        );
    }

    public static getBestFitRatio(rect: Rectangle, into: Rectangle): number {
        if (into.height / into.width > rect.height / rect.width) return into.width / rect.width;

        return into.height / rect.height;
    }

    public static getFillRatio(rect: Rectangle, into: Rectangle): number {
        if (into.height / into.width > rect.height / rect.width) return into.height / rect.height;

        return into.width / rect.width;
    }

    public static randomFloatBetweenTwoNumbers(min: number, max: number): number {
        return Math.random() * (min - max) + max;
    }

    /**
     * @param [max] {Int} is excluded!
     */
    public static randomIntBetweenTwoNumbers(min: number, max: number): number {
        return Math.floor(Math.random() * (min - max) + max);
    }

    public static fixedFloat(v: number, precision = 2): number {
        return Math.round(v * Math.pow(10, precision)) / Math.pow(10, precision);
    }
}
