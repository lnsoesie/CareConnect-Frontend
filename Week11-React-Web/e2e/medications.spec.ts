import { test, expect } from "@playwright/test"

test("patient can mark a medication as taken", async ({ page }) => {
  await page.goto("/medications")

  await expect(
    page.getByRole("heading", { name: "Medications", level: 1 })
  ).toBeVisible()

  const metformin = page
    .locator(".medication-row")
    .filter({ hasText: "Metformin" })

  const statusButton = metformin.getByRole("button", {
    name: "Next at 6:00 PM",
  })

  await expect(statusButton).toBeVisible()

  await statusButton.click()

  await expect(
    metformin.getByRole("button", { name: "Taken today" })
  ).toBeVisible()

  await expect(
    page.getByText("2 of 4")
  ).toBeVisible()
})
