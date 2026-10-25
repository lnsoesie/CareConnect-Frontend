import { test, expect } from "@playwright/test"

test("patient can navigate to appointments", async ({ page }) => {
  await page.goto("/login")

  await page.getByRole("textbox", { name: "Email address" })
    .fill("patient@example.com")

  await page.getByRole("textbox", { name: "Enter your password" })
    .fill("TestPassword123")

  await page.getByRole("button", { name: "Sign in", exact: true })
    .click()

  await expect(page).toHaveURL("/")

  await page.getByRole("navigation", { name: "Primary navigation" })
    .getByRole("button", { name: "Appointments" })
    .click()

  await expect(page).toHaveURL("/appointments")

  await expect(
    page.getByRole("heading", { name: /Appointments/i })
  ).toBeVisible()
})
