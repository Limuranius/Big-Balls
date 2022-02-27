import * as PIXI from "pixi.js"
import FPSCounter from "./FPSCounter";
import Asteroid from "./Asteroid";
import Planet from "./Planet";
import Ball from "./Ball";

export default class GameManager {
    readonly app: PIXI.Application;
    readonly interactionManager: PIXI.InteractionManager;
    keysPressed: { [key: string]: boolean }
    mouseButtonsPressed: { [key: string]: boolean }
    FPSCounter: FPSCounter
    scale: number

    options: {
        PLANET_PLANET_COLLISION: boolean,
        ASTEROID_PLANET_COLLISION: boolean,
        ASTEROID_ASTEROID_COLLISION: boolean,
    }

    objects: {
        Planets: Array<Planet>,
        Asteroids: Array<Asteroid>,
        Balls: Array<Ball>,
    }

    constructor() {
        this.scale = 1

        this.options = {
            PLANET_PLANET_COLLISION: false,  // true - планеты будут отталкиваться друг от друга
            ASTEROID_PLANET_COLLISION: false,  // true - ракеты будут отталкиваться от планет
            ASTEROID_ASTEROID_COLLISION: false,  //	true - ракеты будут отталкиваться друг от друга
        }

        this.objects = {
            Planets: [],
            Asteroids: [],
            Balls: [],
        }

        this.app = new PIXI.Application({
            resizeTo: window,
        })
        document.body.appendChild(this.app.view);
        this.app.stage.interactive = true;
        this.interactionManager = new PIXI.InteractionManager(this.app.renderer)

        // Присваиваем клавишам клавиатуры и мыши свои действия
        this.keysPressed = {};
        this.mouseButtonsPressed = {};
        window.addEventListener("keydown", (ev) => {
            this.keysPressed[ev.code] = true;
        });
        window.addEventListener("keyup", (ev) => {
            this.keysPressed[ev.code] = false;
        });
        window.addEventListener("mousedown", (ev) => {
            this.mouseButtonsPressed[ev.button] = true;
        });
        window.addEventListener("mouseup", (ev) => {
            this.mouseButtonsPressed[ev.button] = false;
        });
        window.onwheel = (ev) => {
            if (ev.deltaY > 0) {
                this.scale /= 2
            } else {
                this.scale *= 2
            }
            console.log(this.scale)
        }

        this.FPSCounter = new FPSCounter(this, "top-left")
    }

    getMousePos(): PIXI.Point {
        return this.interactionManager.mouse.global;
    }

    clearStage(): void {
        for (let i = this.app.stage.children.length; i >= 0; i--) {
            if (this.app.stage.children[i] !== this.FPSCounter.text) {
                this.app.stage.removeChild(this.app.stage.children[i]);
            }
        }
    }
}