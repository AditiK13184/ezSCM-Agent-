import { test, expect } from '@playwright/test';

import 'dotenv/config';

const BASE_URL = process.env.BASE_URL!;
const USERNAME = process.env.USERNAME!;
const PASSWORD = process.env.PASSWORD!;

test.describe('Access & Navigation', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to the login page
    await page.goto(BASE_URL);

    // Fill credentials and log in
    await page.locator('#email').fill(USERNAME);
    await page.locator('#password').fill(PASSWORD);
    await page.locator('button[type="submit"]').click();

    // Wait for Lobby to load
    await page.waitForURL('**/user/lobby');
  });

  test('TC-INV-001: Verify access to the Inventory module from Lobby Dashboard', async ({ page }) => {
    // Locate the left sidebar navigation item with text "Inventory"
    const inventorySidebarItem = page.locator('.lp-sidebar-item', { hasText: /^Inventory$/ });
    await expect(inventorySidebarItem).toBeVisible();

    // Click the Inventory menu item
    await inventorySidebarItem.click();

    // Verify redirection to the Inventory Reports view
    await page.waitForURL('**/user/inventory/reports');

    // Verify the page header "Inventory Report" is displayed
    const pageHeader = page.locator('h5', { hasText: /^Inventory Report$/ });
    await expect(pageHeader).toBeVisible();
  });

  test('TC-INV-002: Verify sub-navigation tab active states and routing', async ({ page }) => {
    // Navigate directly to Inventory Reports main page
    const reportsUrl = BASE_URL.replace(/\/$/, '') + '/user/inventory/reports';
    await page.goto(reportsUrl);
    await page.waitForURL('**/user/inventory/reports');

    const reportsTab = page.locator('.lp-tab-link', { hasText: /^Inventory Report$/ });
    const reorderTab = page.locator('.lp-tab-link', { hasText: /^Reorder Level Report$/ });
    const nearerTab = page.locator('.lp-tab-link', { hasText: /^Nearer Reorder Level Report$/ });
    const stockTab = page.locator('.lp-tab-link', { hasText: /^Inventory Stock Report$/ });

    // Click Reorder Level Report tab
    await reorderTab.click();
    await page.waitForURL('**/user/inventory/reorderLevelReport');
    await expect(page).toHaveURL(/.*reorderLevelReport/);

    // Click Nearer Reorder Level Report tab
    await nearerTab.click();
    await page.waitForURL('**/user/inventory/nearerReorderReport');
    await expect(page).toHaveURL(/.*nearerReorderReport/);

    // Click Inventory Stock Report tab
    await stockTab.click();
    await page.waitForURL('**/user/inventory/inventoryStockReports');
    await expect(page).toHaveURL(/.*inventoryStockReports/);

    // Click Inventory Report tab
    await reportsTab.click();
    await page.waitForURL('**/user/inventory/reports');
    await expect(page).toHaveURL(/.*reports/);
  });
});
