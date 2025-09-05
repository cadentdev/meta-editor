// AI Settings Evaluation Test
// This test evaluates the current AI settings functionality to establish a baseline
// before implementing the AI status indicator feature.

import { test, expect } from '@playwright/test';

test.describe('AI Settings Baseline Evaluation', () => {
  let page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('http://127.0.0.1:3000');
    await page.waitForLoadState('networkidle');
  });

  test('1. Settings Modal Access - Via Menu', async () => {
    console.log('Testing Settings modal access...');
    
    // Navigate to Settings via menu
    await page.click('.menu-bar');
    await page.waitForSelector('.menu-dropdown');
    
    const settingsMenuItem = page.locator('.menu-item').filter({ hasText: 'Settings...' });
    await expect(settingsMenuItem).toBeVisible();
    await settingsMenuItem.click();
    
    // Verify settings modal opens
    const modal = page.locator('#settingsModal');
    await expect(modal).toBeVisible();
    
    // Take screenshot for documentation
    await page.screenshot({ path: 'ai-settings-modal-open.png', fullPage: true });
    
    console.log('✓ Settings modal accessible via menu');
  });

  test('2. AI Configuration UI Elements', async () => {
    console.log('Testing AI configuration UI elements...');
    
    // Open settings modal
    await page.click('.menu-bar');
    await page.waitForSelector('.menu-dropdown');
    await page.locator('.menu-item').filter({ hasText: 'Settings...' }).click();
    
    // Verify AI settings elements
    await expect(page.locator('#ollamaEndpoint')).toBeVisible();
    await expect(page.locator('#fetchModelsBtn')).toBeVisible();
    await expect(page.locator('#preferredModel')).toBeVisible();
    
    // Check initial values
    const endpointValue = await page.locator('#ollamaEndpoint').inputValue();
    console.log('Default endpoint:', endpointValue);
    
    // Take screenshot of AI settings section
    await page.screenshot({ path: 'ai-settings-ui-elements.png', fullPage: true });
    
    console.log('✓ AI configuration UI elements present');
  });

  test('3. Endpoint Validation Flow', async () => {
    console.log('Testing endpoint validation...');
    
    // Open settings modal
    await page.click('.menu-bar');
    await page.waitForSelector('.menu-dropdown');
    await page.locator('.menu-item').filter({ hasText: 'Settings...' }).click();
    
    const endpointInput = page.locator('#ollamaEndpoint');
    
    // Test invalid URL
    await endpointInput.clear();
    await endpointInput.fill('invalid-url');
    await endpointInput.blur();
    
    // Check for validation feedback
    const errorMessage = page.locator('.error-message');
    if (await errorMessage.isVisible()) {
      console.log('✓ Validation feedback shown for invalid URL');
    }
    
    // Test valid URL format
    await endpointInput.clear();
    await endpointInput.fill('http://localhost:11434');
    await endpointInput.blur();
    
    console.log('✓ Endpoint validation tested');
  });

  test('4. Model Fetching Functionality', async () => {
    console.log('Testing model fetching functionality...');
    
    // Open settings modal
    await page.click('.menu-bar');
    await page.waitForSelector('.menu-dropdown');
    await page.locator('.menu-item').filter({ hasText: 'Settings...' }).click();
    
    // Set endpoint and try to fetch models
    await page.locator('#ollamaEndpoint').fill('http://localhost:11434');
    
    const fetchButton = page.locator('#fetchModelsBtn');
    await expect(fetchButton).toBeVisible();
    
    // Click fetch models button
    await fetchButton.click();
    
    // Wait for potential response (will likely fail if Ollama not running)
    await page.waitForTimeout(2000);
    
    // Check model dropdown state
    const modelSelect = page.locator('#preferredModel');
    const options = await modelSelect.locator('option').count();
    console.log(`Model dropdown has ${options} options`);
    
    console.log('✓ Model fetching functionality tested');
  });

  test('5. Settings Persistence', async () => {
    console.log('Testing settings persistence...');
    
    // Open settings modal
    await page.click('.menu-bar');
    await page.waitForSelector('.menu-dropdown');
    await page.locator('.menu-item').filter({ hasText: 'Settings...' }).click();
    
    // Set custom endpoint
    const testEndpoint = 'http://test.example.com:11434';
    await page.locator('#ollamaEndpoint').fill(testEndpoint);
    
    // Save settings
    await page.locator('#saveSettingsBtn').click();
    
    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Reopen settings and check if value persisted
    await page.click('.menu-bar');
    await page.waitForSelector('.menu-dropdown');
    await page.locator('.menu-item').filter({ hasText: 'Settings...' }).click();
    
    const persistedValue = await page.locator('#ollamaEndpoint').inputValue();
    console.log('Persisted endpoint:', persistedValue);
    
    console.log('✓ Settings persistence tested');
  });

  test('6. UI Layout and Toolbar Assessment', async () => {
    console.log('Assessing UI layout for status indicator placement...');
    
    // Take full page screenshot for analysis
    await page.screenshot({ path: 'ui-layout-assessment.png', fullPage: true });
    
    // Check toolbar structure
    const toolbar = page.locator('.toolbar');
    if (await toolbar.isVisible()) {
      console.log('✓ Toolbar is visible');
      
      // Count existing toolbar icons
      const toolbarIcons = await toolbar.locator('i').count();
      console.log(`Toolbar has ${toolbarIcons} icons`);
      
      // Take toolbar-specific screenshot
      await toolbar.screenshot({ path: 'toolbar-current-state.png' });
    }
    
    // Check menu bar structure
    const menuBar = page.locator('.menu-bar');
    await expect(menuBar).toBeVisible();
    await menuBar.screenshot({ path: 'menu-bar-current-state.png' });
    
    console.log('✓ UI layout assessed');
  });

  test('7. Error Handling Assessment', async () => {
    console.log('Testing error handling scenarios...');
    
    // Open settings modal
    await page.click('.menu-bar');
    await page.waitForSelector('.menu-dropdown');
    await page.locator('.menu-item').filter({ hasText: 'Settings...' }).click();
    
    // Test with unreachable endpoint
    await page.locator('#ollamaEndpoint').fill('http://nonexistent.example.com:11434');
    
    // Try to fetch models from unreachable endpoint
    await page.locator('#fetchModelsBtn').click();
    
    // Wait and check for error handling
    await page.waitForTimeout(3000);
    
    // Look for error messages or feedback
    const errorElements = await page.locator('.error, .error-message, .alert-error').count();
    console.log(`Found ${errorElements} error elements`);
    
    // Take screenshot of error state
    await page.screenshot({ path: 'error-handling-state.png', fullPage: true });
    
    console.log('✓ Error handling assessed');
  });

  test.afterEach(async () => {
    if (page) {
      await page.close();
    }
  });
});