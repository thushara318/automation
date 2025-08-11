import { test, expect } from "@playwright/test";
import config from "../config.json";

test("User Journey & PDP Validation", async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', 'WebKit not supported on this system');
  
  await page.goto("https://www.saucedemo.com/", { 
    waitUntil: browserName === 'webkit' ? 'domcontentloaded' : 'load',
    timeout: browserName === 'webkit' ? 45000 : 30000
  });
  
  if (browserName === 'webkit') {
    await page.waitForLoadState('domcontentloaded');
  }

  await page.fill('[data-test="username"]', config.credentials.valid.username);
  await page.fill('[data-test="password"]', config.credentials.valid.password);
  
  await page.click('[data-test="login-button"]');
  
  if (browserName === 'webkit') {
    await page.waitForLoadState('networkidle');
  } else {
    await page.waitForURL("**/inventory.html");
  }
  
  await expect(page).toHaveURL(/.*inventory\.html/);
  
  await expect(page.locator(".inventory_list")).toBeVisible();
  await expect(page.locator(".inventory_item")).toHaveCount(config.testData.products.length);

  const backpackProduct = page
    .locator(".inventory_item")
    .filter({ hasText: "Sauce Labs Backpack" })
    .locator(".inventory_item_name");
  
  await expect(backpackProduct).toBeVisible();
  await backpackProduct.click();
  
  if (browserName === 'webkit') {
    await page.waitForLoadState('domcontentloaded');
  } else {
    await page.waitForLoadState("networkidle");
  }

  await expect(page.locator(".inventory_details_name")).toHaveText("Sauce Labs Backpack");
  
  const addToCartBtn = page.locator('[data-test*="add-to-cart"]').first();
  await expect(addToCartBtn).toBeVisible();
  await expect(addToCartBtn).toBeEnabled();
});
