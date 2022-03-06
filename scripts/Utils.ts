import * as PIXI from "pixi.js"

export function randomFloatBetween(a: number, b: number): number {
    let diff = b - a;
    return a + Math.random() * diff;
}


export function randInt(a: number, b: number): number {
    // [a : b)
    let diff = b - a;
    return a + Math.floor(Math.random() * diff)
}


export function getRandomColor(): number {
    let letters = '0123456789ABCDEF';
    let color = '0x';
    for (let i = 0; i < 6; i++) {
        color += letters[randInt(0, 16)];
    }
    return Number(color);
}


export function radiansToDegrees(radians: number): number {
    return radians / Math.PI * 180;
}


export function findDistance(dx: number, dy: number): number {
    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
}

interface IGeometry {
    lineWidth?: number,
    lineColor?: number,
    lineAlpha?: number,
    fillColor?: number,
    alignment?: number,
}

interface ICircle extends IGeometry {
    R?: number,
}

export function createCircle(
    {
        R = 20,
        lineWidth = 1,
        lineColor = 0xffffff,
        lineAlpha = 1,
        fillColor = 0x000000,
        alignment = 0.5,
    }: ICircle) {

    let circle = new PIXI.Graphics();
    circle.lineStyle(lineWidth, lineColor, lineAlpha, alignment);
    circle.beginFill(fillColor);
    circle.drawCircle(0, 0, R);
    circle.endFill();
    return circle;
}

interface IRectangle extends IGeometry {
    width?: number,
    height?: number,
    pivotX?: number,
    pivotY?: number,
}

export function createRectangle(
    {
        width = 100,
        height = 20,
        lineWidth = 1,
        lineColor = 0xffffff,
        lineAlpha = 1,
        fillColor = 0x000000,
        alignment = 0.5,
        pivotX = 0,
        pivotY = 0,
    }: IRectangle) {

    let rect = new PIXI.Graphics();
    rect.lineStyle(lineWidth, lineColor, lineAlpha, alignment);
    rect.beginFill(fillColor);
    rect.drawRect(0, 0, width, height);
    rect.pivot.set(pivotX, pivotY)
    rect.endFill();
    return rect;
}

interface ITriangle extends IGeometry {
    size?: number,
}

export function createTriangle(
    {
        size = 50,
        lineWidth = 1,
        lineColor = 0xffffff,
        lineAlpha = 1,
        fillColor = 0x000000,
        alignment = 0.5,
    }: ITriangle) {

    let points = [
        0, size / 2,
        size, size,
        size, 0
    ]
    let triangle = new PIXI.Graphics();
    triangle.lineStyle(lineWidth, lineColor, lineAlpha, alignment);
    triangle.beginFill(fillColor);
    triangle.drawPolygon(points);
    triangle.endFill();
    triangle.pivot.set(size / 2, size / 2);
    return triangle;
}