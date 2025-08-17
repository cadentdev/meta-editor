require('@testing-library/jest-dom');

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock navigator.clipboard
global.navigator.clipboard = {
  writeText: jest.fn(() => Promise.resolve()),
};

// Mock window.alert and window.confirm
global.alert = jest.fn();
global.confirm = jest.fn(() => true);

// Mock URL.createObjectURL and URL.revokeObjectURL
global.URL.createObjectURL = jest.fn(() => 'mocked-object-url');
global.URL.revokeObjectURL = jest.fn();

// Mock FileReader
global.FileReader = class {
  constructor() {
    this.result = null;
    this.onload = null;
  }
  
  readAsDataURL(file) {
    this.result = `data:image/jpeg;base64,mockdata`;
    if (this.onload) {
      this.onload({ target: { result: this.result } });
    }
  }
  
  readAsText(file) {
    this.result = 'mock file content';
    if (this.onload) {
      this.onload({ target: { result: this.result } });
    }
  }
};

// Mock marked library
global.marked = {
  parse: jest.fn((content) => `<p>${content}</p>`),
};

// Mock js-yaml library
global.jsyaml = {
  load: jest.fn((content) => ({
    Title: 'Test Title',
    Date: '2023-01-01 12:00',
    Tags: 'test, javascript',
    Summary: 'Test summary'
  })),
};

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  localStorageMock.getItem.mockReturnValue(null);
});