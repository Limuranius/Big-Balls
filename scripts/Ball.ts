import CircleMovingObject from "./CircleMovingObject";
import {createCircle} from "./Utils";
import * as PIXI from "pixi.js"
import GameManager from "./GameManager";

export default class Ball extends CircleMovingObject {
    static allObjects: Array<Ball> = [];

    constructor(gm: GameManager, x: number, y: number, vx: number, vy: number, mass: number, R: number) {
        super(gm, x, y, vx, vy, mass, R);
        Ball.allObjects.push(this);
    }

    createSprite(): void {
        this.sprite = createCircle({
            R: this.R,
            lineWidth: 1
        });
    }

    move(): void {
        this.checkAndDoCollision(Ball.allObjects);
        super.move();
    }
}