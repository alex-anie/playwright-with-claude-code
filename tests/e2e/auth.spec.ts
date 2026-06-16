import { test, expect } from '@playwright/test';

/**
 * User Authentication Tests
 * Site: https://ecommerce-playground.lambdatest.io/
 *
 * Generated with Claude Code + Playwright MCP Server.
 * Claude analyzed the login and registration forms, identified
 * input fields, validation states, and error messages.
 */

test.describe('User Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.php?route=account/login');
  });

  test('should display login form', async ({ page }) => {
    // Verify the login form elements are present
    const emailInput = page.getByPlaceholder('E-Mail Address');
    const passwordInput = page.locator('input[type="password"]');
    const loginBtn = page.getByRole('button', { name: /login/i });

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(loginBtn).toBeVisible();
  });

  test('should show error on invalid credentials', async ({ page }) => {
    const emailInput = page.getByPlaceholder('E-Mail Address');
    const passwordInput = page.locator('input[type="password"]');
    const loginBtn = page.getByRole('button', { name: /login/i });

    await emailInput.fill('invalid@example.com');
    await passwordInput.fill('wrongpassword');
    await loginBtn.click();

    // Verify error alert is shown
    const errorAlert = page.locator('.alert-danger');
    await expect(errorAlert).toBeVisible({ timeout: 5000 });
  });

  test('should show validation for empty form submission', async ({ page }) => {
    const loginBtn = page.getByRole('button', { name: /login/i });
    await loginBtn.click();

    // This site uses JS-based validation, not native HTML5 required fields.
    // Submitting empty triggers the same "No match" warning as wrong credentials.
    const errorAlert = page.locator('.alert-danger');
    await expect(errorAlert).toBeVisible({ timeout: 5000 });
});
});

test.describe('User Registration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.php?route=account/register');
  });

  test('should display registration form', async ({ page }) => {
    const firstNameInput = page.getByPlaceholder('First Name');
    const lastNameInput = page.getByPlaceholder('Last Name');
    const emailInput = page.getByPlaceholder('E-Mail');

    await expect(firstNameInput).toBeVisible();
    await expect(lastNameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
  });

  test('should show error when passwords do not match', async ({ page }) => {
    await page.getByPlaceholder('First Name').fill('Test');
    await page.getByPlaceholder('Last Name').fill('User');
    await page.getByPlaceholder('E-Mail').fill('test@example.com');
    await page.getByPlaceholder('Telephone').fill('1234567890');

    const passwordInputs = page.locator('input[type="password"]');
    await passwordInputs.nth(0).fill('Password123!');
    await passwordInputs.nth(1).fill('DifferentPassword!');

    // Accept privacy policy — click the label since the checkbox itself
    // is visually hidden by Bootstrap's custom-control styling
    await page.locator('label[for="input-agree"]').click();

    await page.getByRole('button', { name: /continue/i }).click();

    // Verify password mismatch error
    const errorAlert = page.locator('.alert-danger, .text-danger');
    await expect(errorAlert.first()).toBeVisible({ timeout: 5000 });
  });
});
