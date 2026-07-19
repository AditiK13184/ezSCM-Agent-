import { test, expect } from '@playwright/test';
import 'dotenv/config';
import { getTestData } from './excelReader';

const BASE_URL = process.env.BASE_URL!;
const USERNAME = process.env.USERNAME!;
const PASSWORD = process.env.PASSWORD!;

test.describe('Add Item', () => {
  const testData = getTestData('AddItem', [
    'Item Name',
    'Master SKU',
    'SKU',
    'HSN Code',
    'UoM',
    'Tax Percentage',
    'Expiry Days',
    'Batch Code Prefix',
    'Item Type'
  ]);

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

  for (const [index, row] of testData.entries()) {
    test(`TC-INV-021 - Verify creation of a new inventory item with valid details - Row ${index + 1}`, async ({ page }) => {
      // Click "Add Items" to open the form
      await page.locator('button', { hasText: 'Add Items' }).click();
      await page.waitForTimeout(1000);

      // Fill in the form fields. Since input IDs have dynamic suffixes, we locate them by name or label prefix.
      await page.locator('input[name="item_name"]').fill(row['Item Name']);
      await page.locator('input[name="master_sku"]').fill(row['Master SKU']);
      await page.locator('input[name="sku"]').fill(row['SKU']);
      await page.locator('input[name="hsnCode"]').fill(row['HSN Code']);
      await page.locator('input[placeholder="UoM"]').fill(row['UoM']);
      await page.locator('input[name="tax_percentage"]').fill(row['Tax Percentage']);
      await page.locator('input[name="expiry_days"]').fill(row['Expiry Days']);
      await page.locator('input[name="batch_code"]').fill(row['Batch Code Prefix']);

      // Select Item Type
      await page.locator('button:has-text("Select Item Type")').first().click();
      await page.locator(`[role="option"]:has-text("${row['Item Type']}"), button:has-text("${row['Item Type']}")`).first().click();

      // Click Add button
      await page.locator('button:has-text(/^Add$/)').first().click();
      await page.waitForTimeout(500);

      // Click Save Items button
      await page.locator('button:has-text("Save Items")').click();
      await page.waitForTimeout(2000);

      // Verify item is created successfully and appears in the Items list table
      const newItemRow = page.locator('table.advance-table tbody tr', { hasText: row['Item Name'] });
      await expect(newItemRow).toBeVisible();
    });
  }
});

