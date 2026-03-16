import { test, expect } from '@playwright/test';

test.describe('Step 1 — URL Input', () => {
  test('shows Step 1 with URL input and brand name input', async ({ page }) => {
    await page.goto('/onboarding');

    // assert heading contains "Decode Your Brand DNA"
    await expect(page.getByRole('heading', { name: /Decode Your Brand DNA/i })).toBeVisible();

    // assert URL input is visible (placeholder: https://yourwebsite.com)
    const urlInput = page.getByTestId('url-input');
    await expect(urlInput).toBeVisible();
    await expect(urlInput).toHaveAttribute('placeholder', 'https://yourwebsite.com');

    // assert brand name input is visible
    const brandNameInput = page.getByTestId('brand-name-input');
    await expect(brandNameInput).toBeVisible();

    // assert "Analyse My Brand →" button is visible
    const submitBtn = page.getByTestId('submit-btn');
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toContainText('Analyse My Brand');
  });

  test('shows validation error for empty URL submission', async ({ page }) => {
    await page.goto('/onboarding');

    await page.getByTestId('submit-btn').click();

    // assert error message
    await expect(page.getByTestId('url-error')).toHaveText('Please enter a valid URL starting with http:// or https://');
  });

  test('shows validation error for URL without https', async ({ page }) => {
    await page.goto('/onboarding');

    await page.getByTestId('url-input').fill('notaurl');
    await page.getByTestId('submit-btn').click();

    await expect(page.getByTestId('url-error')).toBeVisible();
  });

  test('valid URL submission advances to Step 2', async ({ page }) => {
    await page.goto('/onboarding');

    await page.getByTestId('url-input').fill('https://example.com');
    await page.getByTestId('brand-name-input').fill('Example Brand');
    await page.getByTestId('submit-btn').click();

    // Step 2 shows the analysis progress UI with "AI Discovery Agent" badge
    await expect(page.getByText('AI Discovery Agent')).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Step 2 — Analysing', () => {
  test('shows analysis progress with step list', async ({ page }) => {
    await page.goto('/onboarding');

    await page.getByTestId('url-input').fill('https://example.com');
    await page.getByTestId('submit-btn').click();

    // The analysis progress shows "Scraping content" as the first step label
    await expect(page.getByText('Scraping content')).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Auth Modal via Login Page', () => {
  test('login page shows sign in form', async ({ page }) => {
    await page.goto('/login');

    // Assert the login form is visible
    await expect(page.getByText('Welcome back')).toBeVisible();
    await expect(page.getByPlaceholder('you@company.com')).toBeVisible();
    await expect(page.getByPlaceholder('••••••••')).toBeVisible();
  });

  test('login page can switch between login and signup modes', async ({ page }) => {
    await page.goto('/login');

    // Should show "Welcome back" (login mode)
    await expect(page.getByText('Welcome back')).toBeVisible();

    // Switch to signup
    await page.getByRole('button', { name: 'Create Account' }).first().click();
    await expect(page.getByText('Create your account')).toBeVisible();

    // Switch back to sign in
    await page.getByRole('button', { name: 'Sign In' }).first().click();
    await expect(page.getByText('Welcome back')).toBeVisible();
  });

  test('login form shows validation error when fields are empty', async ({ page }) => {
    await page.goto('/login');

    // Click the Sign In submit button (there may be multiple "Sign In" buttons: one toggle, one submit)
    // The submit button is the primary CTA button
    const signInButtons = page.getByRole('button', { name: 'Sign In' });
    await signInButtons.last().click();

    await expect(page.getByText('Please fill in all required fields.')).toBeVisible();
  });

  test('signup form requires name field', async ({ page }) => {
    await page.goto('/login');

    // Switch to signup mode
    await page.getByRole('button', { name: 'Create Account' }).first().click();

    // Fill email and password only (skip name)
    await page.getByPlaceholder('you@company.com').fill('test@example.com');
    await page.getByPlaceholder('••••••••').fill('password123');

    // Click "Create Account" submit button
    const createButtons = page.getByRole('button', { name: 'Create Account' });
    await createButtons.last().click();

    await expect(page.getByText('Please enter your name.')).toBeVisible();
  });

  test('Google OAuth button is present', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByRole('button', { name: /Continue with Google/i })).toBeVisible();
  });
});
