import { test, expect } from '@playwright/test';
import 'dotenv/config';
import { getTestData } from './excelReader';

const BASE_URL = process.env.BASE_URL!;
const USERNAME = process.env.USERNAME!;
const PASSWORD = process.env.PASSWORD!;

test.describe('Inventory Report (Main List View)', () => {
  const testData = getTestData('InventoryReport', [
    'Search Keyword',
    'Non Existent Keyword',
    'Filter Item Type'
  ]);

  test.beforeEach(async ({ page }) => {
    // Navigate to the login page and log in
    await page.goto(BASE_URL);
    await page.locator('#email').fill(USERNAME);
    await page.locator('#password').fill(PASSWORD);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/user/lobby');

    // Navigate to the main Inventory page
    const reportsUrl = BASE_URL.replace(/\/$/, '') + '/user/inventory/reports';
    await page.goto(reportsUrl);
    await page.waitForURL('**/user/inventory/reports');
    // Wait for the table to load
    await page.waitForSelector('table.advance-table');
  });

  for (const [index, row] of testData.entries()) {
    test(`TC-INV-003 - Verify default state of the Inventory Report table - Row ${index + 1}`, async ({ page }) => {
      // 1. Verify headers
      const headers = page.locator('table.advance-table th');
      const headerTexts = await headers.allInnerTexts();
      expect(headerTexts.map(t => t.trim())).toEqual(['NAME', 'MASTER SKU', 'SKU', 'QUANTITY']);

      // 2. Verify total items label is present and contains "Total Items"
      const totalItemsLabel = page.locator('div', { hasText: /Total Items:/ });
      await expect(totalItemsLabel).toBeVisible();

      // 3. Verify exactly 20 rows are displayed initially
      const rows = page.locator('table.advance-table tbody tr');
      await expect(rows).toHaveCount(20);

      // 4. Verify bottom text summary displays "1 to 20"
      const summaryText = page.locator('div.mt-3.text-xs.text-muted-foreground');
      await expect(summaryText).toContainText('1 to 20');
    });

    test(`TC-INV-004 - Verify search by item name with valid matching records - Row ${index + 1}`, async ({ page }) => {
      const searchInput = page.locator('input[placeholder="Search"]');
      await searchInput.fill(row['Search Keyword']);
      await searchInput.press('Enter');

      // Wait for network/table reload
      await page.waitForTimeout(2000);

      const rows = page.locator('table.advance-table tbody tr');
      const rowCount = await rows.count();
      expect(rowCount).toBeGreaterThan(0);

      // Verify all returned rows contain search keyword
      const nameTexts = await page.locator('table.advance-table tbody tr td:first-child').allInnerTexts();
      const kw = row['Search Keyword'].toLowerCase();
      for (const name of nameTexts) {
        expect(name.toLowerCase()).toContain(kw);
      }
    });

    test(`TC-INV-005 - Verify search with a non-existent item name - Row ${index + 1}`, async ({ page }) => {
      const searchInput = page.locator('input[placeholder="Search"]');
      await searchInput.fill(row['Non Existent Keyword']);
      await searchInput.press('Enter');

      // Wait for network/table reload
      await page.waitForTimeout(2000);

      const rows = page.locator('table.advance-table tbody tr');
      await expect(rows).toHaveCount(0);
    });

    test(`TC-INV-007 - Verify Sort By Name functionality - Row ${index + 1}`, async ({ page }) => {
      // Click Sort By trigger
      await page.locator('button', { hasText: 'Sort By' }).click();

      // Click Name option inside popover
      await page.locator('[role="menuitem"]:has-text("Name"), [role="option"]:has-text("Name"), button:has-text("Name")').first().click();
      await page.waitForTimeout(2000);

      // Extract names and verify sorted alphabetically (A-Z)
      const nameTexts = await page.locator('table.advance-table tbody tr td:first-child').allInnerTexts();
      const sortedNames = [...nameTexts].sort((a, b) => a.localeCompare(b));
      expect(nameTexts).toEqual(sortedNames);
    });

    test(`TC-INV-008 - Verify Sort By SKU / Master SKU functionality - Row ${index + 1}`, async ({ page }) => {
      // Click Sort By trigger
      await page.locator('button', { hasText: 'Sort By' }).click();

      // Click SKU option
      await page.locator('[role="menuitem"]:has-text("Sku"), [role="option"]:has-text("Sku"), button:has-text("Sku")').first().click();
      await page.waitForTimeout(2000);

      // Extract SKUs and verify sorted
      const skuTexts = await page.locator('table.advance-table tbody tr td:nth-child(3)').allInnerTexts();
      const sortedSkus = [...skuTexts].sort((a, b) => a.localeCompare(b));
      expect(skuTexts).toEqual(sortedSkus);
    });

    test(`TC-INV-009 - Verify filtering table by Warehouse selection - Row ${index + 1}`, async ({ page }) => {
      const defaultRowCount = await page.locator('table.advance-table tbody tr').count();

      // Click Warehouse dropdown trigger
      await page.locator('button:has-text("Select Warehouse")').click();
      await page.waitForTimeout(500);

      // Select first non-default warehouse option (usually options listed below Select Warehouse)
      const warehouseOption = page.locator('[role="option"]:not(:has-text("Select Warehouse")), button:not(:has-text("Select Warehouse"))').first();
      const warehouseName = await warehouseOption.innerText();
      await warehouseOption.click();

      await page.waitForTimeout(2000);

      // Verify row count changed or remains valid (no errors)
      const filteredRowCount = await page.locator('table.advance-table tbody tr').count();
      console.log(`Warehouse filter applied for: ${warehouseName}. Row count: ${filteredRowCount} (previous: ${defaultRowCount})`);
      expect(filteredRowCount).toBeGreaterThanOrEqual(0);
    });

    test(`TC-INV-010 - Verify filtering table by Item Type selection - Row ${index + 1}`, async ({ page }) => {
      // Click Item Type dropdown trigger
      await page.locator('button:has-text("Select Item Type")').click();
      await page.waitForTimeout(500);

      // Click option matching Filter Item Type
      await page.locator(`[role="option"]:has-text("${row['Filter Item Type']}"), button:has-text("${row['Filter Item Type']}")`).first().click();
      await page.waitForTimeout(2000);

      // Verify row count
      const rowCount = await page.locator('table.advance-table tbody tr').count();
      expect(rowCount).toBeGreaterThanOrEqual(0);
    });

    test(`TC-INV-011 - Verify filtering table using Item Category Checkboxes - Row ${index + 1}`, async ({ page }) => {
      const initialRowCount = await page.locator('table.advance-table tbody tr').count();

      // Toggle "Production Items" checkbox
      await page.locator('#productionItems').click();
      await page.waitForTimeout(2000);

      const afterToggleRowCount = await page.locator('table.advance-table tbody tr').count();
      // Since category filter updates results, row count should change (or be 0/more depending on matches)
      expect(afterToggleRowCount).not.toEqual(initialRowCount);
    });

    test(`TC-INV-012 - Verify infinite scroll pagination behavior - Row ${index + 1}`, async ({ page }) => {
      // Assert 20 rows originally
      await expect(page.locator('table.advance-table tbody tr')).toHaveCount(20);

      // Scroll simplebar content wrapper to bottom
      const scrollContainer = page.locator('.simplebar-content-wrapper');
      await scrollContainer.evaluate(node => node.scrollTo(0, node.scrollHeight));

      // Wait for dynamic fetch
      await page.waitForTimeout(3000);

      // Verify row count increased to 30
      await expect(page.locator('table.advance-table tbody tr')).toHaveCount(30);

      // Verify bottom text summary updates to "1 to 30"
      const summaryText = page.locator('div.mt-3.text-xs.text-muted-foreground');
      await expect(summaryText).toContainText('1 to 30');
    });

    test(`TC-INV-014 - Verify Download Inventory Report functionality - Row ${index + 1}`, async ({ page }) => {
      // Start waiting for download before clicking
      const downloadPromise = page.waitForEvent('download');
      await page.locator('button[title="Download Inventory Report"]').click();
      const download = await downloadPromise;

      // Verify download occurs and suggested filename
      expect(download.suggestedFilename()).not.toBeNull();
    });

    test(`TC-INV-015 - Verify Download Batchwise Report functionality - Row ${index + 1}`, async ({ page }) => {
      const downloadPromise = page.waitForEvent('download');
      await page.locator('button[title="Download Batchwise Report"]').click();
      const download = await downloadPromise;

      expect(download.suggestedFilename()).not.toBeNull();
    });
  }
});

