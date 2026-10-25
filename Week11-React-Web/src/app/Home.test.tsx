import { render, screen, fireEvent } from "@testing-library/react"
import { MemoryRouter, useLocation } from "react-router"
import { HomeRoute } from "./screens"
import { PortalProvider } from "./store"

describe("CareConnect Dashboard", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test("displays the dashboard welcome message and appointment summary", () => {
    render(
      <MemoryRouter>
        <PortalProvider>
          <HomeRoute />
        </PortalProvider>
      </MemoryRouter>
    )

    expect(
      screen.getByText("Good morning, Jane")
    ).toBeInTheDocument()

    expect(
      screen.getByText("NEXT APPOINTMENT")
    ).toBeInTheDocument()

    expect(
      screen.getByText("Today, 2:30 PM")
    ).toBeInTheDocument()
  })

  test("allows patients to complete and uncomplete checklist tasks", () => {
    render(
      <MemoryRouter>
        <PortalProvider>
          <HomeRoute />
        </PortalProvider>
      </MemoryRouter>
    )

    const task = screen.getByRole("checkbox", {
      name: /Log blood pressure/i,
    })

    expect(task).toBeChecked()

    fireEvent.click(task)
    expect(task).not.toBeChecked()

    fireEvent.click(task)
    expect(task).toBeChecked()
  })


  test("navigates to appointments when View all is clicked", () => {
    function CurrentPath() {
      const location = useLocation()
      return <div data-testid="current-path">{location.pathname}</div>
    }

    render(
      <MemoryRouter initialEntries={["/"]}>
        <PortalProvider>
          <HomeRoute />
          <CurrentPath />
        </PortalProvider>
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole("button", { name: "View all" }))

    expect(
      screen.getByTestId("current-path")
    ).toHaveTextContent("/appointments")
  })

})
