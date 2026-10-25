import { test, expect } from "@playwright/test"

test("patient can send a secure message", async ({ page }) => {
  await page.goto("/messages/new")

  await expect(
    page.getByRole("heading", { name: "New Message", level: 1 })
  ).toBeVisible()

  await page.getByPlaceholder("Enter provider name")
    .fill("Dr. Sarah Smith")

  await page.getByPlaceholder("Type your message here")
    .fill("Hello Dr. Smith, I would like to discuss my medications at my next appointment.")

  await page.getByRole("button", { name: /Send Message/i })
    .click()

  await expect(
    page.getByText("Your secure message was sent.")
  ).toBeVisible()

  await expect(page).toHaveURL(/\/messages$/, {
    timeout: 5000,
  })
})
