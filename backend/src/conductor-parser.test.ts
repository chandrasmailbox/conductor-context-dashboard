// backend/src/conductor-parser.test.ts
import { identifyConductorFiles, parseSetupState } from './conductor-parser';

describe('Conductor Parser', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore(); // Restore original console.error
  });

  it('should identify Conductor files from a list of file paths', () => {
    const fileList = [
      { name: 'README.md', path: 'README.md', type: 'file' },
      { name: 'src', path: 'src', type: 'dir' },
      { name: 'conductor', path: 'conductor', type: 'dir' },
      { name: 'tracks.md', path: 'conductor/tracks.md', type: 'file' },
      { name: 'plan.md', path: 'conductor/tracks/dashboard_mvp_20251226/plan.md', type: 'file' },
      { name: 'setup_state.json', path: 'conductor/setup_state.json', type: 'file' },
      { name: 'some-other-file.txt', path: 'conductor/some-other-file.txt', type: 'file' },
    ];

    const expectedConductorFiles = [
      { name: 'tracks.md', path: 'conductor/tracks.md', type: 'file' },
      { name: 'plan.md', path: 'conductor/tracks/dashboard_mvp_20251226/plan.md', type: 'file' },
      { name: 'setup_state.json', path: 'conductor/setup_state.json', type: 'file' },
    ];

    const identifiedFiles = identifyConductorFiles(fileList);
    expect(identifiedFiles).toEqual(expectedConductorFiles);
  });

  it('should parse setup_state.json content and extract last_successful_step', () => {
    const setupStateContent = `{ "last_successful_step": "Phase 1: Setup & Core Infrastructure" }`;
    const expectedLastSuccessfulStep = 'Phase 1: Setup & Core Infrastructure';

    const lastSuccessfulStep = parseSetupState(setupStateContent);
    expect(lastSuccessfulStep).toEqual(expectedLastSuccessfulStep);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('should throw an error for invalid setup_state.json content', () => {
    const invalidContent = `{ "last_successful_step": "Phase 1: Setup & Core Infrastructure" `; // Malformed JSON

    expect(() => parseSetupState(invalidContent)).toThrow('Failed to parse setup_state.json');
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error parsing setup_state.json:',
      expect.any(Error)
    );
  });

  it('should throw an error if last_successful_step is missing in setup_state.json', () => {
    const missingPropertyContent = `{ "some_other_property": "value" }`;

    expect(() => parseSetupState(missingPropertyContent)).toThrow('Failed to parse setup_state.json');
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error parsing setup_state.json:',
      expect.any(Error)
    );
  });
});
