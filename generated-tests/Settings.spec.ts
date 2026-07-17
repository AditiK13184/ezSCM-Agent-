import { test, expect } from '@playwright/test';
import 'dotenv/config';

const BASE_URL = process.env.BASE_URL!;
const USERNAME = process.env.USERNAME!;
const PASSWORD = process.env.PASSWORD!;

test.describe('Settings', () => {

  test('TC-INV-032 - Verify adding email for inventory notifications', async ({ page }) => {
    // Login and navigate to Settings page
    await page.goto(BASE_URL);
    await page.locator('#email').fill(USERNAME);
    await page.locator('#password').fill(PASSWORD);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/user/lobby');

    const settingsUrl = BASE_URL.replace(/\/$/, '') + '/Inventory/Settings';
    await page.goto(settingsUrl);
    await page.waitForURL('**/Inventory/Settings');

    // Enter email in text input
    const emailInput = page.locator('input[type="email"], input[placeholder*="email"]');
    if (await emailInput.isVisible()) {
      await emailInput.fill('notify@test.com');
      await page.locator('button:has-text("Add Email"), button:has-text(/^Add$/)').click();
      await page.waitForTimeout(2000);

      // Verify email is in the list
      const emailCell = page.locator('table tbody td', { hasText: 'notify@test.com' });
      await expect(emailCell).toBeVisible();
    }
  });
});
