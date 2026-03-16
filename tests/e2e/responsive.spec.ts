import { test, expect } from '@playwright/test';

test.describe('Responsive Design', () => {

  test('landing page is usable on mobile (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    // assert hero heading is visible
    const heroHeading = page.getByRole('heading', { name: /Turn your website into/i });
    await expect(heroHeading).toBeVisible();

    // assert "Start for free" CTA is visible
    const ctaBtn = page.getByRole('button', { name: /Start for free/i });
    await expect(ctaBtn).toBeVisible();

    // check no horizontal scrollbar
    const hasHorizontalScrollbar = await page.evaluate(() => {
      return document.body.scrollWidth > window.innerWidth;
    });
    expect(hasHorizontalScrollbar).toBe(false);
  });

  test('landing page is usable on tablet (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    // assert navbar links are visible on tablet (768px >= md breakpoint)
    await expect(page.getByRole('link', { name: 'Features' })).toBeVisible();

    // assert hero layout shows heading
    await expect(page.getByRole('heading', { name: /Turn your website into/i })).toBeVisible();
  });

  test('onboarding tool is usable on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/onboarding');

    const urlInput = page.getByTestId('url-input');
    await expect(urlInput).toBeVisible();

    const submitBtn = page.getByTestId('submit-btn');
    await expect(submitBtn).toBeVisible();
  });

  test('auth page is usable on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/login');

    // Assert form fields are visible and usable
    await expect(page.getByPlaceholder('you@company.com')).toBeVisible();
    await expect(page.getByPlaceholder('••••••••')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' }).last()).toBeVisible();
  });
});
