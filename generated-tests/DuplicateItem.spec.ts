import { test, expect } from '@playwright/test';
import 'dotenv/config';

const BASE_URL = process.env.BASE_URL!;
const USERNAME = process.env.USERNAME!;
const PASSWORD = process.env.PASSWORD!;

test.describe('Duplicate Item', () => {

  test('TC-INV-025 - Verify duplicating an existing item', async ({ page }) => {
    // Login and navigate to Items page
    await page.goto(BASE_URL);
    await page.locator('#email').fill(USERNAME);
    await page.locator('#password').fill(PASSWORD);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/user/lobby');

    const itemsUrl = BASE_URL.replace(/\/$/, '') + '/Inventory/Items';
    await page.goto(itemsUrl);
    await page.waitForURL('**/Inventory/Items');

    // Click Duplicate Item of the first row
    const duplicateIcon = page.locator('table.advance-table tbody tr:first-child td:last-child img[title="Duplicate Item"]').first();
    await duplicateIcon.click();
    await page.waitForTimeout(2000);

    // Verify Add Item modal/form opens with prefilled name
    const itemNameVal = await page.locator('input[name="item_name"]').inputValue();
    expect(itemNameVal.length).toBeGreaterThan(0);
  });
});
