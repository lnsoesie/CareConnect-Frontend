import { test, expect } from "@playwright/test"

test("CareConnect login page displays correctly", async ({ page }) => {
  await page.goto("/login")

  await expect(
    page.getByRole("heading", { name: "Welcome", exact: true })
  ).toBeVisible()

  await expect(
    page.getByRole("textbox", { name: "Email address" })
  ).toBeVisible()

  await expect(
    page.getByRole("textbox", { name: "Enter your password" })
  ).toBeVisible()

  await expect(
    page.getByRole("button", { name: "Sign in", exact: true })
  ).toBeVisible()
})

test("patient can sign in and reach the dashboard", async ({ page }) => {
  await page.goto("/login")

  await page.getByRole("textbox", { name: "Email address" })
    .fill("patient@example.com")

  await page.getByRole("textbox", { name: "Enter your password" })
    .fill("TestPassword123")

  await page.getByRole("button", { name: "Sign in", exact: true })
    .click()

  await expect(page).toHaveURL("http://localhost:5173/")

  await expect(
    page.getByRole("navigation", { name: "Primary navigation" })
  ).toBeVisible()
})
