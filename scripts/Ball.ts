import CircleMovingObject from "./CircleMovingObject";
import {createCircle} from "./Utils";
import GameManager from "./GameManager";

export default class Ball extends CircleMovingObject {
    constructor(gm: GameManager, x: number, y: number, vx: number, vy: number, mass: number, R: number) {
        super(gm, x, y, vx, vy, mass, R);
        gm.objects.Balls.push(this);
    }

    createSprite(): void {
        this.sprite = createCircle({
            R: this.R,
            lineWidth: 1
        });
    }

    move(): void {
        this.checkAndDoCollision(this.gm.objects.Balls);
        super.move();
    }

    remove() {
        super.remove();
        let index = this.gm.objects.Balls.indexOf(this);
        this.gm.objects.Balls.splice(index, 1)
    }
}