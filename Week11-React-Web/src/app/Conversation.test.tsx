import { render, screen, fireEvent } from "@testing-library/react"
import { MemoryRouter, Routes, Route, useLocation } from "react-router"
import { ConversationRoute } from "./screens"
import { PortalProvider } from "./store"

function CurrentPath() {
  const location = useLocation()
  return <div data-testid="current-path">{location.pathname}</div>
}

describe("CareConnect Conversation", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  function renderConversation() {
    return render(
      <MemoryRouter initialEntries={["/messages/dr-sarah-smith"]}>
        <PortalProvider>
          <ConversationRoute />
        </PortalProvider>
      </MemoryRouter>
    )
  }

  test("displays the provider and existing messages", () => {
    renderConversation()

    expect(
      screen.getAllByRole("heading", { name: "Dr. Sarah Smith" })
    ).toHaveLength(2)

    expect(
      screen.getByText(/Your test results are ready, please let me know/i)
    ).toBeInTheDocument()

    expect(
      screen.getByText(/Thank you, Dr. Smith/i)
    ).toBeInTheDocument()
  })

  test("allows a patient to send a reply", () => {
    renderConversation()

    const messageInput = screen.getByPlaceholderText("Type a message...")

    fireEvent.change(messageInput, {
      target: {
        value: "Thank you for the update. I have a question.",
      },
    })

    fireEvent.submit(messageInput.closest("form")!)

    expect(
      screen.getByText("Thank you for the update. I have a question.")
    ).toBeInTheDocument()

    expect(messageInput).toHaveValue("")
  })

  test("does not send an empty or whitespace-only message", () => {
    renderConversation()

    const messageInput = screen.getByPlaceholderText("Type a message...")
    const initialMessages = screen.getAllByText(
      /Your test results are ready|Thank you, Dr. Smith/i
    )

    fireEvent.change(messageInput, {
      target: { value: "   " },
    })

    fireEvent.submit(messageInput.closest("form")!)

    expect(messageInput).toHaveValue("   ")
    expect(
      screen.getAllByText(
        /Your test results are ready|Thank you, Dr. Smith/i
      )
    ).toHaveLength(initialMessages.length)
  })

  test("returns to Messages when the back button is clicked", () => {
    render(
      <MemoryRouter initialEntries={["/messages/dr-sarah-smith"]}>
        <PortalProvider>
          <Routes>
            <Route
              path="/messages/dr-sarah-smith"
              element={<ConversationRoute />}
            />
            <Route path="/messages" element={<CurrentPath />} />
          </Routes>
        </PortalProvider>
      </MemoryRouter>
    )

    fireEvent.click(
      screen.getByRole("button", { name: /Back to Messages/i })
    )

    expect(screen.getByTestId("current-path")).toHaveTextContent("/messages")
  })
})
