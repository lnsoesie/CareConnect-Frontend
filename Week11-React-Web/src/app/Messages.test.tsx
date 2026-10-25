import { render, screen, fireEvent } from "@testing-library/react"
import { MemoryRouter, useLocation } from "react-router"
import { MessagesRoute } from "./screens"

function CurrentPath() {
  const location = useLocation()
  return <div data-testid="current-path">{location.pathname}</div>
}

describe("CareConnect Messages", () => {
  function renderMessages() {
    return render(
      <MemoryRouter initialEntries={["/messages"]}>
        <MessagesRoute />
        <CurrentPath />
      </MemoryRouter>
    )
  }

  test("displays existing patient messages", () => {
    renderMessages()

    expect(
      screen.getByRole("heading", { name: "Messages" })
    ).toBeInTheDocument()

    expect(
      screen.getByText("Your test results are ready")
    ).toBeInTheDocument()

    expect(
      screen.getByText("Annual wellness visit Reminder")
    ).toBeInTheDocument()
  })

  test("navigates to the New Message screen", () => {
    renderMessages()

    fireEvent.click(
      screen.getByRole("button", { name: /New Message/i })
    )

    expect(
      screen.getByTestId("current-path")
    ).toHaveTextContent("/messages/new")
  })
})
