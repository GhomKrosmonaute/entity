import { Entity } from "./entity"

export class Time extends Entity {
  protected startedAt = 0

  onSetup() {
    this.startedAt = frameCount
  }
}
