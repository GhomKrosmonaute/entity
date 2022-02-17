import { Entity, EntityResolvable } from "./entity"

export class Sequence extends Entity {
  private index = 0
  private current: Entity

  constructor(private list: EntityResolvable[]) {
    super()

    this.next()
  }

  private next() {
    if (this.list.length >= this.index) {
      this.teardown()
    } else {
      this.current = Entity.resolve(this.list[this.index])
      this.current.on("teardown", () => this.next())
      this.addChild(this.current)
      this.index++
    }
  }
}

export class Parallel extends Entity {
  constructor(private list: EntityResolvable[]) {
    super()

    this.addChild(...list.map(Entity.resolve))
  }

  onUpdate() {
    if (this.children.length === 0) {
      this.teardown()
    }
  }
}
