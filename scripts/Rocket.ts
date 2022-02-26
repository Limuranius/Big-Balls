import CircleMovingObject from "./CircleMovingObject";
import Planet from "./Planet";
import {createCircle, getRandomColor} from "./Utils";
import * as PIXI from "pixi.js"
import GameManager from "./GameManager";

export default class Rocket extends CircleMovingObject {
    static allObjects: Array<Rocket> = [];

    constructor(gm: GameManager, x: number, y: number, vx: number, vy: number) {
        super(gm, x, y, vx, vy, 1, 5);
        Rocket.allObjects.push(this);
    }

    createSprite() {
        this.sprite = createCircle({
            R: this.R,
            fillColor: getRandomColor(),
            lineWidth: 0,
        })
    }

    move() {
        this.calculateGravityWithOtherBodies(Planet.allObjects);
        super.move();
        if (this.gm.options.ROCKET_ROCKET_COLLISION) {
            this.checkAndDoCollision(Rocket.allObjects);
        }
        if (this.gm.options.ROCKET_PLANET_COLLISION) {
            this.checkAndDoCollision(Planet.allObjects);
        }
        //this.bounceOffEdges();
    }
}