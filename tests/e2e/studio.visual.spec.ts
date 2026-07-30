import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());
});

test("representative avatar layers remain aligned", async ({ page }) => {
  await page.goto("/studio");

  await page
    .getByRole("button", { name: "Use deep skin tone" })
    .click();
  await page.getByLabel("Face shape").selectOption("Square");
  await page.getByRole("button", { name: "Sleek Bob", exact: true }).click();
  await page.getByRole("button", { name: "Burgundy", exact: true }).click();
  await page.getByRole("button", { name: "Pearl Pins", exact: true }).click();
  await page.getByLabel("Makeup finish").selectOption("Bridal");

  const avatar = page.getByTestId("common-avatar");
  await expect(avatar).toHaveCount(1);
  await expect(avatar).toHaveScreenshot(
    "deep-sleek-bob-burgundy-bridal.png",
    {
      animations: "disabled",
      maxDiffPixelRatio: 0.015,
    },
  );

  await page.getByLabel("Makeup finish").selectOption("Bare");
  await expect(avatar).toHaveScreenshot("deep-sleek-bob-burgundy-bare.png", {
    animations: "disabled",
    maxDiffPixelRatio: 0.015,
  });

  await page.getByRole("button", { name: "Espresso", exact: true }).click();
  await page.getByLabel("Makeup finish").selectOption("Bare");
  await expect(avatar).toHaveScreenshot("deep-sleek-bob-espresso-bare.png", {
    animations: "disabled",
    maxDiffPixelRatio: 0.015,
  });

  await page
    .getByRole("button", { name: "Use light skin tone" })
    .click();
  await page.getByRole("button", { name: "Soft Curls", exact: true }).click();
  await page
    .getByRole("button", { name: "Caramel Balayage", exact: true })
    .click();
  await page.getByRole("button", { name: "Pearl Pins", exact: true }).click();
  await page.getByLabel("Makeup finish").selectOption("Soft Glam");

  await expect(avatar).toHaveScreenshot(
    "light-soft-curls-caramel-soft-glam.png",
    {
      animations: "disabled",
      maxDiffPixelRatio: 0.015,
    },
  );
});

test("mobile studio has no horizontal overflow or overlapping preview actions", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/studio");

  await expect
    .poll(() =>
      page.evaluate(() => ({
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
      })),
    )
    .toEqual({ documentWidth: 375, viewportWidth: 375 });

  const avatar = page.getByTestId("common-avatar");
  await avatar.scrollIntoViewIfNeeded();
  await expect(avatar).toHaveScreenshot("mobile-avatar-preview.png", {
    animations: "disabled",
    maxDiffPixelRatio: 0.015,
  });

  await expect(page.getByRole("button", { name: "Book Now", exact: true })).toBeVisible();
});
