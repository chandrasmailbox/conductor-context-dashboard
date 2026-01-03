# Plan: Local Mode Implementation

This plan outlines the steps to implement Local Mode, enabling the dashboard to read data from the local filesystem.

## Phase 1: Backend Local Support

- [x] Task: 1.1 Local File Service
    * - [x] Task: Write Tests for local file reading (handling absolute/relative paths, security checks)
    * - [x] Task: Implement service to read files from the local disk
- [ ] Task: 1.2 Local Git Service
    * - [ ] Task: Write Tests for fetching local git commits via shell commands
    * - [ ] Task: Implement service to extract commit history from a local repository
- [ ] Task: 1.3 Local Sync Endpoint
    * - [ ] Task: Write Tests for `POST /api/v1/sync-local`
    * - [ ] Task: Implement the local sync endpoint to coordinate file reading and parsing
- [ ] Task:  Conductor - User Manual Verification 'Phase 1: Backend Local Support'

---

## Phase 2: Frontend Integration

- [ ] Task: 2.1 Mode Toggle Component
    * - [ ] Task: Write Tests for the mode toggle (GitHub vs Local)
    * - [ ] Task: Implement a UI component to switch between modes
- [ ] Task: 2.2 Local Sync Logic
    * - [ ] Task: Write Tests for frontend local sync triggering
    * - [ ] Task: Update App.tsx to handle local sync requests and state
- [ ] Task: 2.3 Path Selection Enhancements
    * - [ ] Task: Write Tests for path input validation
    * - [ ] Task: Improve UI to handle local directory paths effectively
- [ ] Task:  Conductor - User Manual Verification 'Phase 2: Frontend Integration'
