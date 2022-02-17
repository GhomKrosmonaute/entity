export type EntityListener<This extends Entity> = (
  this: This,
  it: This
) => unknown

export type EntityResolvable = Entity | (() => Entity)

export abstract class Entity {
  static frameCount = 0
  static resolve(entity: EntityResolvable) {
    return typeof entity === "function" ? entity() : entity
  }

  protected _startFrame = 0
  protected _isSetup = false
  protected _children = new Set<Entity>()
  protected _parent?: Entity
  protected _listeners: EntityListener<this>[] = []
  protected _stopPoints: Record<string, boolean> = {}

  get frameCount() {
    return Entity.frameCount - this._startFrame
  }

  get isSetup() {
    return this._isSetup
  }

  get children(): Array<Entity> {
    return [...this._children]
  }

  get parent(): Entity | undefined {
    return this._parent
  }

  /**
   * Used to be overwritten by your own workings
   */
  onSetup() {}

  /**
   * Used to be overwritten by your own workings
   */
  onUpdate(): boolean | void {}

  /**
   * Used to be overwritten by your own workings
   */
  onTeardown() {}

  /**
   * Should only be called if the current entity is a root.
   * Should not be overwritten!
   */
  public setup() {
    this._startFrame = Entity.frameCount
    if (!this.isSetup) {
      this.onSetup()
      this.transmit("setup")
      this._isSetup = true
    } else {
      console.warn(`${this.constructor.name} is already setup`)
    }
  }

  /**
   * Should only be called if the current entity is a root.
   * Should not be overwritten!
   */
  public update() {
    Entity.frameCount++
    if (this.isSetup) {
      if (this.onUpdate() !== false) this.transmit("update")
    } else {
      console.warn(`update is called before setup in ${this.constructor.name}`)
    }
  }

  /**
   * Should only be called if the current entity is a root.
   * Should not be overwritten!
   */
  public teardown() {
    if (this.isSetup) {
      this._isSetup = false
      this.onTeardown()
      this._parent?.removeChild(this)
      this.transmit("teardown")
    } else {
      console.warn(
        `teardown is called before setup in ${this.constructor.name}`
      )
    }
  }

  public on(name: string, listener: EntityListener<this>) {
    this._listeners.push(
      {
        [name]() {
          listener.bind(this)(this)
        },
      }[name].bind(this)
    )
  }

  public addChild(...children: Entity[]) {
    for (const child of children) {
      child._parent = this
      this._children.add(child)
      if (this.isSetup) child.setup()
    }
  }

  public removeChild(...children: Entity[]) {
    for (const child of children) {
      if (child.isSetup) child.teardown()
      else this._children.delete(child)
    }
  }

  public stopTransmission(name: string) {
    this._stopPoints[name] = true
  }

  public transmit(name: string) {
    for (const listener of this.getListenersByName(name))
      listener.bind(this)(this)

    for (const child of this.children) {
      if (this._stopPoints[name]) {
        this._stopPoints[name] = false
        return
      }

      // @ts-ignore
      if (name in child && typeof child[name] === "function") child[name]()
    }
  }

  public getListenersByName(name: string) {
    return this._listeners.filter((listener) => {
      return listener.name === name
    })
  }

  public schema(
    indentation = 2,
    depth = 0,
    index: number | null = null
  ): string {
    return `${" ".repeat(indentation).repeat(depth)}${
      index === null ? "" : `${index} - `
    }${this.constructor.name} [${this.frameCount} frames] ${
      this._children.size > 0
        ? ` (children: ${this.children.length})${
            this._listeners.length > 0
              ? ` (listeners: ${this._listeners.length})`
              : ""
          }\n${this.children
            .map(
              (child, index) => `${child.schema(indentation, depth + 1, index)}`
            )
            .join("\n")}`
        : ""
    }`
  }
}
