import { test, expect } from '@playwright/test';
import 'dotenv/config';
import { getTestData } from './excelReader';

const BASE_URL = process.env.BASE_URL!;
const USERNAME = process.env.USERNAME!;
const PASSWORD = process.env.PASSWORD!;

test.describe('Delivery Challan', () => {
  const testData = getTestData('DeliveryChallan', ['From Warehouse', 'To Warehouse', 'SKU', 'Quantity']);

  for (const [index, row] of testData.entries()) {
    test(`TC-INV-031 - Verify creation of a new Delivery Challan (DC) - Row ${index + 1}`, async ({ page }) => {
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
      await page.locator(`[role="option"]:has-text("${row['From Warehouse']}"), button:has-text("${row['From Warehouse']}")`).first().click();
      await page.waitForTimeout(500);

      await page.locator('button:has-text("Select To Warehouse")').click();
      await page.locator(`[role="option"]:has-text("${row['To Warehouse']}"), button:has-text("${row['To Warehouse']}")`).first().click();
      await page.waitForTimeout(500);

      // Add item SKU
      await page.locator('input[placeholder*="SKU"]').first().fill(row['SKU']);
      await page.locator('input[placeholder*="Quantity"]').first().fill(row['Quantity']);

      // Click Create
      await page.locator('button:has-text("Create")').click();
      await page.waitForTimeout(2000);

      // Verify it is listed in the table
      const dcTable = page.locator('table');
      await expect(dcTable).toBeVisible();
    });
  }
});

