const app = new PIXI.Application({
	resizeTo: window,
});
document.body.appendChild(app.view);
app.stage.interactive = true;
interactionManager = new PIXI.InteractionManager(app.renderer);

const G = 6.67  // Гравитационная постоянная (Нахрена она нужна?)
const PLANET_PLANET_COLLISION = false;  // true - планеты будут отталкиваться друг от друга
const ROCKET_PLANET_COLLISION = false;  // true - ракеты будут отталкиваться от планет
const ROCKET_ROCKET_COLLISION = false;  //	true - ракеты будут отталкиваться друг от друга
let keysPressed = {};
let mouseButtonsPressed = {};


function getMousePos() {
	return interactionManager.mouse.global;
}


window.addEventListener("keydown", keysDown);
window.addEventListener("keyup", keysUp);
function keysDown(e) {
	//console.log(e.keyCode)
	keysPressed[e.keyCode] = true;
}
function keysUp(e) {
	keysPressed[e.keyCode] = false;
}

window.addEventListener("mousedown", mouseDown);
window.addEventListener("mouseup", mouseUp);
function mouseDown(e) {
	mouseButtonsPressed[e.button] = true;
}
function mouseUp(e) {
	mouseButtonsPressed[e.button] = false;
}


function clearStage() {
	for (let i = app.stage.children.length; i >= 0; i--) {
		app.stage.removeChild(app.stage.children[i]);
	}
}


function randomFloatBetween(a, b) {
	let diff = b - a; 
	return a + Math.random() * diff;
}


function randInt(a, b) {
	let diff = b - a;
	return a + Math.floor(Math.random() * diff)
}


function getRandomColor() {
  let letters = '0123456789ABCDEF';
  let color = '0x';
  for (var i = 0; i < 6; i++) {
    color += letters[randInt(0, 16)];
  }
  return color;
}


function radiansToDegrees(radians) {
	return radians / Math.PI * 180;
}


function findDistance(dx, dy) {
	return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
}


function createCircle(options) {
	let defOpt = {  // defaultOptions
		x: 0, 
		y: 0, 
		R: 20, 
		lineWidth: 1,
		lineColor: 0xffffff,
		lineAlpha: 1, 
		fillColor: 0x000000,
	}
	Object.assign(defOpt, options);  // Заменяем аргументы по умолчанию на те, которые ввели

	let circle = new PIXI.Graphics();
	circle.lineStyle(defOpt.lineWidth, defOpt.lineColor, defOpt.lineAlpha);
	circle.beginFill(defOpt.fillColor);
	circle.drawCircle(defOpt.x, defOpt.y, defOpt.R);
	circle.endFill();
	return circle;
}


function createRectangle(options) {
	let defOpt = {  // defaultOptions
		x: 0, 
		y: 0, 
		width: 100,
		height: 20,
		lineWidth: 1,
		lineColor: 0xffffff,
		lineAlpha: 1, 
		fillColor: 0x000000,
	}
	Object.assign(defOpt, options);  // Заменяем аргументы по умолчанию на те, которые ввели

	let rect = new PIXI.Graphics();
	rect.lineStyle(defOpt.lineWidth, defOpt.lineColor, defOpt.lineAlpha);
	rect.beginFill(defOpt.fillColor);
	rect.drawRect(defOpt.x, defOpt.y, defOpt.width, defOpt.height);
	rect.endFill();
	return rect;
}


function createTriangle(options) {
	let defOpt = {  // defaultOptions
		x: 0, 
		y: 0, 
		size: 50,
		lineWidth: 1,
		lineColor: 0xffffff,
		lineAlpha: 1, 
		fillColor: 0x000000,
	}
	Object.assign(defOpt, options);  // Заменяем аргументы по умолчанию на те, которые ввели
	let points = [
		0, defOpt.size / 2, 
		defOpt.size, defOpt.size,
		defOpt.size, 0
	]
	let triangle = new PIXI.Graphics();
	triangle.lineStyle(defOpt.lineWidth, defOpt.lineColor, defOpt.lineAlpha);
	triangle.beginFill(defOpt.fillColor);
	triangle.drawPolygon(points);
	triangle.endFill();
	triangle.pivot.set(defOpt.size / 2, defOpt.size / 2);
	return triangle;
}




class MovingObject {
	constructor(x, y, vx, vy, mass) {
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.mass = mass;
	}

	setPos(x, y) {
		this.sprite.x = x;
		this.sprite.y = y;
		this.x = x;
		this.y = y;
	}

	setX(x) {
		this.x = x;
		this.sprite.x = x;
	}

	setY(y) {
		this.y = y;
		this.sprite.y = y;
	}

	move() {
		this.setPos(this.x + this.vx, this.y + this.vy);
	}

	moveWithoutChecking() {
		this.setPos(this.x + this.vx, this.y + this.vy);
	}

	bounceOffEdges() {
		if (this.x < 0) {
			this.setX(0);
			this.vx = -this.vx;
		}
		else if (this.x > app.view.width) {
			this.setX(app.view.width);
			this.vx = -this.vx;
		}

		if (this.y < 0) {
			this.setY(0);
			this.vy = -this.vy;
		}
		else if (this.y > app.view.height) {
			this.setY(app.view.height);
			this.vy = -this.vy;
		}
	}

	calculateGravityWithOtherBodies(classListOfBodies) {
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





class CircleMovingObject extends MovingObject {
	constructor(x, y, vx, vy, mass, R) {
		super(x, y, vx, vy, mass);
		this.R = R;
		this.createSprite();
		app.stage.addChild(this.sprite);
		app.ticker.add(this.move.bind(this));
	}

	getOneCollidingBody(listOfBodies) {
		for (let body of listOfBodies) {
			if (body != this) {
				let dx = body.x - this.x;
				let dy = body.y - this.y;
				let dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
				if (dist <= this.R + body.R) {
					return body;
				}
			}
		}
		return null;
	}

	checkAndDoCollision(listOfBodies) {
		let body = this.getOneCollidingBody(listOfBodies);
		if (body != null) {
			let dx = body.x - this.x;
			let dy = body.y - this.y;
			let normalVector = new Vector(dx, dy);
			let unitNormal = normalVector.dividedBy(normalVector.getMagnitude());
			let unitTangent = new Vector(-unitNormal.y, unitNormal.x);
			let v1 = new Vector(this.vx, this.vy);
			let v2 = new Vector(body.vx, body.vy);

			let v1normalScalar = Vector.dotProduct(unitNormal, v1);
			let v1tangentScalar = Vector.dotProduct(unitTangent, v1);
			let v2normalScalar = Vector.dotProduct(unitNormal, v2);
			let v2tangentScalar = Vector.dotProduct(unitTangent, v2);

			let v1tangentScalarNew = v1tangentScalar;
			let v2tangentScalarNew = v2tangentScalar;
			let v1normalScalarNew = (v1normalScalar * (this.mass - body.mass) + 2 * body.mass * v2normalScalar) / (this.mass + body.mass);
			let v2normalScalarNew = (v2normalScalar * (body.mass - this.mass) + 2 * this.mass * v1normalScalar) / (this.mass + body.mass);

			let v1normalVector = unitNormal.multipliedBy(v1normalScalarNew);
			let v2normalVector = unitNormal.multipliedBy(v2normalScalarNew);
			let v1tangentVector = unitTangent.multipliedBy(v1tangentScalarNew);
			let v2tangentVector = unitTangent.multipliedBy(v2tangentScalarNew);

			let v1New = Vector.addition(v1normalVector, v1tangentVector);
			let v2New = Vector.addition(v2normalVector, v2tangentVector);

			this.vx = v1New.x;
			this.vy = v1New.y;
			body.vx = v2New.x;
			body.vy = v2New.y;

			this.moveWithoutChecking();
			body.moveWithoutChecking();
		}
	}
}





class Planet extends CircleMovingObject {
	static allObjects = [];  // Массив, содержащий все созданные планеты

	constructor(x, y, vx, vy, mass, R) {
		super(x, y, vx, vy, mass, R);
		Planet.allObjects.push(this);
	}

	createSprite() {
		this.sprite = createCircle({
			R: this.R,
			lineWidth: 3,
		});
		this.createText();
	}

	createText() {
		this.textStyle = new PIXI.TextStyle({
			fontFamily: "Arial",
			fontSize: 16,
  			fill: "white",
		})
		this.infoText = new PIXI.Text("", this.textStyle); 
		app.stage.addChild(this.infoText);
	}

	setPos(x, y) {
		super.setPos(x, y);
		this.infoText.position.set(x + this.R, y - this.R);
	}

	move() {
		this.calculateGravityWithOtherBodies(Planet.allObjects);
		this.showInfo();
		if (PLANET_PLANET_COLLISION) {
			this.checkAndDoCollision(Planet.allObjects);
		}
		super.move();
	}

	showInfo() {
		this.infoText.text = `Vx: ${this.vx}\nVy: ${this.vy}\nMass: ${this.mass}\nRadius: ${this.R}`
	}
}




class Rocket extends CircleMovingObject {
	static allObjects = []

	constructor(x, y, vx, vy) {
		super(x, y, vx, vy, 1, 5);
		Rocket.allObjects.push(this);
	}

	createSprite() {
		this.sprite = createCircle({
			R: this.R,
			fillColor: getRandomColor(),
			lineWidth: 0,
		})
	}

	move() {
		this.calculateGravityWithOtherBodies(Planet.allObjects);
		super.move();
		if (ROCKET_ROCKET_COLLISION) {
			this.checkAndDoCollision(Rocket.allObjects);
		}
		if (ROCKET_PLANET_COLLISION) {
			this.checkAndDoCollision(Planet.allObjects);
		}
		//this.bounceOffEdges();
	}
}





class Ball extends CircleMovingObject {
	static allObjects = [];

	constructor(x, y, vx, vy, mass, R) {
		super(x, y, vx, vy, mass, R);
		Ball.allObjects.push(this);
	}

	createSprite() {
		this.sprite = createCircle({
			R: this.R,
			lineWidth: 1
		});
	}

	move() {
		this.checkAndDoCollision(Ball.allObjects);
		super.move();
	}
}






class Vector {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	getMagnitude() {
		return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
	}

	multipliedBy(n) {
		return new Vector(this.x * n, this.y * n);
	}

	dividedBy(n) {
		return new Vector(this.x / n, this.y / n);
	}

	static dotProduct(vect1, vect2) {
		return vect1.x * vect2.x + vect1.y * vect2.y;
	}

	static addition(vect1, vect2) {
		return new Vector(vect1.x + vect2.x, vect1.y + vect2.y);
	}
}





class Button {
	constructor(x, y, text, event) {
		this.x = x;
		this.y = y;
		this.text = new PIXI.Text(text);
		this.textureMouseOver = createRectangle({
			fillColor: 0xff0000,
			width: 300,
			height: 100,
		});
		this.defaultTexture = createRectangle({
			fillColor: 0xccccff,
			width: 150,
			height: 50,
		});
		this.texture = this.defaultTexture;

		this.button = new PIXI.Container();
		this.button.addChild(this.texture);
		this.button.addChild(this.text);
		//this.text.anchor.set(0.5, 0.5);
		this.text.position.set(this.button.width / 2 - this.text.width / 2, this.button.height / 2 - this.text.height / 2);

		this.button.interactive = true;
		this.button.buttonMode = true;

		this.button
			.on('pointerdown', event)
			.on('pointerover', this.onButtonOver)
			.on('pointerout', this.onButtonOut);

		app.stage.addChild(this.button);
		this.button.position.set(this.x, this.y);
	}

	onButtonOver() {
		this.texture = this.textureMouseOver;
	}

	onButtonOut() {
		this.texture = this.defaultTexture;
	}
}





class Player extends MovingObject{
	constructor(x, y) {
		super(x, y, 0, 0, 1)
		this.size = 20;
		this.landed = false;
		this.createSprite();

		this.closestPlanet = {
			object: undefined,
			dx: undefined,
			dy: undefined,
			distToCenter: undefined,
			unitRadiusVector: undefined,  // Единичный вектор, направленный от центра планеты до игрока.
			unitTangentVector: undefined, // Единичный вектор, перпендикулярный предыдущему, то есть идёт по касательной к поверхности планеты
		};

		this.gun = {
			sprite: createRectangle({
				width: 10,
				height: 5,
				fillColor: 0x0000ff,
			}),
			unitPlayerMouseVector: undefined,
			x: undefined,
			y: undefined,
		}
		this.gun.sprite.pivot.set(5, 2.5);
		this.bulletSpeed = 7;
		this.gunHoldDistance = 10; // Насколько далеко от себя держит оружие
		this.movementSpeed = 3;  // Скорость передвижения игрока
		this.jumpSpeed = 5;  // На сколько изменяется модуль скорости при прыжке
		this.descendSpeed = 0.3;

		app.stage.addChild(this.gun.sprite);
		app.stage.addChild(this.sprite);
		app.ticker.add(this.move.bind(this));

	}

	createSprite() {
		this.sprite = createTriangle({
			lineColor: 0xff0000,
			size: this.size,
		});
	}

	move() {
		this.calculateGravityWithOtherBodies(Planet.allObjects);

		this.findClosestPlanet();
		this.closestPlanet.dx = this.x - this.closestPlanet.object.x;
		this.closestPlanet.dy = this.y - this.closestPlanet.object.y;
		this.closestPlanet.radiusVector = new Vector(this.closestPlanet.dx, this.closestPlanet.dy);
		this.closestPlanet.unitRadiusVector = this.closestPlanet.radiusVector.dividedBy(this.closestPlanet.distToCenter);
		this.closestPlanet.unitTangentVector = new Vector(-this.closestPlanet.unitRadiusVector.y, this.closestPlanet.unitRadiusVector.x);
		this.closestPlanet.distVector = this.closestPlanet.unitRadiusVector.multipliedBy(this.closestPlanet.object.R + this.size / 2); // Вектор, который идёт от центра планеты до центра игрока, если бы он стоял на поверхности (сумма радиуса планеты и высоты игрока)

		this.turnToClosestPlanet();
		this.bounceOffClosestPlanet();
		super.move();
		this.checkKeysPressed();

		this.moveGun();
	}

	turnToClosestPlanet() {
		let angle = Math.atan2(-this.closestPlanet.dy, -this.closestPlanet.dx);
		this.sprite.rotation = angle;
	}

	bounceOffClosestPlanet() {
		if (this.closestPlanet.distToCenter < this.size / 2 + this.closestPlanet.object.R) {
			this.landed = true;

			this.vx = this.closestPlanet.object.vx;
			this.vy = this.closestPlanet.object.vy;
			this.setX(this.closestPlanet.object.x + this.closestPlanet.distVector.x);
			this.setY(this.closestPlanet.object.y + this.closestPlanet.distVector.y);
		}
	}

	findClosestPlanet() {
		let minDistSquared = Infinity;
		let resPlanet = null;
		for (let planet of Planet.allObjects) {
			let dx = planet.x - this.x;
			let dy = planet.y - this.y;
			let distSquared = Math.pow(dx, 2) + Math.pow(dy, 2);
			if (distSquared < minDistSquared) {
				minDistSquared = distSquared;
				resPlanet = planet;
			}
		}
		
		this.closestPlanet.object = resPlanet;
		this.closestPlanet.distToCenter = Math.sqrt(minDistSquared);
	}

	checkKeysPressed() {
		let DescendVector = this.closestPlanet.unitRadiusVector.multipliedBy(this.descendSpeed);
		let JumpVector = this.closestPlanet.unitRadiusVector.multipliedBy(this.jumpSpeed);  // Вектор прыжка от центра планеты 
		let MovementVector = this.closestPlanet.unitTangentVector.multipliedBy(this.movementSpeed);  // Вектор движения игрока по касательной к поверхности планеты

		// W
		if (keysPressed["87"]) {
			//this.setY(this.y - 5);
		}
		
		// S
		if (keysPressed["83"]) {
			this.vx -= DescendVector.x;
			this.vy -= DescendVector.y;
		}

		// A
		if (keysPressed["65"]) {
			//this.setX(this.x - 5);
			if (this.landed) {
				this.setX(this.x - MovementVector.x);
				this.setY(this.y - MovementVector.y);
			}
		}

		// D
		if (keysPressed["68"]) {
			//this.setX(this.x + 5);
			if (this.landed) {
				this.setX(this.x + MovementVector.x);
				this.setY(this.y + MovementVector.y);
			}
		}

		// Space
		if (keysPressed["32"] && this.landed) {
			this.landed = false;
			this.vx += JumpVector.x;
			this.vy += JumpVector.y;
		}

		// LMB
		if (mouseButtonsPressed["0"]) {
			if (this.gun.unitPlayerMouseVector) {  // Если вектор был высчитан хоть раз
				this.shoot();
			}
		}
	}

	moveGun() {
		let mousePos = getMousePos();
		let mouseX = mousePos.x;
		let mouseY = mousePos.y;
		let dx = mouseX - this.x;
		let dy = mouseY - this.y;
		let playerMouseVector = new Vector(dx, dy);
		let unitPlayerMouseVector = playerMouseVector.dividedBy(findDistance(dx, dy));
		this.gun.unitPlayerMouseVector = unitPlayerMouseVector;
		let playerGunVector = unitPlayerMouseVector.multipliedBy(this.gunHoldDistance);
		let angle = Math.atan2(dy, dx);

		this.gun.x = this.x + playerGunVector.x;
		this.gun.y = this.y + playerGunVector.y;
		this.gun.sprite.x = this.x + playerGunVector.x;
		this.gun.sprite.y = this.y + playerGunVector.y;
		this.gun.sprite.rotation = angle;
	}

	shoot() {
		let bulletVector = this.gun.unitPlayerMouseVector.multipliedBy(this.bulletSpeed);
		new Bullet(this.gun.x, this.gun.y, bulletVector.x, bulletVector.y);
	}
}





class Bullet extends CircleMovingObject {
	constructor(x, y, vx, vy) {
		super(x, y, vx, vy, 1, 3);
	}

	createSprite() {
		this.sprite = createCircle({
			R: this.R,
			fillColor: 0xffff00,
			lineWidth: 0,
		})
	}

	move() {
		this.calculateGravityWithOtherBodies(Planet.allObjects);
		super.move();
	}
}





function case1() {
	clearStage();
	new Planet(100, 100, 0, 0, 100, 100);
	new Planet(800, 800, 0, 0, 100, 100);
}

function case2() {
	clearStage();
	new Planet(500, 500, 0, 0, 500, 100);
	setInterval(func, 1)
	function func() {
		new Rocket(500, 300, randomFloatBetween(-3, 3), randomFloatBetween(0, 3));
	}
}

function case3() {
	clearStage();
	new Ball(200, 350, 2, 0, 100, 50);
	new Ball(600, 400, 0, 0, 100, 50);
}

function case4() {
	clearStage();
	new Ball(200, 400, 2, 0, 500, 50);

	new Ball(1000, 400, 0, 0, 100, 50);

	new Ball(1100, 340, 0, 0, 100, 50);
	new Ball(1100, 460, 0, 0, 100, 50);

	new Ball(1200, 280, 0, 0, 100, 50);
	new Ball(1200, 400, 0, 0, 100, 50);
	new Ball(1200, 520, 0, 0, 100, 50);
}

function case5() {
	clearStage();
	new Planet(900, 500, 0, 0, 1000, 100);
	setInterval(func, 1)
	function func() {
		new Rocket(randInt(100, 1800), randInt(100, 900), randomFloatBetween(-3, 3), randomFloatBetween(-3, 3));
	}
}

function case6() {
	clearStage();
	new Planet(900, 300, 2, 0, 500, 100);
	new Planet(900, 700, -2, 0, 500, 100);
	new Rocket(900, 500, 0, 0);
	new Player(100, 100);
}

new Button(100, 200, "Planets", case1);
new Button(100, 300, "Asteroids", case2);
new Button(100, 400, "Collision", case3);
new Button(100, 500, "Billiard", case4);
new Button(100, 600, "Random", case5);
new Button(100, 700, "Orbitals", case6);


let tr = createTriangle();
tr.x = 50;
tr.y = 50;
function f() {
	tr.rotation += 0.01;
}
app.ticker.add(f);
app.stage.addChild(tr);