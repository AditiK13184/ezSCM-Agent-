import { test, expect } from '@playwright/test';
import 'dotenv/config';
import { getTestData } from './excelReader';

const BASE_URL = process.env.BASE_URL!;
const USERNAME = process.env.USERNAME!;
const PASSWORD = process.env.PASSWORD!;

test.describe('Stock Update', () => {
  const testData = getTestData('StockUpdate', [
    'Add Location',
    'Add SKU',
    'Add Quantity',
    'Reduce Location',
    'Reduce SKU',
    'Reduce Quantity'
  ]);

  test.beforeEach(async ({ page }) => {
    // Login and navigate to Stock Update page
    await page.goto(BASE_URL);
    await page.locator('#email').fill(USERNAME);
    await page.locator('#password').fill(PASSWORD);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/user/lobby');

    const stockUrl = BASE_URL.replace(/\/$/, '') + '/Inventory/StockUpdate';
    await page.goto(stockUrl);
    await page.waitForURL('**/Inventory/StockUpdate');
  });

  for (const [index, row] of testData.entries()) {
    test(`TC-INV-026 - Verify manually adding stock for an item - Row ${index + 1}`, async ({ page }) => {
      // Click "Add Stock"
      await page.locator('button:has-text("Add Stock")').click();
      await page.waitForTimeout(500);

      // Select location
      await page.locator('button:has-text("select location")').click();
      await page.waitForTimeout(1000);
      const opt26 = page.locator('[role="option"], button').filter({ hasText: new RegExp(row['Add Location']) }).first();
      if (await opt26.isVisible()) {
        await opt26.click();
      } else {
        await page.locator('[role="option"]').first().click();
      }

      // Enter SKU
      await page.locator('input[placeholder*="Scan barcode or enter SKU"]').fill(row['Add SKU']);
      await page.locator('button:has-text("Scan")').click();
      await page.waitForTimeout(1500);

      // Enter quantity
      await page.locator('input[type="number"]').first().fill(row['Add Quantity']);
      
      // Click Update
      await page.locator('button:has-text(/^Update$/)').click();
      await page.waitForTimeout(2000);

      // Verify stock updates (toast or list refreshes without error)
      const successToast = page.locator('text=/.*success|updated.*/i');
      await expect(successToast.first()).toBeVisible();
    });

    test(`TC-INV-027 - Verify manually reducing stock for an item - Row ${index + 1}`, async ({ page }) => {
      // Click "Reduce Stock"
      await page.locator('button:has-text("Reduce Stock")').click();
      await page.waitForTimeout(500);

      // Select location
      await page.locator('button:has-text("select location")').click();
      await page.waitForTimeout(1000);
      const opt27 = page.locator('[role="option"], button').filter({ hasText: new RegExp(row['Reduce Location']) }).first();
      if (await opt27.isVisible()) {
        await opt27.click();
      } else {
        await page.locator('[role="option"]').first().click();
      }

      // Enter SKU
      await page.locator('input[placeholder*="Scan barcode or enter SKU"]').fill(row['Reduce SKU']);
      await page.locator('button:has-text("Scan")').click();
      await page.waitForTimeout(1500);

      // Enter quantity
      await page.locator('input[type="number"]').first().fill(row['Reduce Quantity']);
      
      // Click Update
      await page.locator('button:has-text(/^Update$/)').click();
      await page.waitForTimeout(2000);

      // Verify stock updates successfully
      const successToast = page.locator('text=/.*success|updated.*/i');
      await expect(successToast.first()).toBeVisible();
    });
  }
});

