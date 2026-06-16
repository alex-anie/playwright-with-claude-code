import { test, expect } from '@playwright/test';

/**
 * Homepage Tests — LambdaTest Ecommerce Playground
 * Site: https://ecommerce-playground.lambdatest.io/
 *
 * These tests were generated with Claude Code using the Playwright MCP Server.
 * To regenerate or extend these tests, describe your scenario to Claude Code
 * and it will use the Playwright MCP tools to explore the site and produce
 * the appropriate test code.
 *
 * Run locally:
 *   npx playwright test tests/e2e/homepage.spec.ts
 *   npx playwright test tests/e2e/homepage.spec.ts --ui
 */

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load homepage and display site title', async ({ page }) => {
    // Verify the page title is present
    await expect(page).toHaveTitle(/Poco Electro/);

    // Verify the main navigation is visible
    const nav = page.getByRole('navigation');
    await expect(nav).toBeVisible();
  });

  test('should display featured products on homepage', async ({ page }) => {
    // Verify featured products section is visible
    const featuredSection = page.locator('.swiper-wrapper').first();
    await expect(featuredSection).toBeVisible();
  });

  test('should have a working search bar', async ({ page }) => {
    // Locate the search input
    const searchInput = page.getByRole('textbox', { name: /search/i });
    await expect(searchInput).toBeVisible();

    // Type a search query
    await searchInput.fill('MacBook');
    await searchInput.press('Enter');

    // Verify search results page loads
    await expect(page).toHaveURL(/search/);
  });
});
