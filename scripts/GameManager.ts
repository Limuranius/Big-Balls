import * as PIXI from "pixi.js"
import FPSCounter from "./FPSCounter";
import Asteroid from "./Asteroid";
import Planet from "./Planet";
import Ball from "./Ball";
import "@pixi/math-extras"
import Camera from "./Camera";
import Matter, {Engine} from "matter-js";

let decomp = require("poly-decomp")     // Добавляем разбиение полигонов для физического движка
Matter.Common.setDecomp(decomp)         //

export default class GameManager {
    readonly app: PIXI.Application;
    readonly interactionManager: PIXI.InteractionManager;
    readonly engine: Matter.Engine
    keysPressed: { [key: string]: boolean }
    mouseButtonsPressed: { [button: number]: boolean }
    FPSCounter: FPSCounter

    camera: Camera
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
        this.app = new PIXI.Application({
            resizeTo: window,
        })
        this.interactionManager = new PIXI.InteractionManager(this.app.renderer)
        this.engine = Engine.create()
        this.keysPressed = {};
        this.mouseButtonsPressed = {};
        this.FPSCounter = new FPSCounter(this, "top-left")
        this.camera = new Camera(this)
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
        this.addKeyListeners()
        this.setup()
    }

    setup() {
        document.body.appendChild(this.app.view);
        this.app.stage.interactive = true;
        this.app.ticker.maxFPS = 0;

        this.engine.gravity.y = 0
        // this.engine.positionIterations = 1
        // this.engine.velocityIterations = 1

        let func = () => {
            Matter.Engine.update(this.engine)
        }
        this.app.ticker.add(func.bind(this))
    }

    checkKeys(): void {
        if (this.keysPressed["ArrowUp"]) {
            this.camera.pos.y -= 3
        }
        if (this.keysPressed["ArrowDown"]) {
            this.camera.pos.y += 3
        }
        if (this.keysPressed["ArrowLeft"]) {
            this.camera.pos.x -= 3
        }
        if (this.keysPressed["ArrowRight"]) {
            this.camera.pos.x += 3
        }

        if (this.mouseButtonsPressed[0]) {
            let currMousePos = this.getMousePos()
            let dPos = currMousePos.subtract(this.oldMousePos)
            this.oldMousePos = currMousePos.clone()

            this.camera.pos = this.camera.pos.subtract(dPos)
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
            let cursorPos = this.getSceneCenterToMouse()
            if (ev.deltaY > 0) {  // scroll down | zoom out
                let dPos = cursorPos.multiplyScalar(1 - (1 / this.camera.scaleIncreaseFactor))
                this.camera.scale /= this.camera.scaleIncreaseFactor
                this.camera.pos = this.camera.pos.subtract(dPos)
            } else {  // scroll up | zoom in
                let dPos = cursorPos.multiplyScalar(this.camera.scaleIncreaseFactor - 1)
                this.camera.scale *= this.camera.scaleIncreaseFactor
                this.camera.pos = this.camera.pos.add(dPos)
            }
        }

        this.app.ticker.add(this.checkKeys.bind(this))
    }

    getMousePos(): PIXI.Point {
        return this.interactionManager.mouse.global;
    }

    getPointToMouseVector(point: PIXI.Point): PIXI.Point {
        let mousePos = this.getMousePos()
        return point.subtract(mousePos)
    }

    getSceneCenterToMouse(): PIXI.Point {
        // Получить вектор от центра app.scene до положения мыши
        let mousePos = this.getMousePos()
        let sceneCenterPos = new PIXI.Point(-this.camera.pos.x, -this.camera.pos.y)  // Центр сцены определяется положением камеры
        return mousePos.subtract(sceneCenterPos)
    }

    clearStage(): void {
        for (let i = this.app.stage.children.length; i >= 0; i--) {
            if (this.app.stage.children[i] !== this.FPSCounter.text) {
                this.app.stage.removeChild(this.app.stage.children[i]);
            }
        }
    }
}