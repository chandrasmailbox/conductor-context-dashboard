# Plan: Progress Visualization Dashboard MVP

This plan outlines the steps to implement the core Progress Visualization Dashboard.

---

## Phase 1: Setup & Core Infrastructure [checkpoint: 168f7c4]

### Goal
Establish the foundational project structure, set up the development environment for both frontend and backend, and create a basic shell for the application.

### Tasks

*   **1.1  Frontend Project Initialization**
    *   - [x] Task: Write Tests for basic React app setup (e445591)
    *   - [x] Task: Implement React with TypeScript, Vite, and Tailwind CSS setup (17ab1c2)
*   **1.2 Backend Project Initialization**
    *   - [x] Task: Write Tests for basic Express.js server (77cd5aa)
    *   - [x] Task: Implement Node.js with Express.js and TypeScript setup (53e30f0)
*   **1.3 Cross-Environment Configuration**
    *   - [x] Task: Write Tests for environment variable loading (aded2c1)
    *   - [x] Task: Implement shared environment configuration (e.g., .env handling) (c90adba)
*   **1.4 Basic API Endpoint**
    *   - [x] Task: Write Tests for a simple "hello world" API endpoint (a15cbfb)
    *   - [x] Task: Implement a basic API endpoint for backend health check (6902eb3)
*   **1.5 Basic Frontend Shell**
    *   - [x] Task: Write Tests for basic dashboard layout (50c25db)
    *   - [x] Task: Implement the initial responsive dashboard layout with placeholder content (2498de6)
*   - [x] Task: Conductor - User Manual Verification 'Phase 1: Setup & Core Infrastructure' (Protocol in workflow.md)

## Phase 2: Repository Integration & Conductor Parsing

### Goal
Enable the dashboard to connect to a public Git repository, fetch its contents, and parse Google Conductor artifacts to extract relevant project data.

### Tasks

*   **2.1 GitHub API Integration Setup**
    *   - [x] Task: Write Tests for GitHub API client (16c894f)
    *   - [x] Task: Implement GitHub REST API client in backend (3e2787f)
*   **2.2 Repository Cloning/Fetching**
    *   - [x] Task: Write Tests for fetching repository contents (mock Git operations) (3b34f62)
    *   - [x] Task: Implement backend logic to fetch public repository contents (e.g., using `isomorphic-git` or similar) (0244566)
*   **2.3 Conductor Artifact Identification**
    *   - [x] Task: Write Tests for identifying Conductor files (`tracks.md`, `plan.md`, `setup_state.json`) (a9f562f)
    *   - [x] Task: Implement backend logic to locate Conductor artifact files within a repository (4170922)
*   **2.4 `setup_state.json` Parsing**
    *   - [x] Task: Write Tests for parsing `setup_state.json` (6c17772)
    *   - [ ] Task: Implement backend parser for `setup_state.json` to extract `last_successful_step`
*   **2.5 `tracks.md` Parsing**
    *   - [ ] Task: Write Tests for parsing `tracks.md`
    *   - [ ] Task: Implement backend parser for `tracks.md` to extract track descriptions and links
*   **2.6 `plan.md` Parsing**
    *   - [ ] Task: Write Tests for parsing `plan.md`
    *   - [ ] Task: Implement backend parser for `plan.md` to extract phases, tasks, and their statuses
*   **2.7 Automatic Refresh Mechanism**
    *   - [ ] Task: Write Tests for "Sync" button functionality
    *   - [ ] Task: Implement "Sync" button on frontend to trigger data refresh from backend
*   - [ ] Task: Conductor - User Manual Verification 'Phase 2: Repository Integration & Conductor Parsing' (Protocol in workflow.md)

## Phase 3: Progress Model & UI Components

### Goal
Develop the backend data model for progress tracking and create reusable frontend components to display this data effectively.

### Tasks

*   **3.1 Progress Data Model Definition**
    *   - [ ] Task: Write Tests for progress data model (Stages, Tasks, Statuses)
    *   - [ ] Task: Implement backend data structures for normalized progress schema
*   **3.2 Completion Percentage Calculation**
    *   - [ ] Task: Write Tests for completion calculation logic
    *   - [ ] Task: Implement backend logic to calculate completion percentages for tasks, stages, and overall project
*   **3.3 Status Tracking Logic**
    *   - [ ] Task: Write Tests for status tracking (Completed, In Progress, Pending, Blocked)
    *   - [ ] Task: Implement backend logic to derive and assign statuses based on `plan.md` parsing
*   **3.4 Reusable UI Components - Stage Timeline**
    *   - [ ] Task: Write Tests for Stage Timeline component
    *   - [ ] Task: Implement React component for the Stage Timeline (stepper view)
*   **3.5 Reusable UI Components - Task Table**
    *   - [ ] Task: Write Tests for Task Table component
    *   - [ ] Task: Implement React component for the Task Table with sortable columns and status indicators
*   **3.6 Reusable UI Components - Progress Bar**
    *   - [ ] Task: Write Tests for Progress Bar component
    *   - [ ] Task: Implement React component for a customizable progress bar
*   - [ ] Task: Conductor - User Manual Verification 'Phase 3: Progress Model & UI Components' (Protocol in workflow.md)

## Phase 4: Dashboard Assembly & Visualization

### Goal
Integrate all developed components into the main dashboard UI, implement the specified data visualizations, and ensure a cohesive user experience.

### Tasks

*   **4.1 Dashboard Layout Assembly**
    *   - [ ] Task: Write Tests for overall dashboard integration
    *   - [ ] Task: Assemble all UI components (Stage Timeline, Task Table, Progress Bar) into the main dashboard view
*   **4.2 Donut Chart Visualization**
    *   - [ ] Task: Write Tests for Donut Chart component with Recharts
    *   - [ ] Task: Implement Donut Chart using Recharts to display overall completion percentage
*   **4.3 Recent Activity Panel**
    *   - [ ] Task: Write Tests for Recent Activity Panel
    *   - [ ] Task: Implement a panel to display recent commits, extracting data from Git (e.g., commit messages, authors, dates)
*   **4.4 Filtering Functionality**
    *   - [ ] Task: Write Tests for filter logic by status and phase
    *   - [ ] Task: Implement frontend filtering capabilities for task table by status and phase
*   **4.5 Apply Control Room Aesthetic**
    *   - [ ] Task: Write Tests for theme application (visual checks)
    *   - [ ] Task: Ensure the dark theme with high contrast and minimalist layout is consistently applied across the dashboard
*   - [ ] Task: Conductor - User Manual Verification 'Phase 4: Dashboard Assembly & Visualization' (Protocol in workflow.md)

## Phase 5: Theme Switching & Enhancements

### Goal
Provide users with theme customization options and finalize any remaining dashboard enhancements for a polished product.

### Tasks

*   **5.1 Tailwind CSS Theme Configuration**
    *   - [ ] Task: Write Tests for dynamic theme loading
    *   - [ ] Task: Configure Tailwind CSS to support multiple themes
*   **5.2 Theme Selector UI**
    *   - [ ] Task: Write Tests for Theme Selector component
    *   - [ ] Task: Implement a UI component allowing users to select from up to 10 predefined Tailwind CSS themes
*   **5.3 Theme Persistence**
    *   - [ ] Task: Write Tests for theme preference storage
    *   - [ ] Task: Implement logic to persist user's theme preference (e.g., using local storage)
*   **5.4 Responsive Adjustments & Cross-Browser Compatibility**
    *   - [ ] Task: Write Tests for responsive breakpoints and cross-browser consistency
    *   - [ ] Task: Perform final responsive adjustments and ensure cross-browser compatibility
*   **5.5 Comprehensive Error Handling & User Feedback**
    *   - [ ] Task: Write Tests for various error scenarios
    *   - [ ] Task: Implement comprehensive error handling and user-friendly feedback mechanisms
*   - [ ] Task: Conductor - User Manual Verification 'Phase 5: Theme Switching & Enhancements' (Protocol in workflow.md)
