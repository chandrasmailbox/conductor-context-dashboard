import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';

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

  it('should have a default PORT of 3000 if not specified', async () => {
    // Temporarily unset PORT to test default
    process.env = { ...originalEnv }; // Create a mutable copy
    delete process.env.PORT;
    const { config } = await import('./config.js');
    expect(config.PORT).toBe(3000);
  });

  it('should load PORT from environment variables', async () => {
    // Temporarily set PORT to test loading from env
    process.env = { ...originalEnv, PORT: '4000' };
    const { config } = await import('./config.js');
    expect(config.PORT).toBe(4000);
  });

  it('should have a default NODE_ENV of "development" if not specified', async () => {
    // Temporarily unset NODE_ENV to test default
    process.env = { ...originalEnv }; // Create a mutable copy
    delete process.env.NODE_ENV;
    const { config } = await import('./config.js');
    expect(config.NODE_ENV).toBe('development');
  });

  it('should load NODE_ENV from environment variables', async () => {
    // Temporarily set NODE_ENV to test loading from env
    process.env = { ...originalEnv, NODE_ENV: 'production' };
    const { config } = await import('./config.js');
    expect(config.NODE_ENV).toBe('production');
  });
});