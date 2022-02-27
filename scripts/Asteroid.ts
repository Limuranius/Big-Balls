import CircleMovingObject from "./CircleMovingObject";
import {createCircle, getRandomColor} from "./Utils";
import GameManager from "./GameManager";

export default class Asteroid extends CircleMovingObject {
    constructor(gm: GameManager, x: number, y: number, vx: number, vy: number) {
        super(gm, x, y, vx, vy, 1, 3);
        this.gm.objects.Asteroids.push(this);
    }

    createSprite() {
        this.sprite = createCircle({
            R: this.R,
            fillColor: getRandomColor(),
            lineWidth: 0,
        })
    }

    move() {
        this.calculateGravityWithOtherBodies(this.gm.objects.Planets);
        super.move();
        if (this.gm.options.ASTEROID_ASTEROID_COLLISION) {
            this.checkAndDoCollision(this.gm.objects.Asteroids);
        }
        if (this.gm.options.ASTEROID_PLANET_COLLISION) {
            this.checkAndDoCollision(this.gm.objects.Planets);
        }
        //this.bounceOffEdges();
    }

    remove() {
        super.remove();
        let index = this.gm.objects.Asteroids.indexOf(this);
        this.gm.objects.Asteroids.splice(index, 1)
    }
}