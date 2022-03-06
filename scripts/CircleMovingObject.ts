import MovingObject from "./MovingObject";
import GameManager from "./GameManager";
import "@pixi/math-extras"
import * as PIXI from "pixi.js"
import Matter, {Bodies, Body} from "matter-js";
import {Graphics} from "pixi.js";
import {createCircle} from "./Utils";

export default abstract class CircleMovingObject extends MovingObject {
    R: number

    protected constructor(gm: GameManager, x: number, y: number, vx: number, vy: number, mass: number, R: number) {
        super(gm, x, y, vx, vy, mass);
        this.R = R

        this.sprite = this.createSprite()       // Создаём спрайт объекта
        this.gm.app.stage.addChild(this.sprite) // Добавляем спрайт в мир рендера

        let circle = Bodies.circle(0, 0, R)  // Создаём круг радиуса R
        Body.setVertices(this.body, circle.vertices)  // Копируем вершины из круга в наш объект

        Matter.Body.setMass(this.body, mass)

    }
}