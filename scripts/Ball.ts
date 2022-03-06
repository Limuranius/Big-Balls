import CircleMovingObject from "./CircleMovingObject";
import {createCircle} from "./Utils";
import GameManager from "./GameManager";
import * as PIXI from "pixi.js";

export default class Ball extends CircleMovingObject {
    constructor(gm: GameManager, x: number, y: number, vx: number, vy: number, mass: number, R: number) {
        super(gm, x, y, vx, vy, mass, R);
        gm.objects.Balls.push(this);
    }

    createSprite(): PIXI.Sprite | PIXI.Graphics {
        return createCircle({
            R: this.R,
            lineWidth: 1
        });
    }

    remove() {
        super.remove();
        let index = this.gm.objects.Balls.indexOf(this);
        this.gm.objects.Balls.splice(index, 1)
    }
}