// backend/src/config.test.ts
import { getConfig } from './config';

describe('Config', () => {
  it('should load TEST_VAR from environment variables', () => {
    // This test expects TEST_VAR to be 'test_value' when loaded.
    // It should fail initially because TEST_VAR is not set in the test environment.
    expect(getConfig().TEST_VAR).toBe('test_value');
  });
});
