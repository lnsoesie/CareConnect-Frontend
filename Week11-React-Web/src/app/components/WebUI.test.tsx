import { render, screen, fireEvent } from "@testing-library/react"
import { Tooltip, Dropdown, Modal } from "./WebUI"

describe("CareConnect shared UI components", () => {
  test("displays tooltip information", () => {
    render(
      <Tooltip label="Additional information">
        <button>Help</button>
      </Tooltip>
    )

    expect(screen.getByRole("tooltip")).toHaveTextContent(
      "Additional information"
    )
  })

  test("opens dropdown and selects an item", () => {
    const onSelect = jest.fn()

    render(
      <Dropdown
        trigger={({ expanded, onClick }) => (
          <button aria-expanded={expanded} onClick={onClick}>
            Options
          </button>
        )}
        items={[
          { label: "View profile", onSelect },
        ]}
      />
    )

    expect(screen.queryByRole("menu")).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Options" }))

    expect(screen.getByRole("menu")).toBeInTheDocument()

    fireEvent.click(screen.getByRole("menuitem", {
      name: "View profile",
    }))

    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole("menu")).not.toBeInTheDocument()
  })

  test("closes dropdown when Escape is pressed", () => {
    render(
      <Dropdown
        trigger={({ onClick }) => (
          <button onClick={onClick}>Options</button>
        )}
        items={[{ label: "Settings", onSelect: jest.fn() }]}
      />
    )

    fireEvent.click(screen.getByRole("button", { name: "Options" }))

    expect(screen.getByRole("menu")).toBeInTheDocument()

    fireEvent.keyDown(document, { key: "Escape" })

    expect(screen.queryByRole("menu")).not.toBeInTheDocument()
  })

  test("closes modal when Escape is pressed", () => {
    const onClose = jest.fn()

    render(
      <Modal
        open={true}
        title="Test Dialog"
        description="Dialog description"
        onClose={onClose}
      >
        <p>Dialog content</p>
      </Modal>
    )

    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText("Dialog content")).toBeInTheDocument()

    fireEvent.keyDown(document, { key: "Escape" })

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
