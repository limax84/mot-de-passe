import { test, expect, type Page } from "@playwright/test";

test.describe("Accueil", () => {
  test("affiche le logo et les modes de jeu", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Mot de passe/);
    await expect(page.getByText("MOT DE", { exact: true })).toBeVisible();
    await expect(page.getByText("PASSE", { exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: /LE DUEL/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /LA FINALE/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Règles du jeu/ })).toBeVisible();
  });
});

test.describe("Règles", () => {
  test("liste les interdits et les modes", async ({ page }) => {
    await page.goto("/regles");
    await expect(page.getByText("LES INTERDITS")).toBeVisible();
    await expect(page.getByText(/même famille/)).toBeVisible();
    await expect(page.getByText("LE DUEL", { exact: true })).toBeVisible();
    await expect(page.getByText("LA FINALE").first()).toBeVisible();
  });
});

test.describe("PWA", () => {
  test("expose le manifest et le service worker", async ({ page, request }) => {
    await page.goto("/");
    await expect(page.locator('link[rel="manifest"]')).toHaveAttribute(
      "href",
      "/manifest.webmanifest"
    );
    const manifest = await request.get("/manifest.webmanifest");
    expect(manifest.ok()).toBeTruthy();
    expect((await manifest.json()).short_name).toBe("Mot de passe");
    const sw = await request.get("/sw.js");
    expect(sw.ok()).toBeTruthy();
  });
});

/** Passe l'écran de passage de téléphone + le compte à rebours 3-2-1. */
async function passHandoffAndCountdown(page: Page) {
  await page.getByRole("button", { name: /C'est parti/ }).click();
  await expect(page.getByTestId("mot-mystere")).toBeVisible({ timeout: 8000 });
}

test.describe("Le Duel", () => {
  test("une partie complète en 1 manche par équipe", async ({ page }) => {
    await page.goto("/duel");

    // Configuration : 1 manche par équipe
    await expect(page.getByText("LES ÉQUIPES")).toBeVisible();
    await page.getByRole("button", { name: "1", exact: true }).click();
    await page.getByRole("button", { name: /Lancer le duel/ }).click();

    // Manche 1 — Équipe Bleue trouve les 5 mots
    await expect(page.getByText("Manche 1 / 2")).toBeVisible();
    await expect(page.getByText("Équipe Bleue").first()).toBeVisible();
    await passHandoffAndCountdown(page);
    for (let i = 0; i < 5; i++) {
      await page.getByRole("button", { name: /Trouvé/ }).click();
    }
    await expect(page.getByText("FIN DE MANCHE")).toBeVisible();
    await expect(page.getByText(/\+5 points/)).toBeVisible();
    await expect(page.getByTestId("score-0")).toHaveText("5");

    // Manche 2 — Équipe Or passe les 5 mots
    await page.getByRole("button", { name: /Manche suivante/ }).click();
    await expect(page.getByText("Manche 2 / 2")).toBeVisible();
    await passHandoffAndCountdown(page);
    for (let i = 0; i < 5; i++) {
      await page.getByRole("button", { name: /Passer/ }).click();
    }
    await expect(page.getByText("FIN DE MANCHE")).toBeVisible();
    await expect(page.getByTestId("score-1")).toHaveText("0");

    // Résultats
    await page.getByRole("button", { name: /Voir le résultat/ }).click();
    await expect(page.getByText("Vainqueur du duel")).toBeVisible();
    await expect(page.getByText(/Équipe Bleue/).last()).toBeVisible();
  });

  test("le chrono met fin à la manche", async ({ page }) => {
    test.slow();
    await page.goto("/duel");
    await page.getByRole("button", { name: "1", exact: true }).click();
    await page.getByRole("button", { name: /Lancer le duel/ }).click();
    await passHandoffAndCountdown(page);
    // On laisse filer les 30 secondes sans jouer.
    await expect(page.getByText("FIN DE MANCHE")).toBeVisible({ timeout: 40_000 });
    await expect(page.getByText(/\+0 point/)).toBeVisible();
  });
});

test.describe("La Finale", () => {
  test("5 mots trouvés : la mise est doublée", async ({ page }) => {
    await page.goto("/finale");
    await expect(page.getByText("VOTRE MISE")).toBeVisible();

    // Mise par défaut : 1000 € → 2000 €
    await page.getByRole("button", { name: /Jouer la finale/ }).click();
    await expect(page.getByText("EN JEU")).toBeVisible();
    await passHandoffAndCountdown(page);

    for (let i = 0; i < 5; i++) {
      await expect(page.getByText(`Mot ${i + 1} / 5`)).toBeVisible();
      await page.getByRole("button", { name: /Trouvé/ }).click();
    }
    await expect(page.getByTestId("gain")).toHaveText("2000€");
    await expect(page.getByText(/Sans faute/)).toBeVisible();
  });

  test("le compteur d'indices se bloque à 3", async ({ page }) => {
    await page.goto("/finale");
    await page.getByRole("button", { name: /Jouer la finale/ }).click();
    await passHandoffAndCountdown(page);

    const clueButton = page.getByRole("button", { name: /Indice donné/ });
    await clueButton.click();
    await clueButton.click();
    await clueButton.click();
    await expect(clueButton).toBeDisabled();
    await expect(page.getByText("Plus d'indices !")).toBeVisible();

    // Moins de 3 mots trouvés : tout est perdu
    for (let i = 0; i < 5; i++) {
      await page.getByRole("button", { name: /Passer/ }).click();
    }
    await expect(page.getByTestId("gain")).toHaveText("PERDU…");
  });
});
