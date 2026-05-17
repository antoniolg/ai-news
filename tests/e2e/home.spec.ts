import { expect, test } from "@playwright/test";

test("renders the scaffold homepage", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByLabel("Cambio de Estado")).toBeVisible();
  await expect(page.getByText(/Actualizado/)).toBeVisible();
  await expect(
    page.getByText("OpenAI unifica ChatGPT, Codex y la API bajo una misma estrategia de producto"),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /Leer fuente/ })).toHaveCount(30);
});

test("filters timeline news from the search input", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Buscar noticias").fill("Codex");

  await expect(page.getByText("Codex CLI introduce objetivos persistentes con /goal")).toBeVisible();
  await expect(page.getByText("OpenAI añade mascotas pixel-art a Codex")).toBeVisible();
  await expect(page.getByText("Codex App suma onboarding, browser mejorado y flujos laterales")).toBeVisible();
  await expect(page.getByText("Cursor abre en beta pública su SDK para agentes")).toBeHidden();
});

test("hides non-matching news inside a partially matching day group", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Buscar noticias").fill("Qwen");

  await expect(page.getByText("Alibaba presenta Qwen3.6-Max-Preview para agentic coding")).toBeVisible();
  await expect(page.getByText("Codex App suma onboarding, browser mejorado y flujos laterales")).toBeHidden();
  await expect(page.getByText("GitHub Copilot pasa a facturación por uso")).toBeHidden();
  await expect(page.getByText("Cursor abre en beta pública su SDK para agentes")).toBeHidden();
  await expect(page.getByText("Compose Performance Skills lleva Agent Skills a Android")).toBeHidden();
  await expect(page.getByText("Stripe lanza infraestructura económica para agentes")).toBeHidden();
  await expect(page.getByText("Anthropic lleva Claude a herramientas creativas")).toBeHidden();
});

test("shows an empty state when search has no matches", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Buscar noticias").fill("noticia inexistente");

  await expect(page.getByText("No hay noticias que coincidan con la búsqueda.")).toBeVisible();
});
