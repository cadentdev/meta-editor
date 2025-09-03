import { test, expect } from '@playwright/test';

test.describe('Meta Editor Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the application', async ({ page }) => {
    // Check that the main elements are present
    await expect(page.locator('h1')).toContainText('Meta Editor');
    await expect(page.locator('.container')).toBeVisible();
  });

  test('should be in Zen Mode by default', async ({ page }) => {
    // In Zen Mode, metadata fields should be hidden
    await expect(page.locator('#title')).not.toBeVisible();
    await expect(page.locator('#content')).toBeVisible();
    await expect(page.locator('#preview')).toBeVisible();
  });

  test('should toggle to full mode when Show All is clicked', async ({ page }) => {
    // Click on View menu
    await page.locator('.menu-item:has-text("View")').click();
    
    // Click "Show All Meta Data"
    await page.locator('#zen-toggle-menu').click();
    
    // Now metadata fields should be visible
    await expect(page.locator('#title')).toBeVisible();
    await expect(page.locator('#filename')).toBeVisible();
    await expect(page.locator('#date')).toBeVisible();
  });

  test('should validate filename format', async ({ page }) => {
    // First show all fields
    await page.locator('.menu-item:has-text("View")').click();
    await page.locator('#zen-toggle-menu').click();
    
    // Enter invalid filename
    await page.fill('#filename', 'Invalid File Name');
    
    // Check for validation error
    await expect(page.locator('#filename-validation')).toContainText('lowercase');
  });

  test('should update preview when content changes', async ({ page }) => {
    // Add some content
    await page.fill('#content', '# Test Heading\\n\\nSome test content');
    
    // Preview should update
    await expect(page.locator('#preview')).toContainText('Test Heading');
    await expect(page.locator('#preview')).toContainText('Some test content');
  });

  test('should copy markdown to clipboard', async ({ page }) => {
    // Add some content
    await page.fill('#content', 'Test content for copying');
    
    // Click Edit menu
    await page.locator('.menu-item:has-text("Edit")').click();
    
    // Click Copy Markdown Preview
    await page.locator('text=Copy Markdown Preview').click();
    
    // Check status message
    await expect(page.locator('#status-message')).toContainText('copied');
  });

  test('should maintain UI state independently', async ({ page }) => {
    // Toggle toolbar off
    await page.locator('.menu-item:has-text("View")').click();
    await page.locator('#toolbar-toggle-menu').click();
    
    // Toolbar should be hidden
    await expect(page.locator('#toolbar')).not.toBeVisible();
    
    // But we should still be able to toggle Zen Mode
    await page.locator('.menu-item:has-text("View")').click();
    await page.locator('#zen-toggle-menu').click();
    
    // Fields should now be visible
    await expect(page.locator('#title')).toBeVisible();
  });

  test('should handle tag input', async ({ page }) => {
    // Show all fields first
    await page.locator('.menu-item:has-text("View")').click();
    await page.locator('#zen-toggle-menu').click();
    
    // Add a tag
    await page.fill('#tags-input', 'javascript');
    await page.press('#tags-input', 'Enter');
    
    // Tag should appear in container
    await expect(page.locator('#tags-container')).toContainText('javascript');
    
    // Input should be cleared
    await expect(page.locator('#tags-input')).toHaveValue('');
  });
});