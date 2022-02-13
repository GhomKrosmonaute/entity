import * as entity from "./entity"

export interface DrawableSettings {
  fill: false | FillOptions
  stroke: false | StrokeOptions
}

export abstract class Drawable extends entity.Entity {
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
    }

    if (this.settings.stroke) {
      strokeWeight(this.settings.stroke.weight)
      stroke(this.settings.stroke.color)
    } else {
      noStroke()
    }
  }
}
