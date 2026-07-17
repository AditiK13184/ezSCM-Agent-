import { test, expect } from '@playwright/test';

import 'dotenv/config';

const BASE_URL = process.env.BASE_URL!;
const USERNAME = process.env.USERNAME!;
const PASSWORD = process.env.PASSWORD!;

test.describe('Nearer Reorder Level Report', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to the login page and log in
    await page.goto(BASE_URL);
    await page.locator('#email').fill(USERNAME);
    await page.locator('#password').fill(PASSWORD);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/user/lobby');

    // Navigate to the Nearer Reorder Level Report page
    const nearerUrl = BASE_URL.replace(/\/$/, '') + '/user/inventory/nearerReorderReport';
    await page.goto(nearerUrl);
    await page.waitForURL('**/user/inventory/nearerReorderReport');
  });

  test('TC-INV-018 - Verify view structure and empty state when no items are nearing reorder limits', async ({ page }) => {
    // 1. Verify table is absent (since there are no records)
    const table = page.locator('table.advance-table');
    await expect(table).not.toBeVisible();

    // 2. Verify page displays "No Records" message
    const noRecordsMessage = page.locator('body');
    await expect(noRecordsMessage).toContainText('No Records');

    // 3. Verify notification text "Please turn on notification!" is displayed
    await expect(noRecordsMessage).toContainText('Please turn on notification!');
  });
});
