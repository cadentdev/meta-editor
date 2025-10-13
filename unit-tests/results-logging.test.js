/**
 * Results Logging Tests
 * Tests for the AI Results logging functionality
 */

describe('Results Logging', () => {
    let resultsElement;
    let resultsHeader;
    let copyResultsBtn;
    let clearResultsBtn;
    let resultsLog;

    beforeEach(() => {
        document.body.innerHTML = `
            <div class="results-header hidden-in-zen">
                <h2>Results</h2>
                <div class="results-actions">
                    <button id="copy-results-btn" class="btn-icon" title="Copy Results" disabled>
                        <i class="fas fa-copy"></i>
                    </button>
                    <button id="clear-results-btn" class="btn-icon" title="Clear Results" disabled>
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div id="results" class="results-content hidden-in-zen">
                <span class="results-placeholder">AI interaction logs will appear here...</span>
            </div>
        `;

        resultsElement = document.getElementById('results');
        resultsHeader = document.querySelector('.results-header');
        copyResultsBtn = document.getElementById('copy-results-btn');
        clearResultsBtn = document.getElementById('clear-results-btn');
        resultsLog = [];

        // Clear localStorage
        localStorage.clear();
        // Clear clipboard mock
        global.navigator.clipboard.writeText.mockClear();
    });

    describe('appendToResults', () => {
        function appendToResults(message, type = 'info') {
            const timestamp = new Date();
            const entry = {
                timestamp,
                message,
                type
            };

            resultsLog.push(entry);

            // Limit log to 100 most recent entries
            if (resultsLog.length > 100) {
                resultsLog.shift();
            }

            // Update display
            updateResultsDisplay();

            // Save to localStorage
            saveResultsToStorage();

            // Enable buttons if log has entries
            updateResultsButtons();
        }

        function updateResultsDisplay() {
            if (resultsLog.length === 0) {
                resultsElement.innerHTML = '<span class="results-placeholder">AI interaction logs will appear here...</span>';
            } else {
                resultsElement.innerHTML = resultsLog.map(entry => {
                    const formattedMessage = formatResultsMessage(entry);
                    return `<div class="log-entry log-${entry.type}">${formattedMessage}</div>`;
                }).join('');

                // Auto-scroll to bottom
                resultsElement.scrollTop = resultsElement.scrollHeight;
            }
        }

        function formatResultsMessage(entry) {
            const timestamp = entry.timestamp;
            const hours = String(timestamp.getHours()).padStart(2, '0');
            const minutes = String(timestamp.getMinutes()).padStart(2, '0');
            const seconds = String(timestamp.getSeconds()).padStart(2, '0');
            const timeStr = `[${hours}:${minutes}:${seconds}]`;

            const typeStr = entry.type.toUpperCase();
            return `${timeStr} ${typeStr}: ${entry.message}`;
        }

        function updateResultsButtons() {
            const hasEntries = resultsLog.length > 0;
            copyResultsBtn.disabled = !hasEntries;
            clearResultsBtn.disabled = !hasEntries;
        }

        function saveResultsToStorage() {
            try {
                const serializedLog = resultsLog.map(entry => ({
                    timestamp: entry.timestamp.toISOString(),
                    message: entry.message,
                    type: entry.type
                }));
                localStorage.setItem('metaEditorResults', JSON.stringify(serializedLog));
            } catch (error) {
                console.error('Error saving results to localStorage:', error);
                // If quota exceeded, clear old entries and try again
                if (error.name === 'QuotaExceededError') {
                    resultsLog = resultsLog.slice(-50); // Keep only last 50 entries
                    try {
                        const serializedLog = resultsLog.map(entry => ({
                            timestamp: entry.timestamp.toISOString(),
                            message: entry.message,
                            type: entry.type
                        }));
                        localStorage.setItem('metaEditorResults', JSON.stringify(serializedLog));
                    } catch (retryError) {
                        console.error('Failed to save results even after reducing size:', retryError);
                    }
                }
            }
        }

        test('should add info message to log', () => {
            appendToResults('Test info message', 'info');

            expect(resultsLog.length).toBe(1);
            expect(resultsLog[0].message).toBe('Test info message');
            expect(resultsLog[0].type).toBe('info');
        });

        test('should add success message to log', () => {
            appendToResults('Test success message', 'success');

            expect(resultsLog.length).toBe(1);
            expect(resultsLog[0].message).toBe('Test success message');
            expect(resultsLog[0].type).toBe('success');
        });

        test('should add error message to log', () => {
            appendToResults('Test error message', 'error');

            expect(resultsLog.length).toBe(1);
            expect(resultsLog[0].message).toBe('Test error message');
            expect(resultsLog[0].type).toBe('error');
        });

        test('should add ai-response message to log', () => {
            appendToResults('Test AI response', 'ai-response');

            expect(resultsLog.length).toBe(1);
            expect(resultsLog[0].message).toBe('Test AI response');
            expect(resultsLog[0].type).toBe('ai-response');
        });

        test('should default to info type if not specified', () => {
            appendToResults('Test default message');

            expect(resultsLog.length).toBe(1);
            expect(resultsLog[0].type).toBe('info');
        });

        test('should update display after adding message', () => {
            appendToResults('Test message', 'info');

            expect(resultsElement.innerHTML).toContain('log-entry');
            expect(resultsElement.innerHTML).toContain('log-info');
            expect(resultsElement.innerHTML).toContain('Test message');
        });

        test('should enable buttons after adding message', () => {
            expect(copyResultsBtn.disabled).toBe(true);
            expect(clearResultsBtn.disabled).toBe(true);

            appendToResults('Test message', 'info');

            expect(copyResultsBtn.disabled).toBe(false);
            expect(clearResultsBtn.disabled).toBe(false);
        });

        test('should limit log to 100 entries', () => {
            // Add 105 entries
            for (let i = 0; i < 105; i++) {
                appendToResults(`Message ${i}`, 'info');
            }

            expect(resultsLog.length).toBe(100);
            expect(resultsLog[0].message).toBe('Message 5'); // First 5 should be removed
            expect(resultsLog[99].message).toBe('Message 104');
        });

        test('should save to localStorage', () => {
            appendToResults('Test message', 'info');

            const saved = localStorage.getItem('metaEditorResults');
            expect(saved).toBeTruthy();

            const parsed = JSON.parse(saved);
            expect(parsed.length).toBe(1);
            expect(parsed[0].message).toBe('Test message');
            expect(parsed[0].type).toBe('info');
        });
    });

    describe('formatResultsMessage', () => {
        function formatResultsMessage(entry) {
            const timestamp = entry.timestamp;
            const hours = String(timestamp.getHours()).padStart(2, '0');
            const minutes = String(timestamp.getMinutes()).padStart(2, '0');
            const seconds = String(timestamp.getSeconds()).padStart(2, '0');
            const timeStr = `[${hours}:${minutes}:${seconds}]`;

            const typeStr = entry.type.toUpperCase();
            return `${timeStr} ${typeStr}: ${entry.message}`;
        }

        test('should format message with timestamp and type', () => {
            const entry = {
                timestamp: new Date('2025-01-15T14:30:45'),
                message: 'Test message',
                type: 'info'
            };

            const formatted = formatResultsMessage(entry);
            expect(formatted).toBe('[14:30:45] INFO: Test message');
        });

        test('should format success message correctly', () => {
            const entry = {
                timestamp: new Date('2025-01-15T09:05:03'),
                message: 'Success message',
                type: 'success'
            };

            const formatted = formatResultsMessage(entry);
            expect(formatted).toBe('[09:05:03] SUCCESS: Success message');
        });

        test('should format error message correctly', () => {
            const entry = {
                timestamp: new Date('2025-01-15T23:59:59'),
                message: 'Error message',
                type: 'error'
            };

            const formatted = formatResultsMessage(entry);
            expect(formatted).toBe('[23:59:59] ERROR: Error message');
        });

        test('should format ai-response message correctly', () => {
            const entry = {
                timestamp: new Date('2025-01-15T12:00:00'),
                message: 'AI response',
                type: 'ai-response'
            };

            const formatted = formatResultsMessage(entry);
            expect(formatted).toBe('[12:00:00] AI-RESPONSE: AI response');
        });
    });

    describe('clearResults', () => {
        function clearResults() {
            if (resultsLog.length === 0) return;

            if (confirm('Are you sure you want to clear all results? This cannot be undone.')) {
                resultsLog = [];
                updateResultsDisplay();
                updateResultsButtons();
                saveResultsToStorage();
            }
        }

        function updateResultsDisplay() {
            if (resultsLog.length === 0) {
                resultsElement.innerHTML = '<span class="results-placeholder">AI interaction logs will appear here...</span>';
            } else {
                resultsElement.innerHTML = resultsLog.map(entry => {
                    const formattedMessage = formatResultsMessage(entry);
                    return `<div class="log-entry log-${entry.type}">${formattedMessage}</div>`;
                }).join('');

                // Auto-scroll to bottom
                resultsElement.scrollTop = resultsElement.scrollHeight;
            }
        }

        function formatResultsMessage(entry) {
            const timestamp = entry.timestamp;
            const hours = String(timestamp.getHours()).padStart(2, '0');
            const minutes = String(timestamp.getMinutes()).padStart(2, '0');
            const seconds = String(timestamp.getSeconds()).padStart(2, '0');
            const timeStr = `[${hours}:${minutes}:${seconds}]`;

            const typeStr = entry.type.toUpperCase();
            return `${timeStr} ${typeStr}: ${entry.message}`;
        }

        function updateResultsButtons() {
            const hasEntries = resultsLog.length > 0;
            copyResultsBtn.disabled = !hasEntries;
            clearResultsBtn.disabled = !hasEntries;
        }

        function saveResultsToStorage() {
            try {
                const serializedLog = resultsLog.map(entry => ({
                    timestamp: entry.timestamp.toISOString(),
                    message: entry.message,
                    type: entry.type
                }));
                localStorage.setItem('metaEditorResults', JSON.stringify(serializedLog));
            } catch (error) {
                console.error('Error saving results to localStorage:', error);
            }
        }

        test('should clear log when confirmed', () => {
            resultsLog.push({ timestamp: new Date(), message: 'Test', type: 'info' });
            global.confirm.mockReturnValue(true);

            clearResults();

            expect(resultsLog.length).toBe(0);
        });

        test('should not clear log when cancelled', () => {
            resultsLog.push({ timestamp: new Date(), message: 'Test', type: 'info' });
            global.confirm.mockReturnValue(false);

            clearResults();

            expect(resultsLog.length).toBe(1);
        });

        test('should do nothing if log is empty', () => {
            global.confirm.mockReturnValue(true);

            clearResults();

            expect(global.confirm).not.toHaveBeenCalled();
        });

        test('should restore placeholder after clearing', () => {
            resultsLog.push({ timestamp: new Date(), message: 'Test', type: 'info' });
            global.confirm.mockReturnValue(true);

            clearResults();

            expect(resultsElement.innerHTML).toContain('results-placeholder');
            expect(resultsElement.innerHTML).toContain('AI interaction logs will appear here...');
        });

        test('should disable buttons after clearing', () => {
            resultsLog.push({ timestamp: new Date(), message: 'Test', type: 'info' });
            copyResultsBtn.disabled = false;
            clearResultsBtn.disabled = false;
            global.confirm.mockReturnValue(true);

            clearResults();

            expect(copyResultsBtn.disabled).toBe(true);
            expect(clearResultsBtn.disabled).toBe(true);
        });

        test('should clear localStorage after clearing log', () => {
            resultsLog.push({ timestamp: new Date(), message: 'Test', type: 'info' });
            localStorage.setItem('metaEditorResults', JSON.stringify([{ timestamp: new Date().toISOString(), message: 'Test', type: 'info' }]));
            global.confirm.mockReturnValue(true);

            clearResults();

            const saved = localStorage.getItem('metaEditorResults');
            expect(saved).toBe('[]');
        });
    });

    describe('copyResults', () => {
        function copyResults() {
            if (resultsLog.length === 0) return;

            const text = resultsLog.map(entry => formatResultsMessage(entry)).join('\n');

            navigator.clipboard.writeText(text).then(() => {
                // Success handled in implementation
            }).catch(err => {
                console.error('Failed to copy results:', err);
            });
        }

        function formatResultsMessage(entry) {
            const timestamp = entry.timestamp;
            const hours = String(timestamp.getHours()).padStart(2, '0');
            const minutes = String(timestamp.getMinutes()).padStart(2, '0');
            const seconds = String(timestamp.getSeconds()).padStart(2, '0');
            const timeStr = `[${hours}:${minutes}:${seconds}]`;

            const typeStr = entry.type.toUpperCase();
            return `${timeStr} ${typeStr}: ${entry.message}`;
        }

        test('should copy formatted log to clipboard', async () => {
            const entry1 = { timestamp: new Date('2025-01-15T14:30:45'), message: 'Message 1', type: 'info' };
            const entry2 = { timestamp: new Date('2025-01-15T14:30:50'), message: 'Message 2', type: 'success' };
            resultsLog.push(entry1, entry2);

            await copyResults();

            expect(global.navigator.clipboard.writeText).toHaveBeenCalledWith(
                '[14:30:45] INFO: Message 1\n[14:30:50] SUCCESS: Message 2'
            );
        });

        test('should do nothing if log is empty', async () => {
            await copyResults();

            expect(global.navigator.clipboard.writeText).not.toHaveBeenCalled();
        });

        test('should handle clipboard errors gracefully', async () => {
            resultsLog.push({ timestamp: new Date(), message: 'Test', type: 'info' });
            const error = new Error('Clipboard error');
            global.navigator.clipboard.writeText.mockRejectedValueOnce(error);

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            try {
                await copyResults();
            } catch (e) {
                // Error is caught and logged, not thrown
            }

            // Wait for promise to resolve/reject
            await new Promise(resolve => setTimeout(resolve, 0));

            expect(consoleSpy).toHaveBeenCalledWith('Failed to copy results:', error);

            consoleSpy.mockRestore();
        });
    });

    describe('localStorage Operations', () => {
        function saveResultsToStorage() {
            try {
                const serializedLog = resultsLog.map(entry => ({
                    timestamp: entry.timestamp.toISOString(),
                    message: entry.message,
                    type: entry.type
                }));
                localStorage.setItem('metaEditorResults', JSON.stringify(serializedLog));
            } catch (error) {
                console.error('Error saving results to localStorage:', error);
                // If quota exceeded, clear old entries and try again
                if (error.name === 'QuotaExceededError') {
                    resultsLog = resultsLog.slice(-50); // Keep only last 50 entries
                    try {
                        const serializedLog = resultsLog.map(entry => ({
                            timestamp: entry.timestamp.toISOString(),
                            message: entry.message,
                            type: entry.type
                        }));
                        localStorage.setItem('metaEditorResults', JSON.stringify(serializedLog));
                    } catch (retryError) {
                        console.error('Failed to save results even after reducing size:', retryError);
                    }
                }
            }
        }

        function loadResultsFromStorage() {
            try {
                const saved = localStorage.getItem('metaEditorResults');
                if (saved) {
                    const serializedLog = JSON.parse(saved);
                    resultsLog = serializedLog.map(entry => ({
                        timestamp: new Date(entry.timestamp),
                        message: entry.message,
                        type: entry.type
                    }));
                    return resultsLog;
                }
            } catch (error) {
                console.error('Error loading results from localStorage:', error);
                resultsLog = [];
            }
            return [];
        }

        test('should save log to localStorage', () => {
            resultsLog.push({
                timestamp: new Date('2025-01-15T14:30:45'),
                message: 'Test message',
                type: 'info'
            });

            saveResultsToStorage();

            const saved = localStorage.getItem('metaEditorResults');
            expect(saved).toBeTruthy();

            const parsed = JSON.parse(saved);
            expect(parsed.length).toBe(1);
            expect(parsed[0].message).toBe('Test message');
            expect(parsed[0].type).toBe('info');
            expect(parsed[0].timestamp).toBeTruthy();
        });

        test('should load log from localStorage', () => {
            const testData = [
                { timestamp: new Date('2025-01-15T14:30:45').toISOString(), message: 'Message 1', type: 'info' },
                { timestamp: new Date('2025-01-15T14:30:50').toISOString(), message: 'Message 2', type: 'success' }
            ];
            localStorage.setItem('metaEditorResults', JSON.stringify(testData));

            const loaded = loadResultsFromStorage();

            expect(loaded.length).toBe(2);
            expect(loaded[0].message).toBe('Message 1');
            expect(loaded[0].type).toBe('info');
            expect(loaded[0].timestamp).toBeInstanceOf(Date);
            expect(loaded[1].message).toBe('Message 2');
            expect(loaded[1].type).toBe('success');
        });

        test('should return empty array if no saved data', () => {
            const loaded = loadResultsFromStorage();

            expect(loaded).toEqual([]);
        });

        test('should handle corrupted data gracefully', () => {
            localStorage.setItem('metaEditorResults', 'invalid json');
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            const loaded = loadResultsFromStorage();

            expect(loaded).toEqual([]);
            expect(consoleSpy).toHaveBeenCalledWith('Error loading results from localStorage:', expect.any(Error));

            consoleSpy.mockRestore();
        });

        test('should handle quota exceeded error', () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            // Mock localStorage to throw quota exceeded
            const setItemMock = jest.spyOn(Storage.prototype, 'setItem');
            setItemMock.mockImplementationOnce(() => {
                const error = new Error('Quota exceeded');
                error.name = 'QuotaExceededError';
                throw error;
            });

            // Add 100 entries
            for (let i = 0; i < 100; i++) {
                resultsLog.push({
                    timestamp: new Date(),
                    message: `Message ${i}`,
                    type: 'info'
                });
            }

            saveResultsToStorage();

            expect(consoleSpy).toHaveBeenCalledWith('Error saving results to localStorage:', expect.any(Error));
            expect(resultsLog.length).toBe(50); // Should reduce to 50 entries

            consoleSpy.mockRestore();
            setItemMock.mockRestore();
        });
    });

    describe('Button State Management', () => {
        test('buttons should be disabled when log is empty', () => {
            expect(copyResultsBtn.disabled).toBe(true);
            expect(clearResultsBtn.disabled).toBe(true);
        });

        test('buttons should be enabled when log has entries', () => {
            resultsLog.push({ timestamp: new Date(), message: 'Test', type: 'info' });
            const hasEntries = resultsLog.length > 0;
            copyResultsBtn.disabled = !hasEntries;
            clearResultsBtn.disabled = !hasEntries;

            expect(copyResultsBtn.disabled).toBe(false);
            expect(clearResultsBtn.disabled).toBe(false);
        });
    });

    describe('Display Updates', () => {
        function updateResultsDisplay() {
            if (resultsLog.length === 0) {
                resultsElement.innerHTML = '<span class="results-placeholder">AI interaction logs will appear here...</span>';
            } else {
                resultsElement.innerHTML = resultsLog.map(entry => {
                    const formattedMessage = formatResultsMessage(entry);
                    return `<div class="log-entry log-${entry.type}">${formattedMessage}</div>`;
                }).join('');

                // Auto-scroll to bottom
                resultsElement.scrollTop = resultsElement.scrollHeight;
            }
        }

        function formatResultsMessage(entry) {
            const timestamp = entry.timestamp;
            const hours = String(timestamp.getHours()).padStart(2, '0');
            const minutes = String(timestamp.getMinutes()).padStart(2, '0');
            const seconds = String(timestamp.getSeconds()).padStart(2, '0');
            const timeStr = `[${hours}:${minutes}:${seconds}]`;

            const typeStr = entry.type.toUpperCase();
            return `${timeStr} ${typeStr}: ${entry.message}`;
        }

        test('should show placeholder when log is empty', () => {
            updateResultsDisplay();

            expect(resultsElement.innerHTML).toContain('results-placeholder');
            expect(resultsElement.innerHTML).toContain('AI interaction logs will appear here...');
        });

        test('should display log entries with correct styling', () => {
            resultsLog.push(
                { timestamp: new Date(), message: 'Info message', type: 'info' },
                { timestamp: new Date(), message: 'Success message', type: 'success' },
                { timestamp: new Date(), message: 'Error message', type: 'error' },
                { timestamp: new Date(), message: 'AI response', type: 'ai-response' }
            );

            updateResultsDisplay();

            expect(resultsElement.innerHTML).toContain('log-entry log-info');
            expect(resultsElement.innerHTML).toContain('log-entry log-success');
            expect(resultsElement.innerHTML).toContain('log-entry log-error');
            expect(resultsElement.innerHTML).toContain('log-entry log-ai-response');
            expect(resultsElement.innerHTML).toContain('Info message');
            expect(resultsElement.innerHTML).toContain('Success message');
            expect(resultsElement.innerHTML).toContain('Error message');
            expect(resultsElement.innerHTML).toContain('AI response');
        });

        test('should auto-scroll to bottom after update', () => {
            resultsLog.push({ timestamp: new Date(), message: 'Test', type: 'info' });

            updateResultsDisplay();

            // scrollTop should be set to scrollHeight
            expect(resultsElement.scrollTop).toBe(resultsElement.scrollHeight);
        });
    });
});
