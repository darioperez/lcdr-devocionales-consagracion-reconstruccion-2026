import { expect, test } from "@playwright/test";

// El servidor de pruebas corre con FAKE_TODAY=2026-09-30:
// día 3 = hoy (abierto), días 4-5 bloqueados, días 1-2 abiertos.

test("la página de inicio carga con su CTA", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Consagración/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Continuar · Día 3/ }),
  ).toBeVisible();
});

test("el plan lista los 5 días con estados correctos", async ({ page }) => {
  await page.goto("/dias");
  await expect(page.getByRole("heading", { name: "Plan" })).toBeVisible();
  await expect(page.locator("ol > li")).toHaveCount(5);
  await expect(page.locator("text=Se desbloquea").first()).toBeVisible();
  await expect(page.locator("a[href='/dias/3']")).toBeVisible();
  await expect(page.locator("a[href='/dias/4']")).toHaveCount(0);
});

test("un día abierto se puede leer y navegar", async ({ page }) => {
  await page.goto("/dias/3");
  await expect(page.getByRole("heading", { name: "Manos que edifican" })).toBeVisible();
  await expect(page.locator("text=El muro se levantó")).toBeVisible();
  await page.click("a[href='/dias/2']");
  await expect(page.getByRole("heading", { name: "Visión que levanta" })).toBeVisible();
});

test("un día bloqueado devuelve la página de paciencia", async ({ page }) => {
  const res = await page.goto("/dias/4");
  expect(res?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "Este día aún no está disponible" }),
  ).toBeVisible();
  await expect(page.locator("text=Se desbloquea el jueves")).toBeVisible();
});

test("un día fuera de rango devuelve 404", async ({ page }) => {
  const res = await page.goto("/dias/9");
  expect(res?.status()).toBe(404);
});

test("el toggle de tema cambia entre sistema, claro y oscuro", async ({
  page,
}) => {
  await page.goto("/");
  const toggle = page.locator("button[aria-label*='Tema']");
  await toggle.click();
  await expect(page.locator("html")).toHaveClass(/light/);
  await toggle.click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await toggle.click();
  await expect(page.locator("html")).not.toHaveClass(/(?:^| )dark/);
  await expect(page.locator("html")).not.toHaveClass(/(?:^| )light/);
});

test("la navegación del header y el logo van a inicio", async ({ page }) => {
  await page.goto("/dias");
  await page.click("header a[href='/']");
  await expect(page).toHaveURL(/\/$/);
});

test("el botón de compartir muestra el hook del día", async ({ page }) => {
  await page.goto("/dias/3");
  await expect(page.getByRole("button", { name: /Compartir/ })).toBeVisible();
});

test("marcar como completado persiste y muestra la insignia en la lista", async ({
  page,
}) => {
  await page.goto("/dias/3");
  await page.click("button:has-text('Marcar como completado')");
  await expect(page.getByRole("button", { name: /Completado/ })).toBeVisible();

  await page.goto("/dias");
  const card = page.locator("li", { has: page.locator("a[href='/dias/3']") });
  await expect(
    card.locator("[aria-label='Devocional completado']"),
  ).toBeVisible();

  await page.reload();
  await expect(
    card.locator("[aria-label='Devocional completado']"),
  ).toBeVisible();
});

test("el contador de progreso aparece en la portada", async ({ page }) => {
  await page.goto("/dias/3");
  await page.click("button:has-text('Marcar como completado')");
  await expect(page.getByRole("button", { name: /Completado/ })).toBeVisible();

  await page.goto("/");
  await expect(page.locator("text=Has completado 1 de 5")).toBeVisible();
});
