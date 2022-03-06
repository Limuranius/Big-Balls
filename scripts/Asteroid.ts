import CircleMovingObject from "./CircleMovingObject";
import {createCircle} from "./Utils";
import GameManager from "./GameManager";
import * as PIXI from "pixi.js";
import Matter from "matter-js";

export default class Asteroid extends CircleMovingObject {
    constructor(gm: GameManager, x: number, y: number, vx: number, vy: number) {
        super(gm, x, y, vx, vy, 1, 3);
        this.gm.objects.Asteroids.push(this);
        console.log(this.body.mass)
    }

    gameLoop() {
        super.gameLoop();
        this.calculateGravityWithOtherBodies(this.gm.objects.Planets)
    }

    createSprite(): PIXI.Sprite | PIXI.Graphics {
        return createCircle({
            R: this.R,
            fillColor: 0x4e03fc,// getRandomColor(),
            lineWidth: 0,
        })
    }

    remove() {
        super.remove();
        let index = this.gm.objects.Asteroids.indexOf(this);
        this.gm.objects.Asteroids.splice(index, 1)
    }
}