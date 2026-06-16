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
    const emailInput = page.getByRole('textbox', { name: /email/i });
    const passwordInput = page.locator('input[type="password"]');
    const loginBtn = page.getByRole('button', { name: /login/i });

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(loginBtn).toBeVisible();
  });

  test('should show error on invalid credentials', async ({ page }) => {
    const emailInput = page.getByRole('textbox', { name: /email/i });
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

    // Email field should be required — either a browser tooltip or an alert
    const emailInput = page.getByRole('textbox', { name: /email/i });
    const validationMessage = await emailInput.evaluate(
      (el: HTMLInputElement) => el.validationMessage
    );
    expect(validationMessage).not.toBe('');
  });
});

test.describe('User Registration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.php?route=account/register');
  });

  test('should display registration form', async ({ page }) => {
    const firstNameInput = page.getByRole('textbox', { name: /first name/i });
    const lastNameInput = page.getByRole('textbox', { name: /last name/i });
    const emailInput = page.getByRole('textbox', { name: /email/i });

    await expect(firstNameInput).toBeVisible();
    await expect(lastNameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
  });

  test('should show error when passwords do not match', async ({ page }) => {
    await page.getByRole('textbox', { name: /first name/i }).fill('Test');
    await page.getByRole('textbox', { name: /last name/i }).fill('User');
    await page.getByRole('textbox', { name: /email/i }).fill('test@example.com');
    await page.getByRole('textbox', { name: /telephone/i }).fill('1234567890');

    const passwordInputs = page.locator('input[type="password"]');
    await passwordInputs.nth(0).fill('Password123!');
    await passwordInputs.nth(1).fill('DifferentPassword!');

    // Accept privacy policy
    const privacyCheckbox = page.locator('input[name="agree"]');
    if (await privacyCheckbox.count() > 0) {
      await privacyCheckbox.check();
    }

    await page.getByRole('button', { name: /continue/i }).click();

    // Verify password mismatch error
    const errorAlert = page.locator('.alert-danger, .text-danger');
    await expect(errorAlert.first()).toBeVisible({ timeout: 5000 });
  });
});
