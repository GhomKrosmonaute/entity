const { Animation, Sequence, Parallel, easingSet } = require("./dist/index")

const anim1 = new Animation({
  from: 0,
  to: 1,
  duration: 3,
  easing: easingSet.easeInBack,
})

const anim2 = new Animation({
  from: 0,
  to: 1,
  duration: 3,
  easing: easingSet.easeInBack,
})

const anim3 = new Animation({
  from: 0,
  to: 1,
  duration: 3,
  easing: easingSet.easeInBack,
})

const sequence = new Sequence([anim1, anim2])
const root = new Parallel([sequence, anim3])

describe("animation", () => {
  beforeAll(() => {
    root.setup()
  })

  test("update", () => {
    while (root.frameCount <= 6) {
      console.log(root.schema(2))
      root.update(true)
    }

    expect(root.isSetup).toBeFalsy()
  })
})
