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
