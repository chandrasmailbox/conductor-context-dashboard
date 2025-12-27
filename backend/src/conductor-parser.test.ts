// backend/src/conductor-parser.test.ts
import { identifyConductorFiles } from './conductor-parser';

describe('Conductor Parser', () => {
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

    // This test will fail because identifyConductorFiles is not yet implemented
    const identifiedFiles = identifyConductorFiles(fileList);
    expect(identifiedFiles).toEqual(expectedConductorFiles);
  });
});
