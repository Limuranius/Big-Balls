import * as PIXI from "pixi.js"
import FPSCounter from "./FPSCounter";
import Asteroid from "./Asteroid";
import Planet from "./Planet";
import Ball from "./Ball";
import "@pixi/math-extras"

export default class GameManager {
    readonly app: PIXI.Application;
    readonly interactionManager: PIXI.InteractionManager;
    keysPressed: { [key: string]: boolean }
    mouseButtonsPressed: { [button: number]: boolean }
    FPSCounter: FPSCounter

    camera: {
        x: number,
        y: number,
        scale: number,
        scaleIncreaseFactor: number,
    }
    oldMousePos: PIXI.Point

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
        this.camera = {
            x: 0,
            y: 0,
            scale: 1,
            scaleIncreaseFactor: 1.1
        }
        this.oldMousePos = new PIXI.Point(0, 0)

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
        this.app.ticker.maxFPS = 0;
        this.interactionManager = new PIXI.InteractionManager(this.app.renderer)

        // Присваиваем клавишам клавиатуры и мыши свои действия
        this.keysPressed = {};
        this.mouseButtonsPressed = {};
        this.addKeyListeners()

        this.FPSCounter = new FPSCounter(this, "top-left")
    }

    checkKeys(): void {
        if (this.keysPressed["ArrowUp"]) {
            this.camera.y -= 3
        }
        if (this.keysPressed["ArrowDown"]) {
            this.camera.y += 3
        }
        if (this.keysPressed["ArrowLeft"]) {
            this.camera.x -= 3
        }
        if (this.keysPressed["ArrowRight"]) {
            this.camera.x += 3
        }

        if (this.mouseButtonsPressed[0]) {
            let currMousePos = this.getMousePos()
            let dPos = currMousePos.subtract(this.oldMousePos)
            this.oldMousePos = currMousePos.clone()
            console.log(dPos)

            this.camera.x -= dPos.x
            this.camera.y -= dPos.y
        }
    }

    addKeyListeners(): void {
        window.addEventListener("keydown", (ev) => {
            this.keysPressed[ev.code] = true;
        });
        window.addEventListener("keyup", (ev) => {
            this.keysPressed[ev.code] = false;
        });
        window.addEventListener("mousedown", (ev) => {
            this.mouseButtonsPressed[ev.button] = true;
            this.oldMousePos = this.getMousePos()
        });
        window.addEventListener("mouseup", (ev) => {
            this.mouseButtonsPressed[ev.button] = false;
        });

        window.onwheel = (ev) => {
            let sceneCenterMouseVector = this.getSceneCenterToMouse()
            if (ev.deltaY > 0) {
                this.camera.scale /= this.camera.scaleIncreaseFactor
                this.camera.x -= sceneCenterMouseVector.x * (this.camera.scaleIncreaseFactor - 1)
                this.camera.y -= sceneCenterMouseVector.y * (this.camera.scaleIncreaseFactor - 1)
            } else {
                this.camera.scale *= this.camera.scaleIncreaseFactor
                this.camera.x += sceneCenterMouseVector.x * (this.camera.scaleIncreaseFactor - 1)
                this.camera.y += sceneCenterMouseVector.y * (this.camera.scaleIncreaseFactor - 1)
            }
        }

        this.app.ticker.add(this.checkKeys.bind(this))
    }

    getMousePos(): PIXI.Point {
        return this.interactionManager.mouse.global;
    }

    getSceneCenterToMouse(): PIXI.Point {
        // Получить вектор от центра app.scene до положения мыши
        let mousePos = this.getMousePos()
        let sceneCenterPos = new PIXI.Point(this.camera.x, this.camera.y)  // Центр сцены определяется положением камеры
        return mousePos.add(sceneCenterPos)  // Хз, почему +, а не -
    }

    clearStage(): void {
        for (let i = this.app.stage.children.length; i >= 0; i--) {
            if (this.app.stage.children[i] !== this.FPSCounter.text) {
                this.app.stage.removeChild(this.app.stage.children[i]);
            }
        }
    }
}