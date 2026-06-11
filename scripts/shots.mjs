// Captures d'écran de contrôle visuel (mobile).
import { chromium, devices } from "@playwright/test";

const base = "http://localhost:3100";
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices["iPhone 13"] });
const page = await ctx.newPage();

await page.goto(base + "/");
await page.waitForTimeout(900);
await page.screenshot({ path: "shots-home.png" });

await page.goto(base + "/duel");
await page.waitForTimeout(500);
await page.screenshot({ path: "shots-duel-setup.png" });

await page.getByRole("button", { name: /Lancer le duel/ }).click();
await page.waitForTimeout(400);
await page.screenshot({ path: "shots-duel-handoff.png" });
await page.getByRole("button", { name: /C'est parti/ }).click();
await page.waitForTimeout(4200);
await page.screenshot({ path: "shots-duel-play.png" });

await page.goto(base + "/finale");
await page.getByRole("button", { name: /Jouer la finale/ }).click();
await page.getByRole("button", { name: /C'est parti/ }).click();
await page.waitForTimeout(4200);
await page.screenshot({ path: "shots-finale-play.png" });

await browser.close();
console.log("OK");
