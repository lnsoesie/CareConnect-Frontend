import { render, screen, fireEvent } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { ResetRoute } from "./screens"

describe("CareConnect Password Reset", () => {
  function renderReset() {
    return render(
      <MemoryRouter initialEntries={["/reset-password"]}>
        <ResetRoute />
      </MemoryRouter>
    )
  }

  test("displays the password recovery form", () => {
    renderReset()

    expect(
      screen.getByRole("heading", { name: "Reset Password" })
    ).toBeInTheDocument()

    expect(
      screen.getByPlaceholderText("name@organization.com")
    ).toBeInTheDocument()
  })

  test("shows an error for an unknown email", () => {
    renderReset()

    fireEvent.change(
      screen.getByPlaceholderText("name@organization.com"),
      { target: { value: "patient@unknown.com" } }
    )

    fireEvent.click(
      screen.getByRole("button", { name: /Send Reset Link/i })
    )

    expect(
      screen.getByText("We couldn't find an account for that email.")
    ).toBeInTheDocument()
  })

  test("shows confirmation after a reset request", () => {
    renderReset()

    fireEvent.change(
      screen.getByPlaceholderText("name@organization.com"),
      { target: { value: "patient@example.com" } }
    )

    fireEvent.click(
      screen.getByRole("button", { name: /Send Reset Link/i })
    )

    expect(
      screen.getByText("Reset instructions sent. Please check your inbox.")
    ).toBeInTheDocument()
  })
})
