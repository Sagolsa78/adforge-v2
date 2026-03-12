import { test, expect } from '@playwright/test';

test.describe('Step 1 — URL Input', () => {
  test('shows Step 1 with URL input and brand name input', async ({ page }) => {
    await page.goto('/onboarding');
    
    // assert heading contains "Decode Your Brand DNA"
    await expect(page.getByRole('heading', { name: "Decode Your Brand DNA" })).toBeVisible();
    
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
    // Intercept API call to prevent actual scraping during test, or let it fail gracefully
    // Just mock it so we can easily advance. Note: since /brands creates SSE, mocking SSE is tricky, Route.fulfill stream
    // For now we will mock the standard POST to /api/v1/data/brands with a fast failure or a generic response
    // But the instructions didn't ask us to mock it, let's just use real UI interactions. It might hang on step 2 if backend is unavailable.
    // The instructions say: "shows analysis progress with step list" - so step 2 is sufficient.
    
    await page.goto('/onboarding');
    
    await page.getByTestId('url-input').fill('https://example.com');
    await page.getByTestId('brand-name-input').fill('Example Brand');
    await page.getByTestId('submit-btn').click();
    
    // assert StepBar shows Step 2 as active (it's the second button, so check if URL changes or heading changes)
    await expect(page.getByText('Analysing Your Brand')).toBeVisible();
  });

  test('StepBar renders all 7 steps', async ({ page }) => {
    await page.goto('/onboarding');
    
    const stepBar = page.getByTestId('step-bar');
    await expect(stepBar).toBeVisible();
    
    // Assert StepBar contains: URL, Analyse, Results, Context, Template, Generate, Output
    await expect(stepBar.getByRole('button', { name: 'URL' })).toBeVisible();
    await expect(stepBar.getByRole('button', { name: 'Analyse', exact: true })).toBeVisible();
    await expect(stepBar.getByRole('button', { name: 'Results' })).toBeVisible();
    await expect(stepBar.getByRole('button', { name: 'Context' })).toBeVisible();
    await expect(stepBar.getByRole('button', { name: 'Template' })).toBeVisible();
    await expect(stepBar.getByRole('button', { name: 'Generate' })).toBeVisible();
    await expect(stepBar.getByRole('button', { name: 'Output' })).toBeVisible();
  });

  test('ToolNavbar shows Sign in and Start free when logged out', async ({ page }) => {
    await page.goto('/onboarding');
    
    // Note: Use exact matches for these button texts based on the component code (Sign In, Start Free)
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Start Free' })).toBeVisible();
  });
});

test.describe('Step 2 — Analysing', () => {
  test('shows analysis progress with step list', async ({ page }) => {
    await page.goto('/onboarding');
    
    await page.getByTestId('url-input').fill('https://example.com');
    await page.getByTestId('submit-btn').click();
    
    // By default Page2Analysing shows "Scraping website content" as the first step when mounting if no events yet
    await expect(page.getByText('Scraping website content')).toBeVisible();
  });
});

test.describe('Auth Modal', () => {
  test('clicking Start free opens signup modal', async ({ page }) => {
    await page.goto('/onboarding');
    await page.getByRole('button', { name: 'Start Free' }).click();
    
    const modal = page.getByTestId('auth-modal');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText('Join AdForge');
  });

  test('clicking Sign in opens login modal', async ({ page }) => {
    await page.goto('/onboarding');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    const modal = page.getByTestId('auth-modal');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText('Welcome back');
  });

  test('can switch between login and signup modes', async ({ page }) => {
    await page.goto('/onboarding');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    const modal = page.getByTestId('auth-modal');
    await expect(modal).toContainText('Welcome back');
    
    // Switch to create account
    await modal.getByRole('button', { name: 'Create Account' }).click();
    await expect(modal).toContainText('Join AdForge');
    
    // Switch back to sign in
    await modal.getByRole('button', { name: 'Sign In' }).click();
    await expect(modal).toContainText('Welcome back');
  });

  test('modal closes on close button click', async ({ page }) => {
    await page.goto('/onboarding');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    const modal = page.getByTestId('auth-modal');
    await expect(modal).toBeVisible();
    
    // Click close button (Lucide icon X is typically in a button with aria-label="Close")
    await page.getByLabel('Close').click();
    
    await expect(modal).not.toBeVisible();
  });

  test('login form shows validation error when fields are empty', async ({ page }) => {
    await page.goto('/onboarding');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    const modal = page.getByTestId('auth-modal');
    // Inside the modal, the submit button says "Sign In"
    // Since there are two "Sign In" buttons (one toggles mode, one submits), we select the submit one based on the DOM:
    await modal.getByRole('button', { name: 'Sign In' }).nth(1).click();
    
    await expect(modal).toContainText('Please fill in all required fields.');
  });

  test('signup form requires name field', async ({ page }) => {
    await page.goto('/onboarding');
    await page.getByRole('button', { name: 'Start Free' }).click();
    
    const modal = page.getByTestId('auth-modal');
    // Fill email and password only
    await modal.getByPlaceholder('you@company.com').fill('test@example.com');
    await modal.getByPlaceholder('••••••••').fill('password123');
    
    // Submit
    await modal.getByRole('button', { name: 'Create Account' }).nth(1).click();
    
    await expect(modal).toContainText('Please enter your name.');
  });

  test('Google OAuth button is present in modal', async ({ page }) => {
    await page.goto('/onboarding');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    const modal = page.getByTestId('auth-modal');
    await expect(modal.getByRole('button', { name: /Continue with Google/i })).toBeVisible();
  });
});

test.describe('StepBar Navigation', () => {
  test('completed steps are clickable for back-navigation', async ({ page }) => {
    // This requires advancing past step 1, which means step 1 is done
    await page.goto('/onboarding');
    await page.getByTestId('url-input').fill('https://example.com');
    await page.getByTestId('submit-btn').click();
    
    // We arrive at Step 2
    await expect(page.getByText('Scraping website content')).toBeVisible();
    
    // StepBar should show Step 1 with a check (or at least clickable)
    // Wait for the step update
    const stepBar = page.getByTestId('step-bar');
    
    // Click back to step 1 via its aria-label
    await stepBar.getByRole('button', { name: 'URL' }).click({ force: true });
    
    // Assert we're back on step 1
    await expect(page.getByRole('heading', { name: "Decode Your Brand DNA" })).toBeVisible();
  });
});
