/**
 * Results Field E2E Tests
 * Tests for the AI Results logging field functionality
 */

const { test, expect } = require('@playwright/test');

test.describe('Results Field', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the application
        await page.goto('http://localhost:3000');

        // Clear localStorage before each test
        await page.evaluate(() => {
            localStorage.clear();
        });

        // Wait for page to load
        await page.waitForLoadState('domcontentloaded');
    });

    test('should be hidden in Zen Mode (default)', async ({ page }) => {
        // Application starts in Zen Mode by default
        const resultsElement = page.locator('#results');
        const resultsHeader = page.locator('.results-header');

        // Results should be hidden in Zen Mode
        await expect(resultsElement).toHaveCSS('display', 'none');
        await expect(resultsHeader).toHaveCSS('display', 'none');
    });

    test('should be visible in Full Mode', async ({ page }) => {
        // Toggle to Full Mode
        await page.locator('.menu-title').filter({ hasText: 'View' }).click();
        await page.locator('.menu-action[data-action="toggle-zen"]').click();

        // Wait for UI to update
        await page.waitForTimeout(100);

        const resultsElement = page.locator('#results');
        const resultsHeader = page.locator('.results-header');

        // Results should be visible in Full Mode
        await expect(resultsElement).not.toHaveCSS('display', 'none');
        await expect(resultsHeader).not.toHaveCSS('display', 'none');
    });

    test('should show placeholder when empty', async ({ page }) => {
        // Toggle to Full Mode
        await page.locator('.menu-title').filter({ hasText: 'View' }).click();
        await page.locator('.menu-action[data-action="toggle-zen"]').click();

        // Wait for UI to update
        await page.waitForTimeout(100);

        const placeholder = page.locator('#results .results-placeholder');
        await expect(placeholder).toBeVisible();
        await expect(placeholder).toHaveText('AI interaction logs will appear here...');
    });

    test('should have disabled buttons when empty', async ({ page }) => {
        // Toggle to Full Mode
        await page.locator('.menu-title').filter({ hasText: 'View' }).click();
        await page.locator('.menu-action[data-action="toggle-zen"]').click();

        // Wait for UI to update
        await page.waitForTimeout(100);

        const copyBtn = page.locator('#copy-results-btn');
        const clearBtn = page.locator('#clear-results-btn');

        await expect(copyBtn).toBeDisabled();
        await expect(clearBtn).toBeDisabled();
    });

    test('should display log entries after AI operations', async ({ page }) => {
        // Set up localStorage with a test log entry
        await page.evaluate(() => {
            const testData = [
                {
                    timestamp: new Date().toISOString(),
                    message: 'Failed to fetch models: Network error',
                    type: 'error'
                }
            ];
            localStorage.setItem('metaEditorResults', JSON.stringify(testData));
        });

        // Reload to load the results from localStorage
        await page.reload();
        await page.waitForLoadState('domcontentloaded');

        // Toggle to Full Mode
        await page.locator('.menu-title').filter({ hasText: 'View' }).click();
        await page.locator('.menu-action[data-action="toggle-zen"]').click();
        await page.waitForTimeout(100);

        // Check that error log entry appears
        const resultsElement = page.locator('#results');
        const logEntries = resultsElement.locator('.log-entry');

        await expect(logEntries.first()).toBeVisible();
        await expect(logEntries.first()).toContainText('Failed to fetch models');
    });

    test('should enable buttons when log has entries', async ({ page }) => {
        // Set up localStorage with a test log entry
        await page.evaluate(() => {
            const testData = [
                {
                    timestamp: new Date().toISOString(),
                    message: 'Test log entry',
                    type: 'info'
                }
            ];
            localStorage.setItem('metaEditorResults', JSON.stringify(testData));
        });

        // Reload to load the results from localStorage
        await page.reload();
        await page.waitForLoadState('domcontentloaded');

        // Toggle to Full Mode
        await page.locator('.menu-title').filter({ hasText: 'View' }).click();
        await page.locator('.menu-action[data-action="toggle-zen"]').click();
        await page.waitForTimeout(100);

        const copyBtn = page.locator('#copy-results-btn');
        const clearBtn = page.locator('#clear-results-btn');

        // Buttons should now be enabled
        await expect(copyBtn).toBeEnabled();
        await expect(clearBtn).toBeEnabled();
    });

    test('should copy results to clipboard', async ({ page }) => {
        // Grant clipboard permissions
        await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);

        // Set up localStorage with a test log entry
        await page.evaluate(() => {
            const testData = [
                {
                    timestamp: new Date().toISOString(),
                    message: 'Failed to fetch models: Network error',
                    type: 'error'
                }
            ];
            localStorage.setItem('metaEditorResults', JSON.stringify(testData));
        });

        // Reload to load the results from localStorage
        await page.reload();
        await page.waitForLoadState('domcontentloaded');

        // Toggle to Full Mode
        await page.locator('.menu-title').filter({ hasText: 'View' }).click();
        await page.locator('.menu-action[data-action="toggle-zen"]').click();
        await page.waitForTimeout(100);

        // Click copy button
        await page.locator('#copy-results-btn').click();

        // Wait for copy operation
        await page.waitForTimeout(100);

        // Verify clipboard content
        const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
        expect(clipboardText).toContain('ERROR');
        expect(clipboardText).toContain('Failed to fetch models');
    });

    test('should clear results with confirmation', async ({ page }) => {
        // Set up localStorage with a test log entry
        await page.evaluate(() => {
            const testData = [
                {
                    timestamp: new Date().toISOString(),
                    message: 'Test log entry',
                    type: 'info'
                }
            ];
            localStorage.setItem('metaEditorResults', JSON.stringify(testData));
        });

        // Reload to load the results from localStorage
        await page.reload();
        await page.waitForLoadState('domcontentloaded');

        // Toggle to Full Mode
        await page.locator('.menu-title').filter({ hasText: 'View' }).click();
        await page.locator('.menu-action[data-action="toggle-zen"]').click();
        await page.waitForTimeout(100);

        // Verify log has entries
        const resultsElement = page.locator('#results');
        await expect(resultsElement.locator('.log-entry').first()).toBeVisible();

        // Set up dialog handler to accept confirmation
        page.on('dialog', dialog => dialog.accept());

        // Click clear button
        await page.locator('#clear-results-btn').click();

        // Wait for clear operation
        await page.waitForTimeout(100);

        // Verify log is cleared and placeholder is shown
        await expect(resultsElement.locator('.results-placeholder')).toBeVisible();
        await expect(resultsElement.locator('.log-entry')).toHaveCount(0);

        // Buttons should be disabled again
        await expect(page.locator('#copy-results-btn')).toBeDisabled();
        await expect(page.locator('#clear-results-btn')).toBeDisabled();
    });

    test('should not clear results when cancelling confirmation', async ({ page }) => {
        // Set up localStorage with a test log entry
        await page.evaluate(() => {
            const testData = [
                {
                    timestamp: new Date().toISOString(),
                    message: 'Test log entry',
                    type: 'info'
                }
            ];
            localStorage.setItem('metaEditorResults', JSON.stringify(testData));
        });

        // Reload to load the results from localStorage
        await page.reload();
        await page.waitForLoadState('domcontentloaded');

        // Toggle to Full Mode
        await page.locator('.menu-title').filter({ hasText: 'View' }).click();
        await page.locator('.menu-action[data-action="toggle-zen"]').click();
        await page.waitForTimeout(100);

        // Set up dialog handler to dismiss confirmation
        page.on('dialog', dialog => dialog.dismiss());

        // Click clear button
        await page.locator('#clear-results-btn').click();

        // Wait for potential clear operation
        await page.waitForTimeout(100);

        // Verify log still has entries
        const resultsElement = page.locator('#results');
        await expect(resultsElement.locator('.log-entry').first()).toBeVisible();
    });

    test('should persist results to localStorage', async ({ page }) => {
        // Set up localStorage with a test log entry
        await page.evaluate(() => {
            const testData = [
                {
                    timestamp: new Date().toISOString(),
                    message: 'Failed to fetch models: Network error',
                    type: 'error'
                }
            ];
            localStorage.setItem('metaEditorResults', JSON.stringify(testData));
        });

        // Reload to verify persistence
        await page.reload();
        await page.waitForLoadState('domcontentloaded');

        // Check localStorage still has the data after reload
        const savedResults = await page.evaluate(() => {
            return localStorage.getItem('metaEditorResults');
        });

        expect(savedResults).toBeTruthy();
        const parsed = JSON.parse(savedResults);
        expect(parsed.length).toBeGreaterThan(0);
        expect(parsed[0].message).toContain('Failed to fetch models');
    });

    test('should restore results from localStorage on page load', async ({ page }) => {
        // Set up localStorage with test data
        await page.evaluate(() => {
            const testData = [
                {
                    timestamp: new Date('2025-01-15T14:30:45').toISOString(),
                    message: 'Test log entry',
                    type: 'info'
                }
            ];
            localStorage.setItem('metaEditorResults', JSON.stringify(testData));
        });

        // Reload page
        await page.reload();
        await page.waitForLoadState('domcontentloaded');

        // Toggle to Full Mode
        await page.locator('.menu-title').filter({ hasText: 'View' }).click();
        await page.locator('.menu-action[data-action="toggle-zen"]').click();
        await page.waitForTimeout(100);

        // Verify log entry is displayed
        const resultsElement = page.locator('#results');
        const logEntries = resultsElement.locator('.log-entry');

        await expect(logEntries).toHaveCount(1);
        await expect(logEntries.first()).toContainText('Test log entry');

        // Buttons should be enabled
        await expect(page.locator('#copy-results-btn')).toBeEnabled();
        await expect(page.locator('#clear-results-btn')).toBeEnabled();
    });

    test('should display different message types with correct styling', async ({ page }) => {
        // Toggle to Full Mode
        await page.locator('.menu-title').filter({ hasText: 'View' }).click();
        await page.locator('.menu-action[data-action="toggle-zen"]').click();

        // Set up localStorage with different message types
        await page.evaluate(() => {
            const testData = [
                { timestamp: new Date().toISOString(), message: 'Info message', type: 'info' },
                { timestamp: new Date().toISOString(), message: 'Success message', type: 'success' },
                { timestamp: new Date().toISOString(), message: 'Error message', type: 'error' },
                { timestamp: new Date().toISOString(), message: 'AI response', type: 'ai-response' }
            ];
            localStorage.setItem('metaEditorResults', JSON.stringify(testData));
        });

        // Reload to load from localStorage
        await page.reload();
        await page.waitForLoadState('domcontentloaded');

        // Toggle to Full Mode again
        await page.locator('.menu-title').filter({ hasText: 'View' }).click();
        await page.locator('.menu-action[data-action="toggle-zen"]').click();
        await page.waitForTimeout(100);

        const resultsElement = page.locator('#results');

        // Verify all message types are displayed with correct classes
        await expect(resultsElement.locator('.log-entry.log-info')).toHaveCount(1);
        await expect(resultsElement.locator('.log-entry.log-success')).toHaveCount(1);
        await expect(resultsElement.locator('.log-entry.log-error')).toHaveCount(1);
        await expect(resultsElement.locator('.log-entry.log-ai-response')).toHaveCount(1);

        // Verify content
        await expect(resultsElement).toContainText('Info message');
        await expect(resultsElement).toContainText('Success message');
        await expect(resultsElement).toContainText('Error message');
        await expect(resultsElement).toContainText('AI response');
    });

    test('should toggle visibility with Zen Mode', async ({ page }) => {
        // Start in Zen Mode (default) - Results should be hidden
        const resultsElement = page.locator('#results');
        const resultsHeader = page.locator('.results-header');

        await expect(resultsElement).toHaveCSS('display', 'none');
        await expect(resultsHeader).toHaveCSS('display', 'none');

        // Toggle to Full Mode
        await page.locator('.menu-title').filter({ hasText: 'View' }).click();
        await page.locator('.menu-action[data-action="toggle-zen"]').click();
        await page.waitForTimeout(100);

        // Results should be visible
        await expect(resultsElement).not.toHaveCSS('display', 'none');
        await expect(resultsHeader).not.toHaveCSS('display', 'none');

        // Toggle back to Zen Mode
        await page.locator('.menu-title').filter({ hasText: 'View' }).click();
        await page.locator('.menu-action[data-action="toggle-zen"]').click();
        await page.waitForTimeout(100);

        // Results should be hidden again
        await expect(resultsElement).toHaveCSS('display', 'none');
        await expect(resultsHeader).toHaveCSS('display', 'none');
    });
});
