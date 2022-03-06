import CircleMovingObject from "./CircleMovingObject";
import {createCircle} from "./Utils";
import GameManager from "./GameManager";
import * as PIXI from "pixi.js";

export default class Bullet extends CircleMovingObject {
    constructor(gm: GameManager, x: number, y: number, vx: number, vy: number) {
        super(gm, x, y, vx, vy, 1, 3);
    }

    gameLoop() {
        super.gameLoop();
        this.calculateGravityWithOtherBodies(this.gm.objects.Planets);
    }

    createSprite(): PIXI.Sprite | PIXI.Graphics {
        return createCircle({
            R: this.R,
            fillColor: 0xffff00,
            lineWidth: 0,
        })
    }
}
