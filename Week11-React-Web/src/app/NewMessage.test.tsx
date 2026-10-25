import { render, screen, fireEvent } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { NewMessageRoute } from "./screens"
import { PortalProvider } from "./store"

describe("CareConnect New Message", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test("shows validation errors when submitting an empty message", () => {
    render(
      <MemoryRouter initialEntries={["/messages/new"]}>
        <PortalProvider>
          <NewMessageRoute />
        </PortalProvider>
      </MemoryRouter>
    )

    fireEvent.click(
      screen.getByRole("button", { name: /Send Message/i })
    )

    expect(
      screen.getByText("Enter a provider name.")
    ).toBeInTheDocument()

    expect(
      screen.getByText("Message must be at least 10 characters.")
    ).toBeInTheDocument()

    expect(
      screen.queryByText("Your secure message was sent.")
    ).not.toBeInTheDocument()
  })

  test("successfully sends a valid secure message", () => {
    render(
      <MemoryRouter initialEntries={["/messages/new"]}>
        <PortalProvider>
          <NewMessageRoute />
        </PortalProvider>
      </MemoryRouter>
    )

    fireEvent.change(
      screen.getByPlaceholderText("Enter provider name"),
      { target: { value: "Dr. Smith" } }
    )

    fireEvent.change(
      screen.getByPlaceholderText("Type your message here"),
      {
        target: {
          value: "I would like to discuss my recent test results.",
        },
      }
    )

    fireEvent.click(
      screen.getByRole("button", { name: /Send Message/i })
    )

    expect(
      screen.getByText("Your secure message was sent.")
    ).toBeInTheDocument()

    expect(
      screen.queryByText("Enter a provider name.")
    ).not.toBeInTheDocument()
  })

})
