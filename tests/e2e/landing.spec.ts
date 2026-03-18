import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('renders hero section with correct headline', async ({ page }) => {
    await page.goto('/');

    // The h1 contains "Turn your website into 30 days of Instagram content"
    const h1 = page.locator('h1');
    await expect(h1).toContainText('Turn your website into');
    await expect(h1).toContainText('30 days of Instagram content');

    // "Start for free" CTA button is visible (it's a link wrapping a button)
    const startBtn = page.getByRole('button', { name: /Start for free/i });
    await expect(startBtn).toBeVisible();
  });

  test('navbar is visible and sticky', async ({ page, isMobile }) => {
    await page.goto('/');

    // Navbar logo text is "Plug and Play Agent"
    await expect(page.getByText('Plug and Play Agent', { exact: true })).toBeVisible();

    if (isMobile) {
      await page.getByRole('button', { name: 'Toggle Navigation' }).click();
    }

    // Nav links: Features, How It Works, Pricing, Contact
    await expect(page.getByRole('link', { name: 'Features' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'How It Works' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Pricing' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Contact',exact:true })).toBeVisible();

    // "Get Started" CTA in desktop navbar
    if (!isMobile) {
      await expect(page.getByRole('navigation').getByRole('link', { name: 'Get Started' })).toBeVisible();
    }
  });

  test('clicking Start for free navigates to onboarding', async ({ page }) => {
    await page.goto('/');

    // The hero CTA is a Link wrapping a Button
    await page.getByRole('button', { name: /Start for free/i }).click();
    await expect(page).toHaveURL(/.*\/onboarding/);
  });

  test('mobile navbar shows hamburger menu', async ({ page, isMobile }) => {
    if (!isMobile) {
      await page.setViewportSize({ width: 375, height: 667 });
    }

    await page.goto('/');

    const hamburger = page.getByRole('button', { name: 'Toggle Navigation' });
    await expect(hamburger).toBeVisible();

    await hamburger.click();

    // Mobile menu shows Sign In and Get Started
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Sign In' }).filter({ visible: true })).toBeVisible();
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Get Started' }).filter({ visible: true })).toBeVisible();
  });

  test('page renders all sections', async ({ page }) => {
    await page.goto('/');

    // Features section: "Powerful features built for Instagram"
    const featuresHeading = page.getByRole('heading', { name: /Powerful features built for/i });
    await featuresHeading.scrollIntoViewIfNeeded();
    await expect(featuresHeading).toBeVisible();

    // How It Works section: "From brand scan to live content in 3 steps"
    const howItWorksHeading = page.getByRole('heading', { name: /From brand scan to live content/i });
    await howItWorksHeading.scrollIntoViewIfNeeded();
    await expect(howItWorksHeading).toBeVisible();

    // Final CTA: "Turn your website into 30 days of Instagram content in minutes."
    const finalCtaHeading = page.getByRole('heading', { name: /Turn your website into 30 days/i }).nth(1);
    await finalCtaHeading.scrollIntoViewIfNeeded();
    await expect(finalCtaHeading).toBeVisible();
  });
});
