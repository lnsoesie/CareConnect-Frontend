import { render, screen, fireEvent } from "@testing-library/react"
import { MemoryRouter, useLocation } from "react-router"
import { NotFoundRoute } from "./screens"

function CurrentPath() {
  const location = useLocation()
  return <div data-testid="current-path">{location.pathname}</div>
}

describe("CareConnect Not Found", () => {
  function renderNotFound() {
    return render(
      <MemoryRouter initialEntries={["/404"]}>
        <NotFoundRoute />
        <CurrentPath />
      </MemoryRouter>
    )
  }

  test("displays the page not found message", () => {
    renderNotFound()

    expect(
      screen.getByRole("heading", { name: "Page not found" })
    ).toBeInTheDocument()

    expect(
      screen.getByText("The page you requested is unavailable.")
    ).toBeInTheDocument()

    expect(
      screen.getByRole("button", { name: "Return home" })
    ).toBeInTheDocument()
  })

  test("navigates home when Return home is clicked", () => {
    renderNotFound()

    fireEvent.click(
      screen.getByRole("button", { name: "Return home" })
    )

    expect(
      screen.getByTestId("current-path")
    ).toHaveTextContent("/")
  })
})
