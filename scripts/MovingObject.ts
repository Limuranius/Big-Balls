import * as PIXI from "pixi.js"
import {G} from "./Constants"
import GameManager from "./GameManager";
import "@pixi/math-extras"
import Matter, {Bodies} from "matter-js";

export default abstract class MovingObject {
    readonly gm: GameManager
    body: Matter.Body
    mass: number
    sprite: PIXI.Sprite | PIXI.Graphics
    tickerFunc: () => void

    protected constructor(gm: GameManager, x: number, y: number, vx: number, vy: number, mass: number) {
        this.gm = gm
        this.body = Matter.Body.create({
            position: {x: x, y: y},
            velocity: {x: vx, y: vy},
            restitution: 1,
            // mass: mass,
        })
        this.mass = mass
        Matter.Composite.add(this.gm.engine.world, this.body)  // Добавляем объект в мир физического движка

        this.sprite = new PIXI.Sprite()

        this.tickerFunc = this.gameLoop.bind(this)  // По этой переменной потом можно будет удалить объект из цикла
        this.gm.app.ticker.add(this.tickerFunc)  // Добавляем объект в игровой цикл
    }

    gameLoop(): void {
        this.renderSprite()
    }

    abstract createSprite(): PIXI.Sprite | PIXI.Graphics;

    renderSprite(): void {
        this.sprite.renderable = this.isSeen()
        this.sprite.scale.set(this.gm.camera.scale, this.gm.camera.scale)
        this.sprite.x = this.body.position.x * this.gm.camera.scale - this.gm.camera.pos.x;
        this.sprite.y = this.body.position.y * this.gm.camera.scale - this.gm.camera.pos.y;
    }

    isSeen(): boolean {
        return (0 < this.sprite.x) &&
            (this.sprite.x < this.gm.app.view.width) &&
            (0 < this.sprite.y) &&
            (this.sprite.y < this.gm.app.view.width)
    }

    calculateGravityWithOtherBodies(classListOfBodies: Array<MovingObject>): void {
        for (let other of classListOfBodies) {
            if (other != this) {
                let dPos = Matter.Vector.sub(other.body.position, this.body.position)
                let dPosNorm = Matter.Vector.normalise(dPos)
                let distSquared = Matter.Vector.magnitudeSquared(dPos)
                let force = G * this.mass * other.mass / distSquared;
                let acceleration = force / this.mass;
                let accVector = Matter.Vector.mult(dPosNorm, acceleration)
                Matter.Body.setVelocity(this.body, Matter.Vector.add(this.body.velocity, accVector))
            }
        }
    }

    remove(): void {
        this.gm.app.ticker.remove(this.tickerFunc)
        this.gm.app.stage.removeChild(this.sprite)
    }
}