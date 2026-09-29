import { expect, test } from "@playwright/test";

// Este proyecto corre con FAKE_TODAY=2026-10-06 (posterior a acceso_hasta):
// el plan debe aparecer bloqueado con el mensaje de despedida.

test("la portada muestra el mensaje de fin del plan", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("text=El plan ha terminado").first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Continuar/ })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Suscribirme/ })).toHaveCount(0);
});

test("la lista del plan está bloqueada", async ({ page }) => {
  await page.goto("/dias");
  await expect(
    page.getByRole("heading", { name: "El plan ha terminado" }),
  ).toBeVisible();
  await expect(page.locator("ol > li")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Suscribirme/ })).toHaveCount(0);
});

test("los días devuelven 404 con el mensaje de despedida", async ({ page }) => {
  const res = await page.goto("/dias/1");
  expect(res?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "El plan ha terminado" }),
  ).toBeVisible();
  await expect(page.locator("text=¡mantente atento!")).toBeVisible();
});
