// Manual AI Settings Evaluation Script
// Run this in browser console to test AI settings functionality

console.log('🔍 Starting AI Settings Manual Evaluation...\n');

// Test 1: Check if settings modal elements exist
console.log('1. Checking Settings Modal Elements:');
const settingsModal = document.getElementById('settings-modal');
const ollamaEndpoint = document.getElementById('ollama-endpoint');
const fetchModelsBtn = document.getElementById('fetch-models');
const preferredModel = document.getElementById('preferred-model');

console.log('✓ Settings modal exists:', !!settingsModal);
console.log('✓ Ollama endpoint input exists:', !!ollamaEndpoint);
console.log('✓ Fetch models button exists:', !!fetchModelsBtn);
console.log('✓ Preferred model select exists:', !!preferredModel);

// Test 2: Check initial values
console.log('\n2. Initial Values:');
if (ollamaEndpoint) {
    console.log('✓ Default endpoint:', ollamaEndpoint.value);
}

// Test 3: Check localStorage for persisted settings
console.log('\n3. Checking Persisted Settings:');
const storedSettings = localStorage.getItem('aiSettings');
console.log('✓ Stored AI settings:', storedSettings);

// Test 4: Test modal opening
console.log('\n4. Testing Modal Opening:');
function openSettingsModal() {
    const settingsAction = document.querySelector('[data-action="settings"]');
    if (settingsAction) {
        settingsAction.click();
        console.log('✓ Settings action clicked');
        setTimeout(() => {
            const modalStyle = window.getComputedStyle(settingsModal);
            console.log('✓ Modal display:', modalStyle.display);
            console.log('✓ Modal visible:', modalStyle.display !== 'none');
        }, 100);
    } else {
        console.log('❌ Settings action not found');
    }
}

// Test 5: Test endpoint validation
console.log('\n5. Testing Endpoint Validation:');
function testEndpointValidation() {
    if (ollamaEndpoint) {
        ollamaEndpoint.value = 'invalid-url';
        ollamaEndpoint.dispatchEvent(new Event('blur'));
        setTimeout(() => {
            const validationState = ollamaEndpoint.checkValidity();
            console.log('✓ Invalid URL validation:', !validationState);
        }, 100);
        
        ollamaEndpoint.value = 'http://localhost:11434';
        ollamaEndpoint.dispatchEvent(new Event('blur'));
        setTimeout(() => {
            const validationState = ollamaEndpoint.checkValidity();
            console.log('✓ Valid URL validation:', validationState);
        }, 200);
    }
}

// Test 6: Current toolbar assessment
console.log('\n6. Toolbar Assessment:');
const toolbar = document.querySelector('.toolbar');
const toolbarButtons = document.querySelectorAll('.toolbar-button');
console.log('✓ Toolbar exists:', !!toolbar);
console.log('✓ Number of toolbar buttons:', toolbarButtons.length);
console.log('✓ Toolbar visible:', toolbar ? window.getComputedStyle(toolbar).display !== 'none' : false);

toolbarButtons.forEach((btn, i) => {
    const icon = btn.querySelector('i');
    const title = btn.getAttribute('title');
    console.log(`  Button ${i+1}: ${title} (${icon ? icon.className : 'no icon'})`);
});

// Test 7: Menu structure assessment
console.log('\n7. Menu Structure:');
const menuBar = document.querySelector('.menu-bar');
const menuItems = document.querySelectorAll('.menu-item');
console.log('✓ Menu bar exists:', !!menuBar);
console.log('✓ Number of menu items:', menuItems.length);

menuItems.forEach((item, i) => {
    const title = item.querySelector('.menu-title')?.textContent;
    const actions = item.querySelectorAll('.menu-action');
    console.log(`  Menu ${i+1}: "${title}" (${actions.length} actions)`);
});

// Execute tests
console.log('\n🚀 Running tests...\n');
testEndpointValidation();

console.log('\n📋 Manual test functions available:');
console.log('- openSettingsModal(): Opens the settings modal');
console.log('- testEndpointValidation(): Tests URL validation');

console.log('\n✅ Manual evaluation completed. Check console for results.');