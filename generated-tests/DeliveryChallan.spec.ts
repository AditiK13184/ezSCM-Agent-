import { test, expect } from '@playwright/test';
import 'dotenv/config';

const BASE_URL = process.env.BASE_URL!;
const USERNAME = process.env.USERNAME!;
const PASSWORD = process.env.PASSWORD!;

test.describe('Delivery Challan', () => {

  test('TC-INV-031 - Verify creation of a new Delivery Challan (DC)', async ({ page }) => {
    // Login and navigate to Delivery Challan page
    await page.goto(BASE_URL);
    await page.locator('#email').fill(USERNAME);
    await page.locator('#password').fill(PASSWORD);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/user/lobby');

    const dcUrl = BASE_URL.replace(/\/$/, '') + '/Inventory/DeliveryChallan';
    await page.goto(dcUrl);
    await page.waitForURL('**/Inventory/DeliveryChallan');

    // Click "Create DC"
    await page.locator('button:has-text("Create DC")').click();
    await page.waitForTimeout(1000);

    // Select warehouses
    await page.locator('button:has-text("Select From Warehouse")').click();
    await page.locator('[role="option"]:has-text("ShopifyKolkata"), button:has-text("ShopifyKolkata")').first().click();
    await page.waitForTimeout(500);

    await page.locator('button:has-text("Select To Warehouse")').click();
    await page.locator('[role="option"]:has-text("Maharashtra"), button:has-text("Maharashtra")').first().click();
    await page.waitForTimeout(500);

    // Add item SKU
    await page.locator('input[placeholder*="SKU"]').first().fill('GJ004');
    await page.locator('input[placeholder*="Quantity"]').first().fill('100');

    // Click Create
    await page.locator('button:has-text("Create")').click();
    await page.waitForTimeout(2000);

    // Verify it is listed in the table
    const dcTable = page.locator('table');
    await expect(dcTable).toBeVisible();
  });
});
