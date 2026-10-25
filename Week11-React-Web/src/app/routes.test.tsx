import { readFileSync } from "node:fs"

describe("CareConnect routing", () => {
  test("defines the expected application routes", () => {
    const source = readFileSync(
      `${process.cwd()}/src/app/routes.tsx`,
      "utf8"
    )

    expect(source).toContain('path: "/login"')
    expect(source).toContain('path: "/reset-password"')
    expect(source).toContain('path: "/404"')
    expect(source).toContain('path: "*"')
    expect(source).toContain("createBrowserRouter")
  })
})
