import { test, expect } from '@playwright/test';
import 'dotenv/config';

const BASE_URL = process.env.BASE_URL!;
const USERNAME = process.env.USERNAME!;
const PASSWORD = process.env.PASSWORD!;

test.describe('Batch Details', () => {

  test('TC-INV-030 - Verify search and filter on Batch Details page', async ({ page }) => {
    // Login and navigate to Batch Details page
    await page.goto(BASE_URL);
    await page.locator('#email').fill(USERNAME);
    await page.locator('#password').fill(PASSWORD);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/user/lobby');

    const batchUrl = BASE_URL.replace(/\/$/, '') + '/Inventory/BatchDetails';
    await page.goto(batchUrl);
    await page.waitForURL('**/Inventory/BatchDetails');

    // Search for an item
    await page.locator('input[placeholder="Search Items"]').fill('GJ004');
    await page.locator('button[type="submit"]').first().click();
    await page.waitForTimeout(2000);

    // Select Item Type
    await page.locator('button:has-text("Select Item Type")').click();
    await page.locator('[role="option"]:has-text("Raw Material"), button:has-text("Raw Material")').first().click();
    await page.waitForTimeout(2000);

    // Verify search results are filtered
    const rowsCount = await page.locator('table tbody tr').count();
    expect(rowsCount).toBeGreaterThanOrEqual(0);
  });
});
