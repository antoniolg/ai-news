import { expect, test } from "@playwright/test";

test("renders the scaffold homepage", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByLabel("Cambio de Estado")).toBeVisible();
  await expect(page.getByText(/Actualizado/)).toBeVisible();
  await expect(page.getByText("Cursor abre en beta publica su SDK para agentes")).toBeVisible();
  await expect(page.getByRole("link", { name: /Leer fuente/ })).toHaveCount(4);
});

test("filters timeline news from the search input", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Buscar noticias").fill("Stripe");

  await expect(page.getByText("Stripe lanza infraestructura economica para agentes")).toBeVisible();
  await expect(page.getByText("Cursor abre en beta publica su SDK para agentes")).toBeHidden();
});

test("hides non-matching news inside a partially matching day group", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Buscar noticias").fill("Cursor");

  await expect(page.getByText("Cursor abre en beta publica su SDK para agentes")).toBeVisible();
  await expect(page.getByText("Stripe lanza infraestructura economica para agentes")).toBeHidden();
  await expect(page.getByText("Anthropic lleva Claude a herramientas creativas")).toBeHidden();
  await expect(page.getByText("GitHub Copilot pasa a facturacion por uso")).toBeHidden();
});

test("shows an empty state when search has no matches", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Buscar noticias").fill("noticia inexistente");

  await expect(page.getByText("No hay noticias que coincidan con la búsqueda.")).toBeVisible();
});
