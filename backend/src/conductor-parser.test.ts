import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { identifyConductorFiles, parseSetupState, parseTracksMd, parsePlanMd } from './conductor-parser.js';
import type { GitHubContent } from './conductor-parser.js';

describe('Conductor Parser', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore(); // Restore original console.error
  });

import { GitHubContent } from './conductor-parser.js';
// ...
  it('should identify Conductor files from a list of file paths', () => {
    const fileList: GitHubContent[] = [
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

describe('parseTracksMd', () => {
  it('should parse tracks.md content with a single track', () => {
    const tracksMdContent = `
# Project Tracks

---

## [~] Track: Implement the core Progress Visualization Dashboard
*Link: [./conductor/tracks/dashboard_mvp_20251226/](./conductor/tracks/dashboard_mvp_20251226/)*
    `;
    const expected = {
      tracks: [
        {
          title: 'Implement the core Progress Visualization Dashboard',
          link: './conductor/tracks/dashboard_mvp_20251226/'
        }
      ]
    };
    expect(parseTracksMd(tracksMdContent)).toEqual(expected);
  });

  it('should parse tracks.md content with multiple tracks', () => {
    const tracksMdContent = `
# Project Tracks

This file tracks all major tracks for the project. Each track has its own detailed plan in its respective folder.

---

## [~] Track: Implement the core Progress Visualization Dashboard, including repository integration, Conductor artifact parsing, responsive UI with Control Room aesthetic, key visualizations, and theme switching.
*Link: [./conductor/tracks/dashboard_mvp_20251226/](./conductor/tracks/dashboard_mvp_20251226/)*

---

## [ ] Track: Another Track Example
*Link: [./conductor/tracks/another_track/](./conductor/tracks/another_track/)*
    `;
    const expected = {
      tracks: [
        {
          title: 'Implement the core Progress Visualization Dashboard, including repository integration, Conductor artifact parsing, responsive UI with Control Room aesthetic, key visualizations, and theme switching.',
          link: './conductor/tracks/dashboard_mvp_20251226/'
        },
        {
          title: 'Another Track Example',
          link: './conductor/tracks/another_track/'
        }
      ]
    };
    expect(parseTracksMd(tracksMdContent)).toEqual(expected);
  });

  it('should return an empty array if tracks.md content is empty', () => {
    const tracksMdContent = '';
    const expected = { tracks: [] };
    expect(parseTracksMd(tracksMdContent)).toEqual(expected);
  });

  it('should return an empty array if no tracks are defined in content', () => {
    const tracksMdContent = `
# Project Tracks

This file tracks all major tracks for the project.
    `;
    const expected = { tracks: [] };
    expect(parseTracksMd(tracksMdContent)).toEqual(expected);
  });

  it('should handle malformed track entries by ignoring them or extracting what is possible', () => {
    const tracksMdContent = `
# Project Tracks

## [~] Track: Malformed Track 1
*Link: missing_closing_bracket

## [~] Track: Malformed Track 2
Link: [./conductor/tracks/malformed2/]

## [~] Track: Valid Track
*Link: [./conductor/tracks/valid_track/](./conductor/tracks/valid_track/)*
    `;
    const expected = {
      tracks: [
        {
          title: 'Valid Track',
          link: './conductor/tracks/valid_track/'
        }
      ]
    };
    expect(parseTracksMd(tracksMdContent)).toEqual(expected);
  });
});

describe('parsePlanMd', () => {
  it('should parse a basic plan with one phase and one task', () => {
    const planMdContent = `
# Plan: Basic Plan

## Phase 1: Setup
- [x] Task: Initialize project
    * - [x] Subtask: Create files
    * - [ ] Subtask: Configure settings
    `;
    const expected = {
      title: 'Basic Plan',
      phases: [
        {
          title: 'Phase 1: Setup',
          tasks: [
            {
              description: 'Task: Initialize project',
              status: 'completed',
              subtasks: [
                { description: 'Subtask: Create files', status: 'completed' },
                { description: 'Subtask: Configure settings', status: 'pending' }
              ]
            }
          ]
        }
      ]
    };
    expect(parsePlanMd(planMdContent)).toEqual(expected);
  });

  it('should parse a plan with multiple phases, tasks, and subtasks with different statuses', () => {
    const planMdContent = `
# Plan: Complex Project

## Phase 1: Frontend [checkpoint: abc]

- [x] Task: Implement UI
    * - [x] Subtask: Design layout
    * - [~] Subtask: Develop components
- [ ] Task: Integrate API

## Phase 2: Backend [checkpoint: def]

- [~] Task: Develop API endpoints
    * - [x] Subtask: Define schemas
    * - [ ] Subtask: Write resolvers
- [ ] Task: Database setup
    `;
    const expected = {
      title: 'Complex Project',
      phases: [
        {
          title: 'Phase 1: Frontend',
          checkpoint: 'abc',
          tasks: [
            {
              description: 'Task: Implement UI',
              status: 'completed',
              subtasks: [
                { description: 'Subtask: Design layout', status: 'completed' },
                { description: 'Subtask: Develop components', status: 'in_progress' }
              ]
            },
            {
              description: 'Task: Integrate API',
              status: 'pending',
              subtasks: []
            }
          ]
        },
        {
          title: 'Phase 2: Backend',
          checkpoint: 'def',
          tasks: [
            {
              description: 'Task: Develop API endpoints',
              status: 'in_progress',
              subtasks: [
                { description: 'Subtask: Define schemas', status: 'completed' },
                { description: 'Subtask: Write resolvers', status: 'pending' }
              ]
            },
            {
              description: 'Task: Database setup',
              status: 'pending',
              subtasks: []
            }
          ]
        }
      ]
    };
    expect(parsePlanMd(planMdContent)).toEqual(expected);
  });

  it('should handle a plan with no phases or tasks', () => {
    const planMdContent = `
# Plan: Empty Project
    `;
    const expected = {
      title: 'Empty Project',
      phases: []
    };
    expect(parsePlanMd(planMdContent)).toEqual(expected);
  });

  it('should extract title even if there are no phases', () => {
    const planMdContent = `
# Plan: Title Only
    `;
    const expected = {
      title: 'Title Only',
      phases: []
    };
    expect(parsePlanMd(planMdContent)).toEqual(expected);
  });

  it('should handle malformed entries gracefully', () => {
    const planMdContent = `
# Plan: Malformed Plan

## Phase 1: Broken Tasks

- [x] Malformed Task 1
  * - [x] Malformed Subtask
- Missing Status Task Description
- [ ] Task: Valid Task
  * - [x] Valid Subtask
  * Missing Subtask Status
    `;
    const expected = {
      title: 'Malformed Plan',
      phases: [
        {
          title: 'Phase 1: Broken Tasks',
          tasks: [
            {
              description: 'Task: Valid Task',
              status: 'pending',
              subtasks: [
                { description: 'Valid Subtask', status: 'completed' }
              ]
            }
          ]
        }
      ]
    };
    expect(parsePlanMd(planMdContent)).toEqual(expected);
  });
});
