// AI Settings Baseline Evaluation Test
// Corrected version with proper selectors and menu interaction

import { test, expect } from '@playwright/test';

test.describe('AI Settings Baseline Evaluation', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('http://127.0.0.1:3000');
    await page.waitForLoadState('networkidle');
  });

  test('1. Settings Modal Access - Via Menu', async ({ page }) => {
    console.log('Testing Settings modal access...');
    
    // Hover over MetaEditor menu to show dropdown
    await page.locator('.menu-item').first().hover();
    
    // Click Settings menu action
    await page.locator('[data-action="settings"]').click();
    
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
    await page.locator('.menu-item').first().hover();
    await page.locator('[data-action="settings"]').click();
    await expect(page.locator('#settings-modal')).toBeVisible();
    
    // Verify AI settings elements (check actual IDs from HTML)
    const ollamaEndpoint = page.locator('#ollama-endpoint');
    const fetchModelsBtn = page.locator('#fetch-models');
    const preferredModel = page.locator('#preferred-model');
    
    await expect(ollamaEndpoint).toBeVisible();
    await expect(fetchModelsBtn).toBeVisible();
    await expect(preferredModel).toBeVisible();
    
    // Check initial values
    const endpointValue = await ollamaEndpoint.inputValue();
    console.log('Default endpoint:', endpointValue);
    
    // Take screenshot of AI settings section
    await page.screenshot({ path: 'ai-settings-ui-elements.png', fullPage: true });
    
    console.log('✓ AI configuration UI elements present');
  });

  test('3. Model Fetching Test (Connection Test)', async ({ page }) => {
    console.log('Testing model fetching functionality...');
    
    // Open settings modal
    await page.locator('.menu-item').first().hover();
    await page.locator('[data-action="settings"]').click();
    
    const fetchButton = page.locator('#fetch-models');
    await expect(fetchButton).toBeVisible();
    
    // Click fetch models button
    await fetchButton.click();
    
    // Wait for response (will likely timeout if Ollama not running)
    await page.waitForTimeout(3000);
    
    // Check model dropdown state
    const modelSelect = page.locator('#preferred-model');
    const options = await modelSelect.locator('option').count();
    console.log(`Model dropdown has ${options} options`);
    
    // Take screenshot showing the fetch attempt result
    await page.screenshot({ path: 'model-fetch-attempt.png', fullPage: true });
    
    console.log('✓ Model fetching functionality tested');
  });

  test('4. Settings Persistence Test', async ({ page }) => {
    console.log('Testing settings persistence...');
    
    // Open settings modal
    await page.locator('.menu-item').first().hover();
    await page.locator('[data-action="settings"]').click();
    
    // Set custom endpoint
    const testEndpoint = 'http://test.example.com:11434';
    const endpointInput = page.locator('#ollama-endpoint');
    await endpointInput.clear();
    await endpointInput.fill(testEndpoint);
    
    // Save settings
    await page.locator('#settings-save').click();
    
    // Verify modal closes
    await expect(page.locator('#settings-modal')).not.toBeVisible();
    
    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Reopen settings and check if value persisted
    await page.locator('.menu-item').first().hover();
    await page.locator('[data-action="settings"]').click();
    
    const persistedValue = await page.locator('#ollama-endpoint').inputValue();
    console.log('Persisted endpoint:', persistedValue);
    
    console.log('✓ Settings persistence tested');
  });

  test('5. UI Layout and Toolbar Assessment', async ({ page }) => {
    console.log('Assessing UI layout for status indicator placement...');
    
    // Take full page screenshot for analysis
    await page.screenshot({ path: 'ui-layout-full.png', fullPage: true });
    
    // Check toolbar structure
    const toolbar = page.locator('.toolbar');
    const toolbarVisible = await toolbar.isVisible();
    console.log('✓ Toolbar is visible:', toolbarVisible);
    
    if (toolbarVisible) {
      // Count existing toolbar buttons
      const toolbarButtons = await toolbar.locator('.toolbar-button').count();
      console.log(`Toolbar has ${toolbarButtons} buttons`);
      
      // Take toolbar-specific screenshot
      await toolbar.screenshot({ path: 'toolbar-current.png' });
      
      // List all toolbar buttons with their titles
      const buttonTitles = await toolbar.locator('.toolbar-button').evaluateAll(buttons => 
        buttons.map(btn => btn.getAttribute('title'))
      );
      console.log('Toolbar buttons:', buttonTitles);
    }
    
    // Check menu bar structure
    const menuBar = page.locator('.menu-bar');
    await expect(menuBar).toBeVisible();
    await menuBar.screenshot({ path: 'menu-bar-current.png' });
    
    // List all menu items
    const menuTitles = await page.locator('.menu-title').evaluateAll(titles => 
      titles.map(title => title.textContent)
    );
    console.log('Menu items:', menuTitles);
    
    console.log('✓ UI layout assessed');
  });

  test('6. End-to-End AI Settings Flow', async ({ page }) => {
    console.log('Testing complete AI settings flow...');
    
    // Step 1: Open settings
    await page.locator('.menu-item').first().hover();
    await page.locator('[data-action="settings"]').click();
    await expect(page.locator('#settings-modal')).toBeVisible();
    
    // Step 2: Modify endpoint
    const endpointInput = page.locator('#ollama-endpoint');
    const originalEndpoint = await endpointInput.inputValue();
    console.log('Original endpoint:', originalEndpoint);
    
    await endpointInput.clear();
    await endpointInput.fill('http://localhost:11434');
    
    // Step 3: Attempt model fetch
    await page.locator('#fetch-models').click();
    await page.waitForTimeout(2000);
    
    // Step 4: Save settings
    await page.locator('#settings-save').click();
    await expect(page.locator('#settings-modal')).not.toBeVisible();
    
    // Step 5: Take final screenshot
    await page.screenshot({ path: 'ai-settings-complete-flow.png', fullPage: true });
    
    console.log('✓ Complete AI settings flow tested');
  });

  test('7. Current State Documentation', async ({ page }) => {
    console.log('Documenting current application state...');
    
    // Take comprehensive screenshots for documentation
    await page.screenshot({ path: 'app-initial-state.png', fullPage: true });
    
    // Test toolbar toggle
    const toolbarToggle = page.locator('[data-action="toggle-toolbar"]');
    if (await toolbarToggle.isVisible()) {
      await page.locator('.menu-item').filter({ hasText: 'View' }).hover();
      await toolbarToggle.click();
      await page.screenshot({ path: 'app-toolbar-hidden.png', fullPage: true });
      
      // Toggle back
      await page.locator('.menu-item').filter({ hasText: 'View' }).hover();
      await toolbarToggle.click();
    }
    
    // Document current zen mode state
    const zenToggle = page.locator('[data-action="toggle-zen"]');
    if (await zenToggle.isVisible()) {
      await page.locator('.menu-item').filter({ hasText: 'View' }).hover();
      await zenToggle.click();
      await page.screenshot({ path: 'app-full-mode.png', fullPage: true });
    }
    
    console.log('✓ Current state documented');
  });
});