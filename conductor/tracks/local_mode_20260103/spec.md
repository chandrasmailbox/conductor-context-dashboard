# Spec: Local Mode

## Overview
Currently, the dashboard only supports public GitHub repositories. Local Mode will allow users to point the dashboard at a local directory on their machine to visualize progress for projects in development.

## User Experience
1. User toggles a "Local Mode" switch.
2. The "Repository URL" input changes its placeholder to "Local Directory Path (e.g., C:/projects/my-app)".
3. User enters the path and clicks "Sync".
4. The dashboard populates with data from the local `conductor/` directory and local git history.

## Technical Requirements
### Backend
- **Endpoint:** `POST /api/v1/sync-local`
- **Payload:** `{ "directoryPath": string }`
- **Security:** Ensure the backend only accesses paths the user explicitly provides. Add a basic check to prevent reading sensitive system directories (though for a local CLI-based tool, the user's OS permissions are the primary guard).
- **Git Integration:** Use `child_process` (or similar) to run `git log` within the target directory to get commit history.

### Frontend
- **State Management:** Track whether the app is in `github` or `local` mode.
- **API Integration:** Call the appropriate endpoint based on the active mode.
- **Persistence:** Save the last used mode and path in `localStorage`.
