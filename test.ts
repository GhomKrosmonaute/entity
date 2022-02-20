import { Entity, Sequence, Animation } from "./src/index"

class RootEntity extends Entity {
  constructor() {
    super()
  }
}

const root = new RootEntity()

beforeAll(() => {
  root.setup()
  update()

  function update() {
    requestAnimationFrame(update)
  }
})

afterAll(() => {
  root.teardown()
})

describe("animation.ts", () => {
  test("Animation", (done) => {
    const animation = new Animation({
      from: 0,
      to: 1,
      duration: 200,
      onUpdate: (value) => {
        expect(value).toBeGreaterThanOrEqual(0)
        expect(value).toBeLessThanOrEqual(1)
      },
      onTeardown: () => {
        done()
      },
    })

    root.addChild(animation)
  })
})

describe("transition.ts", () => {
  test("Sequence", () => {
    const sequence = new Sequence([])

    root.addChild(sequence)
  })

  test("Parallel", () => {})
})
