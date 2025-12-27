# Initial Concept

Build a Progress Visualization Dashboard from a Public Git Repo Using Google Conductor Outputs.

# Key Features

*   **Repository Integration**
    *   Accept a public Git repository URL as input
    *   Fetch repository contents using the GitHub REST API
    *   Support automatic refresh via "Sync" button
*   **Google Conductor Context Parsing**
    *   Identify and read Conductor-related artifacts
    *   Parse structured content from tracks.md, plan.md, setup_state.json
    *   Extract application goals, stages, tasks, and commit references
*   **Progress Model**
    *   Normalized progress schema with Stages and Tasks
    *   Completion percentage calculation
    *   Status tracking (Completed, In Progress, Pending, Blocked)
*   **Dashboard UI**
    *   Responsive dashboard with Control Room aesthetic
    *   Progress bar showing overall completion
    *   Stage timeline (stepper view)
    *   Task table with status indicators
    *   Recent activity panel (commits)
    *   Filter by status and phase
*   **Visualization**
    *   Donut chart for completion percentage
    *   Timeline view for stages
    *   Status badges
*   **Theme Switching**
    *   Show maximum 10 themes from tailwind css, and allow user to toggle mode
    *   Persisted theme preference