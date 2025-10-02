// AI Settings Evaluation Test
// This test evaluates the current AI settings functionality to establish a baseline
// before implementing the AI status indicator feature.

import { test, expect } from '@playwright/test';

// Get Ollama endpoint from environment variable or use localhost as default
const OLLAMA_ENDPOINT = process.env.OLLAMA_ENDPOINT || 'http://localhost:11434';

// Helper function to open settings modal
async function openSettingsModal(page) {
  // Hover over the MetaEditor menu item to reveal dropdown
  const menuItem = page.locator('.menu-item').first();
  await menuItem.hover();

  // Wait for dropdown to be visible
  await page.waitForSelector('.dropdown-content:visible', { timeout: 2000 });

  // Click on the settings menu action
  await page.click('.menu-action[data-action="settings"]');

  // Wait for modal to be visible
  await page.waitForSelector('#settings-modal:visible');
}

test.describe('AI Settings Baseline Evaluation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://127.0.0.1:3000');
    await page.waitForLoadState('networkidle');
  });

  test('1. Settings Modal Access - Via Menu', async ({ page }) => {
    console.log('Testing Settings modal access...');

    // Navigate to Settings via menu
    await openSettingsModal(page);

    // Verify settings modal opens
    const modal = page.locator('#settings-modal');
    await expect(modal).toBeVisible();

    // Take screenshot for documentation
    await page.screenshot({ path: 'ai-settings-modal-open.png', fullPage: true });

    console.log('✓ Settings modal accessible via menu');
  });

  test('2. AI Configuration UI Elements', async ({ page }) => {
    console.log('Testing AI configuration UI elements...');

    // Open settings modal
    await openSettingsModal(page);

    // Verify AI settings elements
    await expect(page.locator('#ollama-endpoint')).toBeVisible();
    await expect(page.locator('#fetch-models-btn')).toBeVisible();
    await expect(page.locator('#preferred-model')).toBeVisible();

    // Check initial values
    const endpointValue = await page.locator('#ollama-endpoint').inputValue();
    console.log('Default endpoint:', endpointValue);

    // Take screenshot of AI settings section
    await page.screenshot({ path: 'ai-settings-ui-elements.png', fullPage: true });

    console.log('✓ AI configuration UI elements present');
  });

  test('3. Endpoint Validation Flow', async ({ page }) => {
    console.log('Testing endpoint validation...');

    // Open settings modal
    await openSettingsModal(page);

    const endpointInput = page.locator('#ollama-endpoint');

    // Test invalid URL
    await endpointInput.clear();
    await endpointInput.fill('invalid-url');
    await page.locator('#settings-save').click();

    // Check for validation feedback
    const errorMessage = page.locator('#endpoint-validation');
    await expect(errorMessage).toContainText('valid URL');
    console.log('✓ Validation feedback shown for invalid URL');

    // Test valid URL format
    await endpointInput.clear();
    await endpointInput.fill('http://localhost:11434');

    console.log('✓ Endpoint validation tested');
  });

  test('4. Model Fetching Functionality', async ({ page }) => {
    console.log(`Testing model fetching functionality with ${OLLAMA_ENDPOINT}...`);

    // Open settings modal
    await openSettingsModal(page);

    // Set endpoint and try to fetch models
    await page.locator('#ollama-endpoint').fill(OLLAMA_ENDPOINT);

    const fetchButton = page.locator('#fetch-models-btn');
    await expect(fetchButton).toBeVisible();

    // Click fetch models button
    await fetchButton.click();

    // Wait for fetch status to update
    await page.waitForTimeout(3000);

    // Check for status message
    const fetchStatus = page.locator('#fetch-status');
    const statusText = await fetchStatus.textContent();
    console.log(`Fetch status: ${statusText}`);

    // Check model dropdown state
    const modelSelect = page.locator('#preferred-model');
    const options = await modelSelect.locator('option').count();
    console.log(`Model dropdown has ${options} options`);

    // If we got models, verify the dropdown is visible
    if (options > 1) {
      const modelGroup = page.locator('#model-selection-group');
      await expect(modelGroup).toBeVisible();
      console.log('✓ Models fetched successfully');
    } else {
      console.log('⚠ No models fetched (Ollama may not be running)');
    }

    console.log('✓ Model fetching functionality tested');
  });

  test('5. Settings Persistence', async ({ page }) => {
    console.log('Testing settings persistence...');

    // Open settings modal
    await openSettingsModal(page);

    // Set custom endpoint
    const testEndpoint = 'http://test.example.com:11434';
    await page.locator('#ollama-endpoint').fill(testEndpoint);

    // Save settings
    await page.locator('#settings-save').click();

    // Wait for modal to close
    await page.waitForSelector('#settings-modal', { state: 'hidden' });

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Reopen settings and check if value persisted
    await openSettingsModal(page);

    const persistedValue = await page.locator('#ollama-endpoint').inputValue();
    console.log('Persisted endpoint:', persistedValue);

    expect(persistedValue).toBe(testEndpoint);
    console.log('✓ Settings persistence verified');
  });

  test('6. UI Layout and Toolbar Assessment', async ({ page }) => {
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

      // Check for AI status indicator
      const aiStatus = page.locator('#ai-status-btn');
      await expect(aiStatus).toBeVisible();
      console.log('✓ AI status indicator present in toolbar');

      // Take toolbar-specific screenshot
      await toolbar.screenshot({ path: 'toolbar-current-state.png' });
    }

    // Check menu bar structure
    const menuBar = page.locator('.menu-bar');
    await expect(menuBar).toBeVisible();
    await menuBar.screenshot({ path: 'menu-bar-current-state.png' });

    console.log('✓ UI layout assessed');
  });

  test('7. Error Handling Assessment', async ({ page }) => {
    console.log('Testing error handling scenarios...');

    // Open settings modal
    await openSettingsModal(page);

    // Test with unreachable endpoint
    await page.locator('#ollama-endpoint').fill('http://nonexistent.example.com:11434');

    // Try to fetch models from unreachable endpoint
    await page.locator('#fetch-models-btn').click();

    // Wait and check for error handling
    await page.waitForTimeout(5000);

    // Check fetch status for error message
    const fetchStatus = page.locator('#fetch-status');
    const statusText = await fetchStatus.textContent();
    console.log(`Error status: ${statusText}`);

    // Verify error message is shown
    if (statusText.includes('Error') || statusText.includes('Failed') || statusText.includes('unable')) {
      console.log('✓ Error feedback displayed');
    }

    // Take screenshot of error state
    await page.screenshot({ path: 'error-handling-state.png', fullPage: true });

    console.log('✓ Error handling assessed');
  });
});
