import { expect, test } from '@playwright/test';
import { URL } from 'url';

test.describe('Redos Detector Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/');
  });

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

  test('supports case insensitive mode', async ({ page }) => {
    await page.locator('[data-test=pattern-input]').type('a+A+$');
    await page.locator('[data-test=redos-safe]').waitFor({ timeout: 2000 });
    await page.locator('[data-test=unicode]').check();
    await page.locator('[data-test=redos-unsafe]').waitFor({ timeout: 2000 });
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

  test('should update the url', async ({ page }) => {
    await page.locator('[data-test=pattern-input]').type('a+a+$');
    await page.locator('[data-test=unicode]').check();
    const params = new URL(page.url()).searchParams;
    expect(params.get('pattern')).toBe('a+a+$');
    expect(params.get('unicode')).toBe('true');
  });

  test('should preload from url', async ({ page }) => {
    await page.goto('http://localhost:3000/?pattern=a%2Ba%2B%24&unicode=true');
    expect(await page.locator('[data-test=pattern-input]').inputValue()).toBe(
      'a+a+$',
    );
    expect(await page.locator('[data-test=unicode]').isChecked()).toBe(true);
  });
});
