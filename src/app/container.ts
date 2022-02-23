import { Container } from "pixi.js"
import { Base } from "./base"

export class ContainerEntity extends Base {
  constructor(public container: Container) {
    super()
  }

  onSetup() {
    if (this.parent instanceof ContainerEntity)
      this.parent.container.addChild(this.container)
  }

  onTeardown() {
    if (this.parent instanceof ContainerEntity)
      this.parent.container.removeChild(this.container)
  }
}
