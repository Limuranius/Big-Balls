// import MovingObject from "./MovingObject";
// import Planet from "./Planet";
// import Bullet from "./Bullet";
// import Vector from "./Vector";
// import {createRectangle, createTriangle, findDistance} from "./Utils";
// import * as PIXI from "pixi.js";
// import GameManager from "./GameManager";
//
// export default class Player extends MovingObject {
//     gm: GameManager;
//     size: number;
//     landed: boolean;
//     bulletSpeed: number;
//     gunHoldDistance: number;
//     movementSpeed: number;
//     jumpSpeed: number;
//     descendSpeed: number;
//
//     closestPlanet: {
//         object?: Planet,
//         dx?: number,
//         dy?: number,
//         distToCenter?: number,
//         unitRadiusVector?: Vector,
//         unitTangentVector?: Vector,
//         radiusVector?: Vector,
//         distVector?: Vector,
//     }
//
//     gun: {
//         sprite: PIXI.Sprite | PIXI.Graphics,
//         unitPlayerMouseVector?: Vector,
//         x?: number,
//         y?: number,
//     }
//
//
//     constructor(app: PIXI.Application, gm: GameManager, x: number, y: number) {
//         super(app, x, y, 0, 0, 1);
//         this.gm = gm;
//         this.size = 20;
//         this.landed = false;
//         this.createSprite();
//
//         this.closestPlanet = {
//             object: undefined,
//             dx: undefined,
//             dy: undefined,
//             distToCenter: undefined,
//             unitRadiusVector: undefined,  // Единичный вектор, направленный от центра планеты до игрока.
//             unitTangentVector: undefined, // Единичный вектор, перпендикулярный предыдущему, то есть идёт по касательной к поверхности планеты
//             radiusVector: undefined,
//             distVector: undefined,
//         };
//
//         this.gun = {
//             sprite: createRectangle({
//                 width: 10,
//                 height: 5,
//                 fillColor: 0x0000ff,
//             }),
//             unitPlayerMouseVector: undefined,
//             x: undefined,
//             y: undefined,
//         }
//         this.gun.sprite.pivot.set(5, 2.5);
//         this.bulletSpeed = 7;
//         this.gunHoldDistance = 10; // Насколько далеко от себя держит оружие
//         this.movementSpeed = 3;  // Скорость передвижения игрока
//         this.jumpSpeed = 5;  // На сколько изменяется модуль скорости при прыжке
//         this.descendSpeed = 0.3;
//
//         app.stage.addChild(this.gun.sprite);
//         app.stage.addChild(this.sprite);
//         app.ticker.add(this.move.bind(this));
//     }
//
//     createSprite() {
//         this.sprite = createTriangle({
//             lineColor: 0xff0000,
//             size: this.size,
//         });
//     }
//
//     move() {
//         this.calculateGravityWithOtherBodies(Planet.allObjects);
//
//         this.findClosestPlanet();
//         this.closestPlanet.dx = this.x - this.closestPlanet.object.x;
//         this.closestPlanet.dy = this.y - this.closestPlanet.object.y;
//         this.closestPlanet.radiusVector = new Vector(this.closestPlanet.dx, this.closestPlanet.dy);
//         this.closestPlanet.unitRadiusVector = this.closestPlanet.radiusVector.dividedBy(this.closestPlanet.distToCenter);
//         this.closestPlanet.unitTangentVector = new Vector(-this.closestPlanet.unitRadiusVector.y, this.closestPlanet.unitRadiusVector.x);
//         this.closestPlanet.distVector = this.closestPlanet.unitRadiusVector.multipliedBy(this.closestPlanet.object.R + this.size / 2); // Вектор, который идёт от центра планеты до центра игрока, если бы он стоял на поверхности (сумма радиуса планеты и высоты игрока)
//
//         this.turnToClosestPlanet();
//         this.bounceOffClosestPlanet();
//         super.move();
//         this.checkKeysPressed();
//
//         this.bounceOffEdges();
//
//         this.moveGun();
//     }
//
//     turnToClosestPlanet() {
//         this.sprite.rotation = Math.atan2(-this.closestPlanet.dy, -this.closestPlanet.dx);
//     }
//
//     bounceOffClosestPlanet() {
//         if (this.closestPlanet.distToCenter < this.size / 2 + this.closestPlanet.object.R) {
//             this.landed = true;
//
//             this.vx = this.closestPlanet.object.vx;
//             this.vy = this.closestPlanet.object.vy;
//             this.setX(this.closestPlanet.object.x + this.closestPlanet.distVector.x);
//             this.setY(this.closestPlanet.object.y + this.closestPlanet.distVector.y);
//         }
//     }
//
//     findClosestPlanet() {
//         let minDistSquared = Infinity;
//         let resPlanet = Planet.allObjects[0];
//         for (let planet of Planet.allObjects) {
//             let dx = planet.x - this.x;
//             let dy = planet.y - this.y;
//             let distSquared = Math.pow(dx, 2) + Math.pow(dy, 2);
//             if (distSquared < minDistSquared) {
//                 minDistSquared = distSquared;
//                 resPlanet = planet;
//             }
//         }
//
//         this.closestPlanet.object = resPlanet;
//         this.closestPlanet.distToCenter = Math.sqrt(minDistSquared);
//     }
//
//     checkKeysPressed() {
//         let DescendVector = this.closestPlanet.unitRadiusVector.multipliedBy(this.descendSpeed);
//         let JumpVector = this.closestPlanet.unitRadiusVector.multipliedBy(this.jumpSpeed);  // Вектор прыжка от центра планеты
//         let MovementVector = this.closestPlanet.unitTangentVector.multipliedBy(this.movementSpeed);  // Вектор движения игрока по касательной к поверхности планеты
//
//         // W
//         if (keysPressed["87"]) {
//             //this.setY(this.y - 5);
//         }
//
//         // S
//         if (keysPressed["83"]) {
//             this.vx -= DescendVector.x;
//             this.vy -= DescendVector.y;
//         }
//
//         // A
//         if (keysPressed["65"]) {
//             //this.setX(this.x - 5);
//             if (this.landed) {
//                 this.setX(this.x - MovementVector.x);
//                 this.setY(this.y - MovementVector.y);
//             }
//         }
//
//         // D
//         if (keysPressed["68"]) {
//             //this.setX(this.x + 5);
//             if (this.landed) {
//                 this.setX(this.x + MovementVector.x);
//                 this.setY(this.y + MovementVector.y);
//             }
//         }
//
//         // Space
//         if (keysPressed["32"] && this.landed) {
//             this.landed = false;
//             this.vx += JumpVector.x;
//             this.vy += JumpVector.y;
//         }
//
//         // LMB
//         if (mouseButtonsPressed["0"]) {
//             if (this.gun.unitPlayerMouseVector) {  // Если вектор был высчитан хоть раз
//                 this.shoot();
//             }
//         }
//     }
//
//     moveGun() {
//         let mousePos = this.gm.getMousePos();
//         let mouseX = mousePos.x;
//         let mouseY = mousePos.y;
//         let dx = mouseX - this.x;
//         let dy = mouseY - this.y;
//         let playerMouseVector = new Vector(dx, dy);
//         let unitPlayerMouseVector = playerMouseVector.dividedBy(findDistance(dx, dy));
//         this.gun.unitPlayerMouseVector = unitPlayerMouseVector;
//         let playerGunVector = unitPlayerMouseVector.multipliedBy(this.gunHoldDistance);
//         let angle = Math.atan2(dy, dx);
//
//         this.gun.x = this.x + playerGunVector.x;
//         this.gun.y = this.y + playerGunVector.y;
//         this.gun.sprite.x = this.x + playerGunVector.x;
//         this.gun.sprite.y = this.y + playerGunVector.y;
//         this.gun.sprite.rotation = angle;
//     }
//
//     shoot() {
//         let bulletVector = this.gun.unitPlayerMouseVector.multipliedBy(this.bulletSpeed);
//         new Bullet(this.app, this.gun.x, this.gun.y, bulletVector.x, bulletVector.y);
//     }
// }