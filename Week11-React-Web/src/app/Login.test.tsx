import { render, screen, fireEvent } from "@testing-library/react"
import { MemoryRouter, useLocation } from "react-router"
import { LoginRoute } from "./screens"

describe("CareConnect Login Screen", () => {
  test("displays the login form", () => {
    render(
      <MemoryRouter>
        <LoginRoute />
      </MemoryRouter>
    )

    expect(
      screen.getByRole("heading", { name: "Welcome" })
    ).toBeInTheDocument()

    expect(
      screen.getByPlaceholderText("name@example.com")
    ).toBeInTheDocument()

    expect(
      screen.getByPlaceholderText("Enter your password")
    ).toBeInTheDocument()

    expect(
      screen.getByRole("button", { name: "Sign in" })
    ).toBeInTheDocument()
  })

  test("shows errors when login fields are empty", () => {
    render(
      <MemoryRouter>
        <LoginRoute />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole("button", { name: "Sign in" }))

    expect(
      screen.getByText("Enter your email address.")
    ).toBeInTheDocument()

    expect(
      screen.getByText("Password must be at least 6 characters.")
    ).toBeInTheDocument()
  })


  test("allows users to show and hide their password", () => {
    render(
      <MemoryRouter>
        <LoginRoute />
      </MemoryRouter>
    )

    const password = screen.getByPlaceholderText("Enter your password")

    expect(password).toHaveAttribute("type", "password")

    fireEvent.click(screen.getByRole("button", { name: "Show password" }))

    expect(password).toHaveAttribute("type", "text")

    fireEvent.click(screen.getByRole("button", { name: "Hide password" }))

    expect(password).toHaveAttribute("type", "password")
  })


  test("rejects an invalid email address", () => {
    render(
      <MemoryRouter>
        <LoginRoute />
      </MemoryRouter>
    )

    fireEvent.change(
      screen.getByPlaceholderText("name@example.com"),
      { target: { value: "invalidemail.com" } }
    )

    fireEvent.change(
      screen.getByPlaceholderText("Enter your password"),
      { target: { value: "Password123" } }
    )

    fireEvent.click(screen.getByRole("button", { name: "Sign in" }))

    expect(
      screen.getByText("Enter a valid email address.")
    ).toBeInTheDocument()
  })


  test("navigates to the dashboard after valid login", () => {
    function CurrentPath() {
      const location = useLocation()
      return <div data-testid="current-path">{location.pathname}</div>
    }

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <LoginRoute />
        <CurrentPath />
      </MemoryRouter>
    )

    fireEvent.change(
      screen.getByPlaceholderText("name@example.com"),
      { target: { value: "patient@example.com" } }
    )

    fireEvent.change(
      screen.getByPlaceholderText("Enter your password"),
      { target: { value: "Password123" } }
    )

    fireEvent.click(screen.getByRole("button", { name: "Sign in" }))

    expect(screen.getByTestId("current-path")).toHaveTextContent("/")
  })

})
