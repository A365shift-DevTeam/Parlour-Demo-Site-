import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());
});

test("a configured look can be saved and reopened", async ({ page }) => {
  await page.goto("/studio");
  await page.getByRole("button", { name: "Add to Look", exact: true }).click();
  await page.getByRole("button", { name: "Save current look" }).click();
  await page.getByLabel("Look name").fill("QA Signature Look");
  await page.getByRole("button", { name: "Save on this device" }).click();
  await page.getByRole("button", { name: "Open saved looks" }).click();

  await expect(page.getByRole("dialog", { name: "Saved looks" })).toBeVisible();
  await expect(page.getByLabel("Rename QA Signature Look")).toHaveValue(
    "QA Signature Look",
  );
  await expect(page.getByRole("button", { name: "Book", exact: true })).toBeVisible();
});

test("complete booking journey reaches confirmation", async ({ page }) => {
  await page.goto("/studio");
  await page.getByRole("button", { name: "Book This", exact: true }).click();

  await expect(page).toHaveURL(/\/booking$/);
  await page.getByRole("button", { name: "Choose Branch" }).click();
  await page
    .getByRole("button", { name: /GV Studio Lavelle Road/ })
    .click();
  await page.getByRole("button", { name: "Choose Specialist" }).click();
  await page
    .getByRole("button", { name: /Any Available Specialist/ })
    .click();
  await page.getByRole("button", { name: "Choose Date" }).click();

  const dateButtons = page.locator(
    'button:not([disabled])',
  ).filter({ has: page.locator("span") });
  const dateCount = await dateButtons.count();
  expect(dateCount).toBeGreaterThan(0);
  await dateButtons.nth(0).click();
  await page.getByRole("button", { name: "10:00 AM", exact: true }).click();
  await page.getByRole("button", { name: "Your Details" }).click();

  await page.getByLabel("Full name").fill("Rohith Newman");
  await page.getByLabel("Mobile number").fill("9876543210");
  await page.getByLabel("Email").fill("qa@example.com");
  await page.getByRole("button", { name: "Review Booking" }).click();
  await page.getByRole("button", { name: "Confirm Appointment" }).click();

  await expect(
    page.getByRole("heading", { name: "Your transformation is booked." }),
  ).toBeVisible();
});

test("AI endpoint limits repeated clients before inference", async ({
  request,
}) => {
  const headers = {
    "x-forwarded-for": "198.51.100.42",
    "content-type": "application/json",
  };
  for (let index = 0; index < 5; index += 1) {
    const response = await request.post("/api/beauty-assistant", {
      headers,
      data: {},
    });
    expect(response.status()).toBe(400);
  }

  const limited = await request.post("/api/beauty-assistant", {
    headers,
    data: {},
  });
  expect(limited.status()).toBe(429);
  expect(limited.headers()["retry-after"]).toBeTruthy();
  await expect(limited.json()).resolves.toMatchObject({
    code: "RATE_LIMITED",
  });
});
