import * as PIXI from "pixi.js"
import {G} from "./Constants"
import GameManager from "./GameManager";
import "@pixi/math-extras"

export default abstract class MovingObject {
    readonly gm: GameManager
    readonly app: PIXI.Application
    pos: PIXI.Point
    velocity: PIXI.Point
    mass: number;
    sprite: PIXI.Sprite | PIXI.Graphics
    tickerFunc: () => void

    protected constructor(gm: GameManager, x: number, y: number, vx: number, vy: number, mass: number) {
        this.gm = gm
        this.app = gm.app;
        this.pos = new PIXI.Point(x, y)
        this.velocity = new PIXI.Point(vx, vy)
        this.mass = mass;
        this.sprite = new PIXI.Sprite()

        // Добавляем объект в игровой цикл
        this.tickerFunc = this.updateLoop.bind(this)  // По этой переменной потом можно будет удалить объект
        this.gm.app.ticker.add(this.tickerFunc)
    }

    updateLoop() {
        this.move()
    }

    move(): void {
        this.setPos(this.pos.x + this.velocity.x, this.pos.y + this.velocity.y);
        this.sprite.renderable = this.isSeen()
    }

    moveWithoutChecking(): void {
        this.setPos(this.pos.x + this.velocity.x, this.pos.y + this.velocity.y);
    }

    setPos(x: number, y: number): void {
        this.sprite.scale.set(this.gm.camera.scale, this.gm.camera.scale)

        this.sprite.x = x * this.gm.camera.scale - this.gm.camera.pos.x;
        this.sprite.y = y * this.gm.camera.scale - this.gm.camera.pos.y;
        this.pos.set(x, y)
    }

    isSeen(): boolean {
        return (0 < this.sprite.x) &&
            (this.sprite.x < this.app.view.width) &&
            (0 < this.sprite.y) &&
            (this.sprite.y < this.app.view.width)
    }

    calculateGravityWithOtherBodies(classListOfBodies: Array<MovingObject>) {
        for (let body of classListOfBodies) {
            if (body != this) {
                let dPos = body.pos.subtract(this.pos)
                let distSquared = dPos.magnitudeSquared();
                let force = G * this.mass * body.mass / distSquared;
                let acceleration = force / this.mass;
                let accVector = dPos.normalize().multiplyScalar(acceleration)
                this.velocity = this.velocity.add(accVector)
            }
        }
    }

    remove(): void {
        this.gm.app.ticker.remove(this.tickerFunc)
        this.gm.app.stage.removeChild(this.sprite)
    }
}