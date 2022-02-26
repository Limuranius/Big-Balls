import * as PIXI from "pixi.js"
import {G} from "./Constants"
import GameManager from "./GameManager";

export default abstract class MovingObject {
    readonly gm: GameManager
    readonly app: PIXI.Application
    x: number;
    y: number;
    vx: number;
    vy: number;
    mass: number;
    sprite: PIXI.Sprite | PIXI.Graphics

    protected constructor(gm: GameManager, x: number, y: number, vx: number, vy: number, mass: number) {
        this.gm = gm
        this.app = gm.app;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.mass = mass;
        this.sprite = new PIXI.Sprite()
    }

    setPos(x: number, y: number): void {
        this.sprite.x = x;
        this.sprite.y = y;
        this.x = x;
        this.y = y;
    }

    setX(x: number): void {
        this.x = x;
        this.sprite.x = x;
    }

    setY(y: number): void {
        this.y = y;
        this.sprite.y = y;
    }

    move(): void {
        this.setPos(this.x + this.vx, this.y + this.vy);
    }

    moveWithoutChecking(): void {
        this.setPos(this.x + this.vx, this.y + this.vy);
    }

    bounceOffEdges() {
        if (this.x < 0) {
            this.setX(0);
            this.vx = -this.vx;
        } else if (this.x > this.app.view.width) {
            this.setX(this.app.view.width);
            this.vx = -this.vx;
        }

        if (this.y < 0) {
            this.setY(0);
            this.vy = -this.vy;
        } else if (this.y > this.app.view.height) {
            this.setY(this.app.view.height);
            this.vy = -this.vy;
        }
    }

    calculateGravityWithOtherBodies(classListOfBodies: Array<MovingObject>) {
        for (let body of classListOfBodies) {
            if (body != this) {
                let dx = body.x - this.x;
                let dy = body.y - this.y;
                let distSquared = Math.pow(dx, 2) + Math.pow(dy, 2);
                let force = G * this.mass * body.mass / distSquared;
                let angle = Math.atan2(dy, dx);
                let acceleration = force / this.mass;
                let ax = acceleration * Math.cos(angle);
                let ay = acceleration * Math.sin(angle);
                this.vx += ax;
                this.vy += ay;
            }
        }
    }
}