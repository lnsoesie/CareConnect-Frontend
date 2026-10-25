import { render, screen } from "@testing-library/react"
import App from "./App"

jest.mock("./routes", () => ({
  router: {},
}))

jest.mock("react-router", () => ({
  RouterProvider: () => <div>CareConnect Router Loaded</div>,
}))

describe("CareConnect application", () => {
  test("renders the application router inside the portal provider", () => {
    render(<App />)

    expect(
      screen.getByText("CareConnect Router Loaded")
    ).toBeTruthy()
  })
})
