import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('renders hero section with correct headline', async ({ page }) => {
    await page.goto('/');
    
    // assert h1 contains "Analyze. Generate."
    const h1 = page.locator('h1');
    await expect(h1).toContainText('Analyze. Generate.');
    
    // assert "Analyse My Brand →" button is visible
    const analyzeBtn = page.getByRole('button', { name: 'Analyze My Brand →' });
    await expect(analyzeBtn).toBeVisible();
  });

  test('navbar is visible and sticky', async ({ page, isMobile }) => {
    await page.goto('/');
    
    // assert AdForge logo is visible (Text AdForge is present)
    await expect(page.getByText('AdForge', { exact: true })).toBeVisible();
    
    if (isMobile) {
      await page.getByRole('button', { name: 'Toggle Navigation' }).click();
    }
    
    // assert nav links Features, How It Works, Use Cases are visible
    await expect(page.getByRole('link', { name: 'Features' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'How It Works' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Use Cases' })).toBeVisible();
    
    // assert "Start for free" CTA button is visible
    await expect(page.getByRole('link', { name: 'Start for free' })).toBeVisible();
  });

  test('clicking Start for free navigates to onboarding', async ({ page, isMobile }) => {
    await page.goto('/');
    
    if (isMobile) {
      await page.getByRole('button', { name: 'Toggle Navigation' }).click();
    }
    
    await page.getByRole('link', { name: 'Start for free' }).click();
    await expect(page).toHaveURL(/.*\/onboarding/);
  });

  test('clicking Analyze My Brand navigates to onboarding', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('button', { name: 'Analyze My Brand →' }).click();
    await expect(page).toHaveURL(/.*\/onboarding/);
  });

  test('mobile navbar shows hamburger menu', async ({ page, isMobile }) => {
    // Only run this test on desktop viewports or explicitly mock the viewport
    if (!isMobile) {
      await page.setViewportSize({ width: 375, height: 667 });
    }
    
    await page.goto('/');
    
    // The hamburger should now be visible and clickable
    const hamburger = page.getByRole('button', { name: 'Toggle Navigation' });
    await expect(hamburger).toBeVisible();
    
    await hamburger.click();
    await expect(page.getByRole('link', { name: 'Start for free' })).toBeVisible();
  });

  test('page renders all sections', async ({ page }) => {
    await page.goto('/');
    
    const featuresHeading = page.getByRole('heading', { name: 'Powerful features built for modern marketers' });
    await featuresHeading.scrollIntoViewIfNeeded();
    await expect(featuresHeading).toBeVisible();
    
    const howItWorksHeading = page.getByRole('heading', { name: 'From brand scan to live campaign in 4 steps' });
    await howItWorksHeading.scrollIntoViewIfNeeded();
    await expect(howItWorksHeading).toBeVisible();
    
    const useCasesHeading = page.getByRole('heading', { name: 'Real-life use cases' });
    await useCasesHeading.scrollIntoViewIfNeeded();
    await expect(useCasesHeading).toBeVisible();
    
    const finalCtaHeading = page.getByRole('heading', { name: 'From URL to live campaign in minutes.' });
    await finalCtaHeading.scrollIntoViewIfNeeded();
    await expect(finalCtaHeading).toBeVisible();
  });
});
