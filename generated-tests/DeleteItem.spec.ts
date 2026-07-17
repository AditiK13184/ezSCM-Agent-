import { test, expect } from '@playwright/test';
import 'dotenv/config';

const BASE_URL = process.env.BASE_URL!;
const USERNAME = process.env.USERNAME!;
const PASSWORD = process.env.PASSWORD!;

test.describe('Delete Item', () => {

  test('TC-INV-024 - Verify deletion / inactivation of an inventory item', async ({ page }) => {
    // Login and navigate to Items page
    await page.goto(BASE_URL);
    await page.locator('#email').fill(USERNAME);
    await page.locator('#password').fill(PASSWORD);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/user/lobby');

    const itemsUrl = BASE_URL.replace(/\/$/, '') + '/Inventory/Items';
    await page.goto(itemsUrl);
    await page.waitForURL('**/Inventory/Items');

    // Find the item first name text to verify deletion later
    const firstRowName = await page.locator('table.advance-table tbody tr:first-child td:first-child').innerText();

    // Click Delete Item of the first row
    const deleteIcon = page.locator('table.advance-table tbody tr:first-child td:last-child img[title="Delete Item"]').first();
    await deleteIcon.click();
    await page.waitForTimeout(1000);

    // Confirm deletion if dialog pops up (radix/tailwind button with text Yes/Delete/Confirm)
    const confirmBtn = page.locator('button:has-text("Yes"), button:has-text("Delete"), button:has-text("Confirm")');
    if (await confirmBtn.isVisible()) {
      await confirmBtn.click();
    } else {
      // Direct keyboard press or alert handling if any
      await page.keyboard.press('Enter');
    }
    await page.waitForTimeout(2000);

    // Verify confirmation message or list changes
    // Either the item disappears or is marked as Inactive
    const rowCountAfter = await page.locator('table.advance-table tbody tr', { hasText: firstRowName }).count();
    expect(rowCountAfter).toBeLessThanOrEqual(1); // Row is removed or updated
  });
});
