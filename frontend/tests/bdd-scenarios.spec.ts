/**
 * BDD Scenarios — FE Agent Charter (task 1.1)
 *
 * Feature: Quản lý Items
 *   Là người dùng, tôi muốn quản lý danh sách items để theo dõi công việc của mình.
 */

import { test, expect } from "@playwright/test";

// Run all scenarios in this file serially to avoid flakiness with shared DB state.
test.describe.configure({ mode: "serial" });

// ---------------------------------------------------------------------------
// Scenario: Hiển thị danh sách items khi load trang
// ---------------------------------------------------------------------------
test("Scenario: hiển thị danh sách items khi load trang", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveText("AI Agent Vue + DB + MCP");
  // ít nhất heading và list section tồn tại
  await expect(page.locator('[aria-label="Danh sách items"]')).toBeVisible();
});

// ---------------------------------------------------------------------------
// Scenario: Thêm item mới
// ---------------------------------------------------------------------------
test("Scenario: thêm item mới", async ({ page }) => {
  await page.goto("/");

  const uniqueTitle = `Item BDD test ${Date.now()}-${Math.random()}`;

  await page.fill('input[placeholder="Tên item"]', uniqueTitle);
  await page.click('button[type="submit"]:has-text("Thêm")');

  await expect(page.locator("ul.item-list")).toContainText(uniqueTitle);
});

// ---------------------------------------------------------------------------
// Scenario: Đánh dấu item hoàn thành
// ---------------------------------------------------------------------------
test("Scenario: đánh dấu item hoàn thành", async ({ page }) => {
  await page.goto("/");

  // Tạo một item chuyên biệt cho scenario này để tránh phụ thuộc global state
  const toggleItemTitle = "Item BDD toggle";
  await page.fill('input[placeholder="Tên item"]', toggleItemTitle);
  await page.click('button[type="submit"]:has-text("Thêm")');

  const listItems = page.locator("ul.item-list > li");
  const targetItem = listItems.filter({ hasText: toggleItemTitle });
  await expect(targetItem).toHaveCount(1);

  const checkbox = targetItem.locator('input[type="checkbox"]');
  const wasChecked = await checkbox.isChecked();
  await checkbox.click();

  // Trạng thái checkbox phải thay đổi
  if (!wasChecked) {
    await expect(checkbox).toBeChecked();
  } else {
    await expect(checkbox).not.toBeChecked();
  }

  // Span title có class completed hoặc không tuỳ trạng thái trước
  const span = targetItem.locator("span");
  if (!wasChecked) {
    await expect(span).toHaveClass(/completed/);
  } else {
    await expect(span).not.toHaveClass(/completed/);
  }
});

// ---------------------------------------------------------------------------
// Scenario: Xóa item
// ---------------------------------------------------------------------------
test("Scenario: xóa item", async ({ page }) => {
  await page.goto("/");

  // Thêm một item chắc chắn để xóa
  const uniqueTitle = `Item sẽ bị xóa ${Date.now()}-${Math.random()}`;
  await page.fill('input[placeholder="Tên item"]', uniqueTitle);
  await page.click('button[type="submit"]:has-text("Thêm")');
  await expect(page.locator("ul.item-list")).toContainText(uniqueTitle);

  // Tìm item vừa thêm và xóa nó
  const targetItem = page.locator("ul.item-list > li").filter({
    hasText: uniqueTitle,
  });
  await targetItem.locator('button:has-text("Xóa")').click();

  await expect(page.locator("ul.item-list")).not.toContainText(uniqueTitle);
});

// ---------------------------------------------------------------------------
// Scenario: Kích hoạt MCP
// ---------------------------------------------------------------------------
test("Scenario: kích hoạt MCP và nhận phản hồi", async ({ page }) => {
  await page.goto("/");

  await page.click('button:has-text("Gọi MCP")');

  const pre = page.locator('[aria-label="Kết quả MCP"]');
  await expect(pre).toBeVisible();
  await expect(pre).not.toBeEmpty();
});
