import { render, screen, fireEvent } from "@testing-library/react"
import { AppointmentsRoute } from "./screens"

describe("CareConnect Appointments", () => {
  test("displays upcoming appointments", () => {
    render(<AppointmentsRoute />)

    expect(
      screen.getByRole("heading", { name: "Appointments" })
    ).toBeInTheDocument()

    expect(
      screen.getByText("Cardiology follow-up")
    ).toBeInTheDocument()

    expect(
      screen.getByText("Physical therapy")
    ).toBeInTheDocument()

    expect(
      screen.getByText("Annual wellness visit")
    ).toBeInTheDocument()
  })

  test("shows an empty state when Past appointments is selected", () => {
    render(<AppointmentsRoute />)

    fireEvent.click(screen.getByRole("tab", { name: "Past" }))

    expect(
      screen.getByText("No past appointments to show.")
    ).toBeInTheDocument()
  })

  test("opens appointment details when an appointment is selected", () => {
    render(<AppointmentsRoute />)

    fireEvent.click(
      screen.getByRole("button", {
        name: "View details for Cardiology follow-up",
      })
    )

    expect(
      screen.getByRole("heading", { name: "Appointment Details" })
    ).toBeInTheDocument()

    expect(
      screen.getByText("Provider:")
    ).toBeInTheDocument()

    expect(
      screen.getByText("Date:")
    ).toBeInTheDocument()
  })


  test("opens and closes the scheduling dialog", () => {
    render(<AppointmentsRoute />)

    fireEvent.click(
      screen.getByRole("button", { name: /Schedule appointment/i })
    )

    expect(
      screen.getByRole("dialog")
    ).toBeInTheDocument()

    expect(
      screen.getByText("Visit type")
    ).toBeInTheDocument()

    expect(
      screen.getByText("Preferred date")
    ).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole("button", { name: "Cancel" })
    )

    expect(
      screen.queryByRole("dialog")
    ).not.toBeInTheDocument()
  })

})
