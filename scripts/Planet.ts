import CircleMovingObject from "./CircleMovingObject";
import {createCircle, findDistance} from "./Utils";
import * as PIXI from "pixi.js"
import GameManager from "./GameManager";


export default class Planet extends CircleMovingObject {
    static allObjects: Array<Planet> = [];  // Массив, содержащий все созданные планеты
    textStyle: PIXI.TextStyle;
    infoText: PIXI.Text;

    constructor(gm: GameManager, x: number, y: number, vx: number, vy: number, mass: number, R: number) {
        super(gm, x, y, vx, vy, mass, R);

        this.textStyle = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 16,
            fill: "white",
        })
        this.infoText = new PIXI.Text("", this.textStyle);
        this.app.stage.addChild(this.infoText);

        Planet.allObjects.push(this);
    }

    createSprite() {
        this.sprite = createCircle({
            R: this.R,
            lineWidth: 3,
        });
    }

    setPos(x: number, y: number) {
        super.setPos(x, y);
        this.infoText.position.set(x + this.R, y - this.R);
    }

    move() {
        this.calculateGravityWithOtherBodies(Planet.allObjects);
        this.showInfo();
        if (this.gm.options.PLANET_PLANET_COLLISION) {
            this.checkAndDoCollision(Planet.allObjects);
        }
        super.move();
    }

    showInfo() {
        this.infoText.text = `Velocity: ${findDistance(this.vx, this.vy).toFixed(2)}\nMass: ${this.mass}\nRadius: ${this.R}`
    }
}