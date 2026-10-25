import { render, screen, fireEvent } from "@testing-library/react"
import { SettingsRoute } from "./screens"
import { PortalProvider } from "./store"

describe("CareConnect Settings", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  function renderSettings() {
    return render(
      <PortalProvider>
        <SettingsRoute />
      </PortalProvider>
    )
  }

  test("displays notification and security settings", () => {
    renderSettings()

    expect(
      screen.getByRole("heading", { name: "Settings" })
    ).toBeInTheDocument()

    expect(screen.getByText("Email reminders")).toBeInTheDocument()
    expect(screen.getByText("SMS reminders")).toBeInTheDocument()
    expect(screen.getByText("Two-factor authentication")).toBeInTheDocument()
  })

  test("allows patients to change notification preferences", () => {
    renderSettings()

    const emailCheckbox = screen.getByRole("checkbox", {
      name: /Email reminders/i,
    })

    const smsCheckbox = screen.getByRole("checkbox", {
      name: /SMS reminders/i,
    })

    expect(emailCheckbox).toBeChecked()
    expect(smsCheckbox).not.toBeChecked()

    fireEvent.click(emailCheckbox)
    fireEvent.click(smsCheckbox)

    expect(emailCheckbox).not.toBeChecked()
    expect(smsCheckbox).toBeChecked()
  })

  test("opens and closes the Change Password dialog", () => {
    renderSettings()

    fireEvent.click(
      screen.getByRole("button", { name: "Change password" })
    )

    expect(screen.getByRole("dialog")).toBeInTheDocument()

    expect(
      screen.getByPlaceholderText("Enter current password")
    ).toBeInTheDocument()

    expect(
      screen.getByPlaceholderText("Enter new password")
    ).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole("button", { name: "Cancel" })
    )

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  test("closes the Change Password dialog after valid form submission", () => {
    renderSettings()

    fireEvent.click(
      screen.getByRole("button", { name: "Change password" })
    )

    fireEvent.change(screen.getByPlaceholderText("Enter current password"), {
      target: { value: "current123" },
    })
    fireEvent.change(screen.getByPlaceholderText("Enter new password"), {
      target: { value: "newpassword123" },
    })
    fireEvent.change(screen.getByPlaceholderText("Re-enter new password"), {
      target: { value: "newpassword123" },
    })

    fireEvent.click(
      screen.getByRole("button", { name: "Update password" })
    )

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })


  test("closes the Change Password dialog when Escape is pressed", () => {
    renderSettings()

    fireEvent.click(
      screen.getByRole("button", { name: "Change password" })
    )

    expect(screen.getByRole("dialog")).toBeInTheDocument()

    fireEvent.keyDown(document, { key: "Escape" })

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

})
