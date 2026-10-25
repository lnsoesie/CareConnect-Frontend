import { render, screen, fireEvent } from "@testing-library/react"
import { MemoryRouter, Routes, Route, useLocation } from "react-router"
import { PortalLayout } from "./screens"

function CurrentPage() {
  const location = useLocation()
  return <div data-testid="current-path">{location.pathname}</div>
}

function renderPortal() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route element={<PortalLayout />}>
          <Route index element={<CurrentPage />} />
          <Route path="appointments" element={<CurrentPage />} />
          <Route path="settings" element={<CurrentPage />} />
        </Route>
      </Routes>
    </MemoryRouter>
  )
}

describe("CareConnect Portal Navigation", () => {
  test("opens and closes mobile navigation", () => {
    renderPortal()

    const openButton = screen.getByRole("button", {
      name: "Open navigation",
    })

    fireEvent.click(openButton)

    expect(
      screen.getAllByRole("button", { name: "Close navigation" })[0]
    ).toBeInTheDocument()

    const sidebar = document.getElementById("primary-navigation")
    expect(sidebar).toHaveClass("sidebar--open")

    fireEvent.click(
      screen.getAllByRole("button", { name: "Close navigation" })[0]
    )

    expect(sidebar).not.toHaveClass("sidebar--open")
  })

  test("navigates to appointments from the sidebar", () => {
    renderPortal()

    fireEvent.click(
      screen.getByRole("button", { name: "Appointments" })
    )

    expect(screen.getByTestId("current-path")).toHaveTextContent(
      "/appointments"
    )
  })

  test("opens the user menu and navigates to settings", () => {
    renderPortal()

    fireEvent.click(
      screen.getByRole("button", { name: /Jane Doe/i, expanded: false })
    )

    fireEvent.click(
      screen.getByRole("menuitem", { name: "Settings" })
    )

    expect(screen.getByTestId("current-path")).toHaveTextContent(
      "/settings"
    )
  })
})
