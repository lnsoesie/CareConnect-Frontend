import { render, screen, fireEvent, within } from "@testing-library/react"
import { MedicationsRoute } from "./screens"
import { PortalProvider } from "./store"

describe("CareConnect Medications", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  function renderMedications() {
    return render(
      <PortalProvider>
        <MedicationsRoute />
      </PortalProvider>
    )
  }

  test("displays the patient's medications", () => {
    renderMedications()

    expect(screen.getByText("Lisinopril")).toBeInTheDocument()
    expect(screen.getByText("Metformin")).toBeInTheDocument()
    expect(screen.getByText("Atorvastatin")).toBeInTheDocument()
  })

  test("allows a patient to mark a medication as taken", () => {
    const { container } = renderMedications()

    const metforminRow = Array.from(
      container.querySelectorAll(".medication-row")
    ).find((row) => row.textContent?.includes("Metformin"))

    expect(metforminRow).toBeDefined()

    const statusButton = within(metforminRow as HTMLElement).getByRole(
      "button",
      { name: "Next at 6:00 PM" }
    )

    fireEvent.click(statusButton)

    expect(
      within(metforminRow as HTMLElement).getByRole("button", {
        name: "Taken today",
      })
    ).toBeInTheDocument()

    expect(screen.getByText("2 of 4")).toBeInTheDocument()
  })

  test("opens and closes the Add Medication dialog", () => {
    renderMedications()

    fireEvent.click(
      screen.getByRole("button", { name: /Add medication/i })
    )

    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText("Medication name")).toBeInTheDocument()
    expect(screen.getByText("Dose")).toBeInTheDocument()
    expect(screen.getByText("Frequency")).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole("button", { name: "Cancel" })
    )

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

})
