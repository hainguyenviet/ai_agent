import { test, expect } from '@playwright/test';

test('shows initial items and can add an item', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('h1')).toHaveText('AI Agent Vue + DB + MCP');

  const beforeCount = await page.locator('ul > li').count();

  await page.fill('input[placeholder="Tên item"]', 'Item test');
  await page.click('button:has-text("Thêm")');

  await expect(page.locator('ul > li')).toHaveCount(beforeCount + 1);

  await page.click('button:has-text("Gọi MCP")');
  await expect(page.locator('pre')).not.toBeEmpty();
});
