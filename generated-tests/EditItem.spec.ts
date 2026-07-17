import { test, expect } from '@playwright/test';
import 'dotenv/config';

const BASE_URL = process.env.BASE_URL!;
const USERNAME = process.env.USERNAME!;
const PASSWORD = process.env.PASSWORD!;

test.describe('Edit Item', () => {

  test('TC-INV-023 - Verify editing an existing inventory item details', async ({ page }) => {
    // Login and navigate to Items page
    await page.goto(BASE_URL);
    await page.locator('#email').fill(USERNAME);
    await page.locator('#password').fill(PASSWORD);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/user/lobby');

    const itemsUrl = BASE_URL.replace(/\/$/, '') + '/Inventory/Items';
    await page.goto(itemsUrl);
    await page.waitForURL('**/Inventory/Items');

    // Click Edit Item of the first row
    const editIcon = page.locator('table.advance-table tbody tr:first-child td:last-child img[title="Edit Item"]').first();
    await editIcon.click();
    await page.waitForURL('**/inventory/edit');

    // Change Reorder Level and Unit Price
    await page.locator('input[name="reorder_level"]').fill('200');
    await page.locator('input[name="unit_price"]').fill('15.00');

    // Click Update
    await page.locator('button:has-text(/^Update$/)').click();
    await page.waitForTimeout(2000);

    // Verify it redirects back to Items list page
    await page.waitForURL('**/Inventory/Items');
    await expect(page).toHaveURL(/.*Inventory\/Items/);
  });
});
