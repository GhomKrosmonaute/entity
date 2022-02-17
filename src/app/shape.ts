import * as p5 from "p5"
import { Drawable, DrawableSettings } from "./drawable"

export abstract class Shape
  extends Drawable
  implements Positionable, Resizable
{
  abstract x: number
  abstract y: number
  abstract width: number
  abstract height: number
  abstract readonly centerX: number
  abstract readonly centerY: number

  get center(): [x: number, y: number] {
    return [this.centerX, this.centerY]
  }
}

export class Rect extends Shape {
  constructor(
    public x = 0,
    public y = 0,
    public width = 0,
    public height = 0,
    options?: DrawableSettings
  ) {
    super(options)
  }

  get centerX() {
    return this.x + this.width / 2
  }

  get centerY() {
    return this.y + this.height / 2
  }

  get isHovered(): boolean {
    return (
      mouseX > this.x &&
      mouseX < this.x + this.width &&
      mouseY > this.y &&
      mouseY < this.y + this.height
    )
  }

  onDraw() {
    super.onDraw()
    rect(this.x, this.y, this.width, this.height)
  }
}

export class Circle extends Shape {
  constructor(
    public x = 0,
    public y = 0,
    public diameter = 0,
    options?: DrawableSettings
  ) {
    super(options)
  }

  get width() {
    return this.diameter
  }

  get height() {
    return this.diameter
  }

  get centerX() {
    return this.x
  }

  get centerY() {
    return this.y
  }

  get isHovered(): boolean {
    return dist(mouseX, mouseY, this.x, this.y) < this.diameter / 2
  }

  onDraw() {
    super.onDraw()
    circle(this.x, this.y, this.diameter)
  }
}

export class Ellipse extends Rect {
  get centerX() {
    return this.x
  }

  get centerY() {
    return this.y
  }

  get isHovered(): boolean {
    return (
      Math.pow(mouseX - this.x, 2) / Math.pow(this.width / 2, 2) +
        Math.pow(mouseY - this.y, 2) / Math.pow(this.height / 2, 2) <=
      1
    )
  }

  onDraw() {
    super.onDraw()
    ellipse(this.x, this.y, this.width, this.height)
  }
}

export class Line extends Shape {
  constructor(
    public x = 0,
    public y = 0,
    public x2 = 0,
    public y2 = 0,
    options?: DrawableSettings
  ) {
    super(options)
  }

  get width() {
    return this.x2 - this.x
  }

  get height() {
    return this.y2 - this.y
  }

  get size() {
    return dist(this.x, this.y, this.x2, this.y2)
  }

  get centerX() {
    return this.x + this.width / 2
  }

  get centerY() {
    return this.y + this.height / 2
  }

  get isHovered(): boolean {
    return (
      dist(this.x, this.y, mouseX, mouseY) +
        dist(mouseX, mouseY, this.x2, this.y2) <=
      this.size
    )
  }

  onDraw() {
    super.onDraw()
    line(this.x, this.y, this.x2, this.y2)
  }
}

export class Image extends Rect {
  constructor(
    public img: p5.Image,
    public x = 0,
    public y = 0,
    width?: number,
    height?: number,
    options?: DrawableSettings
  ) {
    super(x, y, width ?? img.width, height ?? img.height, options)
  }

  onDraw() {
    super.onDraw()
    image(this.img, this.x, this.y, this.width, this.height)
  }
}

export class Text extends Shape {
  constructor(
    public text = "",
    public x = 0,
    public y = 0,
    public _width?: number,
    public _height?: number,
    options?: DrawableSettings
  ) {
    super(options)
  }

  get width(): number {
    return this._width ?? Infinity
  }

  get height(): number {
    return this._height ?? Infinity
  }

  get centerX() {
    return this.settings.textAlign.x === CENTER
      ? this.x
      : this.x + this.width / 2
  }

  get centerY() {
    return this.settings.textAlign.y === CENTER
      ? this.y
      : this.y + this.height / 2
  }

  get isHovered(): boolean {
    return (
      mouseX > this.centerX - width / 10 &&
      mouseX < this.centerX + width / 10 &&
      mouseY > this.centerY - height / 10 &&
      mouseY < this.centerX + height / 10
    )
  }

  onDraw() {
    super.onDraw()
    text(this.text, this.x, this.y, this._width, this._height)
  }
}
