import { test, expect } from '@playwright/test';
import 'dotenv/config';

const BASE_URL = process.env.BASE_URL!;
const USERNAME = process.env.USERNAME!;
const PASSWORD = process.env.PASSWORD!;

test.describe('Form validations', () => {

  test('TC-INV-022 - Verify validation on Add Item form for duplicate SKU', async ({ page }) => {
    // Login and navigate to Items page
    await page.goto(BASE_URL);
    await page.locator('#email').fill(USERNAME);
    await page.locator('#password').fill(PASSWORD);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/user/lobby');

    const itemsUrl = BASE_URL.replace(/\/$/, '') + '/Inventory/Items';
    await page.goto(itemsUrl);
    await page.waitForURL('**/Inventory/Items');

    // Click "Add Items"
    await page.locator('button', { hasText: 'Add Items' }).click();
    await page.waitForTimeout(1000);

    // Fill in existing SKU
    await page.locator('input[name="sku"]').fill('GJ004');
    await page.locator('input[name="item_name"]').fill('Duplicate Item Test');
    await page.locator('input[name="master_sku"]').fill('GJ004');
    
    // Select Item Type
    await page.locator('button:has-text("Select Item Type")').first().click();
    await page.locator('[role="option"]:has-text("Raw Material"), button:has-text("Raw Material")').first().click();

    // Click Add
    await page.locator('button:has-text(/^Add$/)').first().click();
    await page.waitForTimeout(500);

    // Click Save Items
    await page.locator('button:has-text("Save Items")').click();
    await page.waitForTimeout(1000);

    // Assert that an error alert / banner appears, or validation prevents completion
    // The standard toast alert or inline validation error is expected. We look for common error element or text
    const errorMsg = page.locator('text=/.*exists.*/i');
    await expect(errorMsg.first()).toBeVisible();
  });

  test('TC-INV-028 - Verify validation on reducing stock below zero', async ({ page }) => {
    // Login and navigate to Stock Update page
    await page.goto(BASE_URL);
    await page.locator('#email').fill(USERNAME);
    await page.locator('#password').fill(PASSWORD);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/user/lobby');

    const stockUrl = BASE_URL.replace(/\/$/, '') + '/Inventory/StockUpdate';
    await page.goto(stockUrl);
    await page.waitForURL('**/Inventory/StockUpdate');

    // Click "Reduce Stock"
    await page.locator('button:has-text("Reduce Stock")').click();
    await page.waitForTimeout(500);

    // Select location
    await page.locator('button:has-text("select location")').click();
    await page.locator('[role="option"]:has-text("ShopifyKolkata"), button:has-text("ShopifyKolkata")').first().click();

    // Enter SKU
    await page.locator('input[placeholder*="Scan barcode or enter SKU"]').fill('GJ001');
    await page.locator('button:has-text("Scan")').click();
    await page.waitForTimeout(1500);

    // Enter large quantity to trigger reduction below zero validation
    await page.locator('input[name="quantity"], input[type="number"]').fill('100000');
    await page.locator('button:has-text(/^Update$/)').click();

    // Verify warning message is displayed
    const warningMsg = page.locator('text=/.*cannot exceed|invalid|insufficient|below zero.*/i');
    await expect(warningMsg.first()).toBeVisible();
  });
});
