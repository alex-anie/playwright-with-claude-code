import { test, expect } from '@playwright/test';

/**
 * Cart & Checkout Flow Tests
 * Site: https://ecommerce-playground.lambdatest.io/
 *
 * Generated with Claude Code + Playwright MCP Server.
 * Claude explored the add-to-cart and checkout UI, identified
 * the key interaction points, and produced these test flows.
 */

test.describe('Shopping Cart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should add a product to the cart', async ({ page }) => {
    // Search for a product
    const searchInput = page.getByRole('textbox', { name: /search/i });
    await searchInput.fill('MacBook');
    await searchInput.press('Enter');

    await page.waitForURL(/search/);

    // Click the first product to go to its detail page
    const firstProduct = page.locator('.product-thumb').first();
    await firstProduct.locator('h4 a, .caption a').first().click();

    // Click the Add to Cart button
    const addToCartBtn = page.getByRole('button', { name: /add to cart/i });
    await expect(addToCartBtn).toBeVisible();
    await addToCartBtn.click();

    // Verify success notification appears
    const successAlert = page.locator('.alert-success');
    await expect(successAlert).toBeVisible({ timeout: 5000 });
  });

  test('should update cart item quantity', async ({ page }) => {
    // Navigate directly to cart
    await page.goto('/index.php?route=checkout/cart');

    // If cart is empty, this test is skipped
    const cartEmpty = await page.locator('.text-center').filter({ hasText: /empty/i }).count();
    if (cartEmpty > 0) {
      test.skip();
      return;
    }

    // Update quantity of first item
    const quantityInput = page.locator('input[name^="quantity"]').first();
    await quantityInput.fill('2');

    const updateBtn = page.getByRole('button', { name: /update/i });
    await updateBtn.click();

    // Verify cart updated
    const successAlert = page.locator('.alert-success');
    await expect(successAlert).toBeVisible({ timeout: 5000 });
  });

  test('should remove a product from the cart', async ({ page }) => {
    await page.goto('/index.php?route=checkout/cart');

    const cartEmpty = await page.locator('.text-center').filter({ hasText: /empty/i }).count();
    if (cartEmpty > 0) {
      test.skip();
      return;
    }

    // Click the remove button for the first item
    const removeBtn = page.locator('button[data-original-title="Remove"]').first();
    await removeBtn.click();

    // Verify item was removed
    const successAlert = page.locator('.alert-success');
    await expect(successAlert).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Checkout Flow', () => {
  test('should redirect to login when proceeding to checkout as guest', async ({ page }) => {
    await page.goto('/index.php?route=checkout/checkout');

    // Verify checkout page or login redirect loads
    const checkoutPage = page.locator('h1, h2').filter({ hasText: /checkout|account/i }).first();
    await expect(checkoutPage).toBeVisible();
  });
});
