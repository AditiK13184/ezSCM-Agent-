import { test, expect } from '@playwright/test';

import 'dotenv/config';

const BASE_URL = process.env.BASE_URL!;
const USERNAME = process.env.USERNAME!;
const PASSWORD = process.env.PASSWORD!;

test.describe('Reorder Level Report', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to the login page and log in
    await page.goto(BASE_URL);
    await page.locator('#email').fill(USERNAME);
    await page.locator('#password').fill(PASSWORD);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/user/lobby');

    // Navigate to the Reorder Level Report page
    const reorderUrl = BASE_URL.replace(/\/$/, '') + '/user/inventory/reorderLevelReport';
    await page.goto(reorderUrl);
    await page.waitForURL('**/user/inventory/reorderLevelReport');
    // Wait for the table to load
    await page.waitForSelector('table.advance-table');
  });

  test('TC-INV-016 - Verify Reorder Level Report view structure and defaults', async ({ page }) => {
    // 1. Verify headers
    const headers = page.locator('table.advance-table th');
    const headerTexts = await headers.allInnerTexts();
    expect(headerTexts.map(t => t.trim())).toEqual([
      'NAME', 'MASTER SKU', 'SKU', 'WAREHOUSE', 'REORDER LEVEL', 'QUANTITY'
    ]);

    // 2. Verify warehouse indicator defaults to an option like ShopifyKolkata or other active warehouse combobox
    // It should be visible
    const warehouseCombobox = page.locator('[role="combobox"]');
    await expect(warehouseCombobox).toBeVisible();
    const currentWarehouseText = await warehouseCombobox.innerText();
    expect(currentWarehouseText.length).toBeGreaterThan(0);
  });

  test('TC-INV-017 - Verify Download Reorder Level Report', async ({ page }) => {
    // Start waiting for download before clicking
    const downloadPromise = page.waitForEvent('download');
    await page.locator('button[title="Download Reorder Level Report"]').click();
    const download = await downloadPromise;

    // Verify download occurs and suggested filename
    expect(download.suggestedFilename()).not.toBeNull();
  });
});
