import { render, screen, fireEvent } from "@testing-library/react"
import { MemoryRouter, useLocation } from "react-router"
import { ProfileRoute } from "./screens"

function CurrentPath() {
  const location = useLocation()
  return <div data-testid="current-path">{location.pathname}</div>
}

describe("CareConnect Profile", () => {
  function renderProfile() {
    return render(
      <MemoryRouter initialEntries={["/profile"]}>
        <ProfileRoute />
        <CurrentPath />
      </MemoryRouter>
    )
  }

  test("displays patient profile information", () => {
    renderProfile()

    expect(
      screen.getByRole("heading", { name: "Profile" })
    ).toBeInTheDocument()

    expect(
      screen.getByRole("heading", { name: "Jane Marie Doe" })
    ).toBeInTheDocument()

    expect(screen.getByText("PERSONAL INFORMATION")).toBeInTheDocument()
    expect(screen.getByText("EMERGENCY CONTACT")).toBeInTheDocument()
    expect(screen.getByText("Robert Doe")).toBeInTheDocument()
  })

  test("allows the patient to enter and leave edit mode", () => {
    const { container } = renderProfile()

    fireEvent.click(
      screen.getByRole("button", { name: /Edit Profile/i })
    )

    expect(
      screen.getByRole("button", { name: /Save Profile/i })
    ).toBeInTheDocument()

    expect(
      container.querySelectorAll(".detail-grid input")
    ).toHaveLength(4)

    fireEvent.click(
      screen.getByRole("button", { name: /Save Profile/i })
    )

    expect(
      screen.getByRole("button", { name: /Edit Profile/i })
    ).toBeInTheDocument()

    expect(
      container.querySelectorAll(".detail-grid input")
    ).toHaveLength(0)
  })

  test("navigates to login when the patient logs out", () => {
    renderProfile()

    fireEvent.click(
      screen.getByRole("button", { name: /Logout/i })
    )

    expect(
      screen.getByTestId("current-path")
    ).toHaveTextContent("/login")
  })
})
