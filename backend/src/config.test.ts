// backend/src/config.test.ts
describe('Config', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    // Save original process.env
    originalEnv = process.env;
    // Clear module cache for config.ts before each test
    jest.resetModules();
  });

  afterEach(() => {
    // Restore original process.env
    process.env = originalEnv;
  });

  it('should have a default PORT of 3000 if not specified', () => {
    // Temporarily unset PORT to test default
    process.env = { ...originalEnv }; // Create a mutable copy
    delete process.env.PORT;
    const { config } = require('./config');
    expect(config.PORT).toBe(3000);
  });

  it('should load PORT from environment variables', () => {
    // Temporarily set PORT to test loading from env
    process.env = { ...originalEnv, PORT: '4000' };
    const { config } = require('./config');
    expect(config.PORT).toBe(4000);
  });

  it('should have a default NODE_ENV of "development" if not specified', () => {
    // Temporarily unset NODE_ENV to test default
    process.env = { ...originalEnv }; // Create a mutable copy
    delete process.env.NODE_ENV;
    const { config } = require('./config');
    expect(config.NODE_ENV).toBe('development');
  });

  it('should load NODE_ENV from environment variables', () => {
    // Temporarily set NODE_ENV to test loading from env
    process.env = { ...originalEnv, NODE_ENV: 'production' };
    const { config } = require('./config');
    expect(config.NODE_ENV).toBe('production');
  });
});
