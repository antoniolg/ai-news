import { expect, test } from "@playwright/test";

test("renders the scaffold homepage", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByLabel("Cambio de Estado")).toBeVisible();
  await expect(page.getByText(/Actualizado/)).toBeVisible();
  await expect(page.getByText("OpenAI actualiza sus herramientas para agentes")).toBeVisible();
  await expect(page.getByRole("link", { name: /Leer fuente/ })).toHaveCount(6);
});

test("filters timeline news from the search input", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Buscar noticias").fill("VS Code");

  await expect(page.getByText("Nuevas integraciones de VS Code con IA")).toBeVisible();
  await expect(page.getByText("OpenAI actualiza sus herramientas para agentes")).toBeHidden();
});

test("hides non-matching news inside a partially matching day group", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Buscar noticias").fill("OpenAI");

  await expect(page.getByText("OpenAI actualiza sus herramientas para agentes")).toBeVisible();
  await expect(page.getByText("OpenAI lanza soporte nativo para archivos grandes")).toBeVisible();
  await expect(page.getByText("Anthropic publica mejoras en Claude Code")).toBeHidden();
  await expect(page.getByText("Anthropic mejora la seguridad en Claude")).toBeHidden();
});

test("shows an empty state when search has no matches", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Buscar noticias").fill("noticia inexistente");

  await expect(page.getByText("No hay noticias que coincidan con la búsqueda.")).toBeVisible();
});
