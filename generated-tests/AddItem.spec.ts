import { test, expect } from '@playwright/test';
import 'dotenv/config';

const BASE_URL = process.env.BASE_URL!;
const USERNAME = process.env.USERNAME!;
const PASSWORD = process.env.PASSWORD!;

test.describe('Add Item', () => {

  test.beforeEach(async ({ page }) => {
    // Login and navigate to Items page
    await page.goto(BASE_URL);
    await page.locator('#email').fill(USERNAME);
    await page.locator('#password').fill(PASSWORD);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/user/lobby');

    const itemsUrl = BASE_URL.replace(/\/$/, '') + '/Inventory/Items';
    await page.goto(itemsUrl);
    await page.waitForURL('**/Inventory/Items');
    await page.waitForSelector('table.advance-table');
  });

  test('TC-INV-021 - Verify creation of a new inventory item with valid details', async ({ page }) => {
    // Click "Add Items" to open the form
    await page.locator('button', { hasText: 'Add Items' }).click();
    await page.waitForTimeout(1000);

    // Fill in the form fields. Since input IDs have dynamic suffixes, we locate them by name or label prefix.
    await page.locator('input[name="item_name"]').fill('Test Item');
    await page.locator('input[name="master_sku"]').fill('TS-001');
    await page.locator('input[name="sku"]').fill('TS-001');
    await page.locator('input[name="hsnCode"]').fill('1234');
    await page.locator('input[placeholder="UoM"]').fill('nos');
    await page.locator('input[name="tax_percentage"]').fill('18');
    await page.locator('input[name="expiry_days"]').fill('30');
    await page.locator('input[name="batch_code"]').fill('B-');

    // Select Item Type
    await page.locator('button:has-text("Select Item Type")').first().click();
    await page.locator('[role="option"]:has-text("Raw Material"), button:has-text("Raw Material")').first().click();

    // Click Add button
    await page.locator('button:has-text(/^Add$/)').first().click();
    await page.waitForTimeout(500);

    // Click Save Items button
    await page.locator('button:has-text("Save Items")').click();
    await page.waitForTimeout(2000);

    // Verify item is created successfully and appears in the Items list table
    const newItemRow = page.locator('table.advance-table tbody tr', { hasText: 'Test Item' });
    await expect(newItemRow).toBeVisible();
  });
});
