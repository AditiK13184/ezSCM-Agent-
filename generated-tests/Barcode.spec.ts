import { test, expect } from '@playwright/test';
import 'dotenv/config';

const BASE_URL = process.env.BASE_URL!;
const USERNAME = process.env.USERNAME!;
const PASSWORD = process.env.PASSWORD!;

test.describe('Barcode', () => {

  test('TC-INV-029 - Verify barcode creation for an item', async ({ page }) => {
    // Login and navigate to Barcode page
    await page.goto(BASE_URL);
    await page.locator('#email').fill(USERNAME);
    await page.locator('#password').fill(PASSWORD);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/user/lobby');

    const barcodeUrl = BASE_URL.replace(/\/$/, '') + '/Inventory/Barcode';
    await page.goto(barcodeUrl);
    await page.waitForURL('**/Inventory/Barcode');

    // Search for SKU
    await page.locator('input[placeholder="Search Items"]').fill('GJ004');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    // Select Barcode Format
    await page.locator('button:has-text("Select Supported Format")').click();
    await page.locator('[role="option"]:has-text("CODE128"), button:has-text("CODE128")').first().click();
    await page.waitForTimeout(500);

    // Click "GenerateBarcodeImage" icon in the row if visible, else use toolbar
    const generateIcon = page.locator('table tbody tr:first-child img[title*="Generate"]').first();
    if (await generateIcon.isVisible()) {
      await generateIcon.click();
    } else {
      await page.locator('button:has-text("Create Barcode")').click();
    }
    await page.waitForTimeout(2000);

    // Verify barcode cell updates with image or code number
    const barcodeCell = page.locator('table tbody tr:first-child td:nth-child(5)'); // Barcode number column
    const barcodeText = await barcodeCell.innerText();
    expect(barcodeText.length).toBeGreaterThan(0);
  });
});
