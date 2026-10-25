import { render, screen, act } from "@testing-library/react"
import { PortalProvider, usePortalState } from "./store"

function StoreProbe() {
  const { takenMedications, toggleMedication } = usePortalState()

  return (
    <div>
      <p data-testid="taken-medications">
        {takenMedications.join(",")}
      </p>
      <button onClick={() => toggleMedication("Metformin")}>
        Toggle Metformin
      </button>
    </div>
  )
}

describe("CareConnect portal store", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test("recovers from invalid saved JSON", () => {
    localStorage.setItem("careconnect.portal-state", "{invalid json")

    render(
      <PortalProvider>
        <StoreProbe />
      </PortalProvider>
    )

    expect(screen.getByTestId("taken-medications")).toHaveTextContent("Lisinopril")
  })

  test("removes a medication when it is already marked as taken", () => {
    localStorage.setItem(
      "careconnect.portal-state",
      JSON.stringify({ takenMedications: ["Metformin"] })
    )

    render(
      <PortalProvider>
        <StoreProbe />
      </PortalProvider>
    )

    expect(screen.getByTestId("taken-medications")).toHaveTextContent("Metformin")

    act(() => {
      screen.getByRole("button", { name: "Toggle Metformin" }).click()
    })

    expect(screen.getByTestId("taken-medications")).toBeEmptyDOMElement()
  })

  test("throws when used outside PortalProvider", () => {
    function InvalidConsumer() {
      usePortalState()
      return null
    }

    expect(() => render(<InvalidConsumer />)).toThrow(
      "usePortalState must be used within PortalProvider"
    )
  })
})
