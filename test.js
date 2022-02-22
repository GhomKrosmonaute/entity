const { Base } = require("./dist/index")

const root = new Base()
const child = new Base()

root.addChild(child)

test("setup", () => {
  root.setup()
  expect(child.isSetup).toBeTruthy()
})

afterAll(() => {
  root.teardown()
})
