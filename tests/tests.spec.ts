import { test, expect, Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/');
});

test.describe('Redos Detector Demo', () => {
  test('should work', async ({ page }) => {
    //
  });
});
