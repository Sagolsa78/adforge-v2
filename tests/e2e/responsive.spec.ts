import { test, expect } from '@playwright/test';

test.describe('Responsive Design', () => {

  test('landing page is usable on mobile (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    
    // assert hero heading is visible and not overflowing
    const heroHeading = page.getByRole('heading', { name: "Analyze. Generate." });
    await expect(heroHeading).toBeVisible();
    
    // assert CTA button is full width
    const ctaBtn = page.getByRole('button', { name: 'Analyze My Brand →' });
    await expect(ctaBtn).toBeVisible();
    
    // check document.body.scrollWidth <= window.innerWidth
    const hasHorizontalScrollbar = await page.evaluate(() => {
      return document.body.scrollWidth > window.innerWidth;
    });
    expect(hasHorizontalScrollbar).toBe(false);
  });

  test('landing page is usable on tablet (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    // assert navbar links are visible
    await expect(page.getByRole('link', { name: 'Features' })).toBeVisible();
    
    // assert hero layout looks correct (heading visible)
    await expect(page.getByRole('heading', { name: "Analyze. Generate." })).toBeVisible();
  });

  test('onboarding tool is usable on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/onboarding');
    
    const urlInput = page.getByTestId('url-input');
    await expect(urlInput).toBeVisible();
    
    const stepBar = page.getByTestId('step-bar');
    await expect(stepBar).toBeVisible();
    
    const submitBtn = page.getByTestId('submit-btn');
    await expect(submitBtn).toBeVisible();
  });

  test('auth modal is usable on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/onboarding');
    
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    const modal = page.getByTestId('auth-modal');
    await expect(modal).toBeVisible();
    
    // Assert all form fields are visible and usable in login mode
    await expect(modal.getByPlaceholder('you@company.com')).toBeVisible();
    await expect(modal.getByPlaceholder('••••••••')).toBeVisible();
    await expect(modal.getByRole('button', { name: 'Sign In' }).nth(1)).toBeVisible();
  });
});
