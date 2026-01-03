# Plan: Local Mode Implementation

This plan outlines the steps to implement Local Mode, enabling the dashboard to read data from the local filesystem.

## Phase 1: Backend Local Support [checkpoint: 3f28fa9]

- [x] Task: 1.1 Local File Service (556d2dd)
    * - [x] Task: Write Tests for local file reading (handling absolute/relative paths, security checks)
    * - [x] Task: Implement service to read files from the local disk
- [x] Task: 1.2 Local Git Service (f284f95)
    * - [x] Task: Write Tests for fetching local git commits via shell commands
    * - [x] Task: Implement service to extract commit history from a local repository
- [x] Task: 1.3 Local Sync Endpoint (7ae996e)
    * - [x] Task: Write Tests for `POST /api/v1/sync-local`
    * - [x] Task: Implement the local sync endpoint to coordinate file reading and parsing
- [x] Task:  Conductor - User Manual Verification 'Phase 1: Backend Local Support' (3f28fa9)

---

## Phase 2: Frontend Integration

- [x] Task: 2.1 Mode Toggle Component
    * - [x] Task: Write Tests for the mode toggle (GitHub vs Local)
    * - [x] Task: Implement a UI component to switch between modes
- [ ] Task: 2.2 Local Sync Logic
    * - [ ] Task: Write Tests for frontend local sync triggering
    * - [ ] Task: Update App.tsx to handle local sync requests and state
- [ ] Task: 2.3 Path Selection Enhancements
    * - [ ] Task: Write Tests for path input validation
    * - [ ] Task: Improve UI to handle local directory paths effectively
- [ ] Task:  Conductor - User Manual Verification 'Phase 2: Frontend Integration'
