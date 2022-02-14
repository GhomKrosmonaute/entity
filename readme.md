# Entity

TypeScript only package for entity based state machine

## Library usage

```ts
// TypeScript
import { Entity } from "@ghom/entity"

/**
 * It is recommended to isolate root entity in another file to be able to import it wherever you want
 */
const root = new Entity

root.addChild(new Entity)
root.addChild(new Entity)

root.setup()

console.log(root.schema())

function update() {
  root.update()
  requestAnimationFrame(update)
}

requestAnimationFrame(update)
```

### Example with heritage

```ts
// TypeScript
import { Entity } from "@ghom/entity"

/**
 * Just a cool entity
 */
export class CoolEntity extends Entity {
  onUpdate() {
    console.log("cool!")
  }
}

/**
 * It is an Entity used as container containing other entities
 */
export class CoolContainer extends Entity {
  constructor(private count: number) {
    super()
  }

  onSetup() {
    for (let i = 0; i < this.count; i++) {
      this.addChild(new CoolEntity)
    }
  }
}
```
