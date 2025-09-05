// Quick verification test with correct selectors
import { test, expect } from '@playwright/test';

test('Quick AI Settings Elements Check', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000');
  
  // Open settings modal
  await page.locator('.menu-item').first().hover();
  await page.locator('[data-action="settings"]').click();
  await expect(page.locator('#settings-modal')).toBeVisible();
  
  // Check all elements with correct IDs
  console.log('Testing element visibility:');
  
  const elements = {
    'ollama-endpoint': await page.locator('#ollama-endpoint').isVisible(),
    'fetch-models-btn': await page.locator('#fetch-models-btn').isVisible(),
    'preferred-model': await page.locator('#preferred-model').isVisible(),
    'settings-save': await page.locator('#settings-save').isVisible(),
    'settings-cancel': await page.locator('#settings-cancel').isVisible(),
  };
  
  console.log('Element visibility:', elements);
  
  // Take screenshot
  await page.screenshot({ path: 'settings-elements-check.png', fullPage: true });
  
  // Try model fetch
  await page.locator('#fetch-models-btn').click();
  await page.waitForTimeout(2000);
  
  await page.screenshot({ path: 'after-fetch-attempt.png', fullPage: true });
});