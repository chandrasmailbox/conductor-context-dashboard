# Track Specification: Progress Visualization Dashboard MVP

## 1. Introduction
This specification outlines the minimum viable product (MVP) for the Progress Visualization Dashboard. The primary goal is to provide a clear, actionable overview of project progress from public Git repositories leveraging Google Conductor outputs.

## 2. Functional Requirements

### 2.1 Repository Integration
*   **Input:** Accept a public Git repository URL.
*   **Data Fetching:** Fetch repository contents using the GitHub REST API.
*   **Refresh Mechanism:** Support automatic data refresh via a "Sync" button.

### 2.2 Google Conductor Context Parsing
*   **Artifact Identification:** Identify and read Conductor-related artifacts (`tracks.md`, `plan.md`, `setup_state.json`) from the fetched repository.
*   **Content Parsing:** Parse structured content from these artifacts.
*   **Data Extraction:** Extract application goals, stages, tasks, and commit references.

### 2.3 Progress Model
*   **Schema:** Implement a normalized progress schema for Stages and Tasks.
*   **Completion Calculation:** Calculate completion percentages at task, stage, and overall project levels.
*   **Status Tracking:** Track status for each item (Completed, In Progress, Pending, Blocked).

### 2.4 Dashboard UI
*   **Responsiveness:** Develop a responsive dashboard design.
*   **Aesthetic:** Implement a "Control Room" aesthetic (Dark Theme with High Contrast, Clean and Minimalist Layout).
*   **Progress Bar:** Display an overall progress bar showing completion percentage.
*   **Stage Timeline:** Present a stepper view for the stage timeline.
*   **Task Table:** Include a task table with status indicators.
*   **Recent Activity:** Show a panel for recent commits.
*   **Filtering:** Allow filtering by status and phase.

### 2.5 Visualization
*   **Donut Chart:** Visualize overall completion percentage.
*   **Timeline View:** Display a timeline view for stages.
*   **Status Badges:** Use clear status badges.

### 2.6 Theme Switching
*   **Theme Options:** Provide a selection of up to 10 Tailwind CSS themes.
*   **Toggle:** Allow users to toggle between themes.
*   **Persistence:** Persist theme preference across sessions.

## 3. Non-Functional Requirements

### 3.1 Performance
*   Efficient fetching and parsing of Git repository data.
*   Responsive UI with minimal loading times.

### 3.2 Security
*   Handle public Git repository URLs securely (no authentication required for public repos).
*   Protect against common web vulnerabilities (e.g., XSS, injection).

### 3.3 Usability
*   Intuitive and easy-to-navigate interface.
*   Clear labels, tooltips, and engaging, action-oriented content.

### 3.4 Maintainability
*   Clean, well-documented code following established style guides (JavaScript, TypeScript, HTML/CSS, General).
*   Modular architecture to facilitate future enhancements.

## 4. Technology Stack
*   **Frontend:** React with TypeScript, Vite, Recharts, Tailwind CSS.
*   **Backend:** Node.js with Express.js, TypeScript.
*   **Data Source:** Git repository Conductor artifacts (no traditional database).

## 5. Visual Identity & Guidelines
*   **Prose Style:** Engaging and Action-Oriented.
*   **Brand Messaging:** Professional and Formal.
*   **Visual Identity:** Clean and Minimalist Layout, Dark Theme with High Contrast.
*   **Data Presentation:** Interactive Charts/Graphs, Color-coding for Status, Clear Labels/Tooltips.
*   **Content Guidelines:** Focus on Actionability, Maintain Consistency.