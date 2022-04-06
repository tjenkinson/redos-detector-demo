import { test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/');
});

test.describe('Redos Detector Demo', () => {
  test('should initially show the safe message', async ({ page }) => {
    await page.locator('[data-test=redos-safe]').waitFor({ timeout: 2000 });
  });

  test('should show the safe message when pattern is safe', async ({
    page,
  }) => {
    await page.locator('[data-test=pattern-input]').type('abc');
    await page.locator('[data-test=redos-safe]').waitFor({ timeout: 2000 });
  });

  test.describe('when pattern is not safe', () => {
    test.beforeEach(async ({ page }) => {
      await page.locator('[data-test=pattern-input]').type('a+a+$');
    });

    test('should show the unsafe message when pattern is not safe', async ({
      page,
    }) => {
      await page.locator('[data-test=redos-unsafe]').waitFor({ timeout: 2000 });
    });

    test('should show results when pattern is not safe', async ({ page }) => {
      await page.locator('[data-test=result]').waitFor({ timeout: 2000 });
    });
  });

  test('supports unicode mode', async ({ page }) => {
    await page.locator('[data-test=pattern-input]').type('👍+👍+$');
    await page.locator('[data-test=redos-safe]').waitFor({ timeout: 2000 });
    await page.locator('[data-test=unicode]').check();
    await page.locator('[data-test=redos-unsafe]').waitFor({ timeout: 2000 });
  });

  (['hover', 'click'] as const).forEach((mode) => {
    test(`highlights entires on ${mode}`, async ({ page }) => {
      await page.locator('[data-test=pattern-input]').type('a+a+$');
      await page.locator('[data-test=redos-unsafe]').waitFor({ timeout: 2000 });
      await page.locator('[data-test=result] .result-row').first()[mode]();
      await page
        .locator('[data-test=pattern] .highlight-a')
        .first()
        .isVisible();
      await page
        .locator('[data-test=pattern] .highlight-b')
        .first()
        .isVisible();
    });
  });
});
