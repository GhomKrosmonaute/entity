import { Application, Container, IApplicationOptions } from "pixi.js"
import { ContainerEntity } from "./container"
import { Base } from "./base"

export class ApplicationEntity extends ContainerEntity {
  public application: Application

  constructor(
    options?: IApplicationOptions,
    setup?: (app: Application) => unknown
  ) {
    super(new Container())

    this.application = new Application(options)
    this.container = this.application.stage

    setup?.(this.application)

    this.setup()

    Base.ticker.add(() => {
      Base.frameTime = Date.now()
      Base.timeSinceLastFrame = Base.frameTime - Base.lastFrameTime
      Base.lastFrameTime = Base.frameTime
      Base.timeSinceStart += Base.timeSinceLastFrame

      this.update(true)
    })
  }
}
