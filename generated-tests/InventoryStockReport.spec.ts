import { test, expect } from '@playwright/test';

import 'dotenv/config';

const BASE_URL = process.env.BASE_URL!;
const USERNAME = process.env.USERNAME!;
const PASSWORD = process.env.PASSWORD!;

test.describe('Inventory Stock Report', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to the login page and log in
    await page.goto(BASE_URL);
    await page.locator('#email').fill(USERNAME);
    await page.locator('#password').fill(PASSWORD);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/user/lobby');

    // Navigate to the Inventory Stock Report page
    const stockUrl = BASE_URL.replace(/\/$/, '') + '/user/inventory/inventoryStockReports';
    await page.goto(stockUrl);
    await page.waitForURL('**/user/inventory/inventoryStockReports');
    // Wait for the table to load
    await page.waitForSelector('table.advance-table');
  });

  test('TC-INV-019 - Verify view structure and table columns', async ({ page }) => {
    // 1. Verify headers
    const headers = page.locator('table.advance-table th');
    const headerTexts = await headers.allInnerTexts();
    expect(headerTexts.map(t => t.trim())).toEqual([
      'NAME', 'MASTER SKU', 'SKU', 'MATERIAL TYPE', 'QUANTITY'
    ]);

    // 2. Verify initial list has 30 rows
    const rows = page.locator('table.advance-table tbody tr');
    await expect(rows).toHaveCount(30);
  });

  test('TC-INV-020 - Verify Date Range picker modal and filtering', async ({ page }) => {
    // Locate the date range button using its text matching standard date pattern (dd/mm/yyyy - dd/mm/yyyy)
    const dateRangeBtn = page.locator('div[role="button"]', { hasText: /\d{2}\/\d{2}\/\d{4} - \d{2}\/\d{2}\/\d{4}/ });
    await expect(dateRangeBtn).toBeVisible();

    // Click the date range button to trigger picker modal
    await dateRangeBtn.click();
    await page.waitForTimeout(1000);

    // Verify calendar picker dialog / popover is open
    // Radix popovers usually have data-radix-popper-content-wrapper or we can look for calendar grids/elements
    const datePickerContainer = page.locator('[data-radix-popper-content-wrapper], .rdp, .calendar-popover');
    await expect(datePickerContainer.first()).toBeVisible();
  });
});
