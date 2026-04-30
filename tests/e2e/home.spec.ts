import { expect, test } from "@playwright/test";

test("renders the scaffold homepage", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Hola mundo" })).toBeVisible();
});
