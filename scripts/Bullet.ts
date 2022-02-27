import CircleMovingObject from "./CircleMovingObject";
import {createCircle} from "./Utils";
import GameManager from "./GameManager";

export default class Bullet extends CircleMovingObject {
    constructor(gm: GameManager, x: number, y: number, vx: number, vy: number) {
        super(gm, x, y, vx, vy, 1, 3);
    }

    createSprite(): void {
        this.sprite = createCircle({
            R: this.R,
            fillColor: 0xffff00,
            lineWidth: 0,
        })
    }

    move(): void {
        this.calculateGravityWithOtherBodies(this.gm.objects.Planets);
        super.move();
    }
}
