import { test, expect } from '@playwright/test';

test.describe('Meeting Flow', () => {
  test('Full host flow and participant sync (Criteria 1, 2)', async ({ page, context }) => {
    await page.goto('/');
    await page.fill('input[type="number"]', '5');
    await page.fill('input[type="number"]', '100');
    await page.click('button:has-text("Start Meeting")');
    await expect(page).toHaveURL(/\/session\/[a-f0-9-]+/);
    const ticker = page.locator('.text-7xl');
    await expect(ticker).toBeVisible();
    const hostUrl = page.url();
    const participantPage = await context.newPage();
    await participantPage.goto(hostUrl.replace(/\?key=.*/, ''));
    const pTicker = participantPage.locator('.text-7xl');
    await expect(pTicker).toBeVisible();
    await page.click('button:has-text("End Meeting")');
    await expect(page).toHaveURL(/\/summary$/);
    await page.click('text="Copy Summary"');
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toContain('Total Cost');
  });
});