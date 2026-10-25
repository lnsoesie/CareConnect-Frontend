import { render, screen, fireEvent } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { ConversationRoute } from "./screens"
import { PortalProvider } from "./store"

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
})
