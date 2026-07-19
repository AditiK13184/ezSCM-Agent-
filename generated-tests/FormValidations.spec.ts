import { test, expect } from '@playwright/test';
import 'dotenv/config';
import { getTestData } from './excelReader';

const BASE_URL = process.env.BASE_URL!;
const USERNAME = process.env.USERNAME!;
const PASSWORD = process.env.PASSWORD!;

test.describe('Form validations', () => {
  const testData = getTestData('FormValidations', [
    'Duplicate SKU',
    'Duplicate Item Name',
    'Duplicate Master SKU',
    'Duplicate Item Type',
    'Reduce Location',
    'Reduce SKU',
    'Reduce Quantity'
  ]);

  for (const [index, row] of testData.entries()) {
    test(`TC-INV-022 - Verify validation on Add Item form for duplicate SKU - Row ${index + 1}`, async ({ page }) => {
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
      await page.locator('input[name="sku"]').fill(row['Duplicate SKU']);
      await page.locator('input[name="item_name"]').fill(row['Duplicate Item Name']);
      await page.locator('input[name="master_sku"]').fill(row['Duplicate Master SKU']);
      
      // Select Item Type
      await page.locator('button:has-text("Select Item Type")').first().click();
      await page.locator(`[role="option"]:has-text("${row['Duplicate Item Type']}"), button:has-text("${row['Duplicate Item Type']}")`).first().click();

      // Click Add
      await page.locator('button:has-text(/^Add$/)').first().click();
      await page.waitForTimeout(500);

      // Click Save Items
      await page.locator('button:has-text("Save Items")').click();
      await page.waitForTimeout(1000);

      // Assert that an error alert / banner appears, or validation prevents completion
      const errorMsg = page.locator('text=/.*exists.*/i');
      await expect(errorMsg.first()).toBeVisible();
    });

    test(`TC-INV-028 - Verify validation on reducing stock below zero - Row ${index + 1}`, async ({ page }) => {
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
      await page.locator(`[role="option"]:has-text("${row['Reduce Location']}"), button:has-text("${row['Reduce Location']}")`).first().click();

      // Enter SKU
      await page.locator('input[placeholder*="Scan barcode or enter SKU"]').fill(row['Reduce SKU']);
      await page.locator('button:has-text("Scan")').click();
      await page.waitForTimeout(1500);

      // Enter large quantity to trigger reduction below zero validation
      await page.locator('input[name="quantity"], input[type="number"]').fill(row['Reduce Quantity']);
      await page.locator('button:has-text(/^Update$/)').click();

      // Verify warning message is displayed
      const warningMsg = page.locator('text=/.*cannot exceed|invalid|insufficient|below zero.*/i');
      await expect(warningMsg.first()).toBeVisible();
    });
  }
});

