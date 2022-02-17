import * as p5 from "p5"
import { Base } from "./base"

export interface DrawableSettings {
  fill: false | FillOptions
  stroke: false | StrokeOptions
  textSize?: number
  textAlign?: {
    x?: p5.HORIZ_ALIGN
    y?: p5.VERT_ALIGN
  }
}

export abstract class Drawable extends Base {
  protected constructor(protected settings?: DrawableSettings) {
    super()
  }

  onDraw() {
    if (!this.settings) return

    if (this.settings.fill) {
      if ("color" in this.settings.fill) {
        fill(this.settings.fill.color)
      } else {
        fill(this.settings.fill)
      }
    } else {
      noFill()
    }

    if (this.settings.stroke) {
      strokeWeight(this.settings.stroke.weight)
      stroke(this.settings.stroke.color)
    } else {
      noStroke()
    }

    if (this.settings.textAlign) {
      textAlign(this.settings.textAlign.x, this.settings.textAlign.y)
    } else {
      textAlign(CENTER, CENTER)
    }

    if (this.settings.textSize) {
      textSize(this.settings.textSize)
    } else {
      textSize(height * 0.1)
    }
  }
}
