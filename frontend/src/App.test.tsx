// frontend/src/App.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  it('should render a header', () => {
    render(<App />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('should render a repo input card', () => {
    render(<App />);
    expect(screen.getByTestId('repo-input-card')).toBeInTheDocument();
  });

  it('should trigger API call with repo URL when analyze is clicked', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
    vi.stubGlobal('fetch', mockFetch);

    render(<App />);
    const input = screen.getByTestId('repo-url-input');
    const analyzeButton = screen.getByTestId('analyze-button');

    fireEvent.change(input, { target: { value: 'https://github.com/owner/repo' } });
    fireEvent.click(analyzeButton);

    expect(mockFetch).toHaveBeenCalledWith('/api/v1/verify-phase-2', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repoUrl: 'https://github.com/owner/repo' }),
    }));
  });

  it('should render the integrated dashboard components after sync', async () => {
    // Mock successful fetch
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        plan: {
          title: 'Test Project',
          phases: [{ title: 'Phase 1', tasks: [{ description: 'Task 1', status: 'completed', subtasks: [] }] }]
        },
        commits: []
      }),
    });
    vi.stubGlobal('fetch', mockFetch);

    render(<App />);
    const input = screen.getByTestId('repo-url-input');
    const button = screen.getByTestId('analyze-button');

    fireEvent.change(input, { target: { value: 'https://github.com/owner/repo' } });
    fireEvent.click(button);

    // Check for synced content
    expect(await screen.findByTestId('progress-overview')).toBeInTheDocument();
    expect(screen.getByText(/Task 1/i)).toBeInTheDocument();
  });

  it('should display an error message if sync fails', async () => {
    // Mock fetch failure
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));
    
    render(<App />);
    const input = screen.getByTestId('repo-url-input');
    const button = screen.getByTestId('analyze-button');
    
    fireEvent.change(input, { target: { value: 'https://github.com/owner/repo' } });
    fireEvent.click(button);
    
    expect(await screen.findByText(/sync failed/i)).toBeInTheDocument();
  });

  it('should support Local Mode synchronization', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        plan: {
          title: 'Local Project',
          phases: [{ title: 'Phase 1', tasks: [{ description: 'Local Task', status: 'in_progress', subtasks: [] }] }]
        },
        commits: []
      }),
    });
    vi.stubGlobal('fetch', mockFetch);

    render(<App />);
    
    // Switch to Local Mode
    fireEvent.click(screen.getByText(/Local Mode/i));
    
    const input = screen.getByTestId('repo-url-input');
    const button = screen.getByTestId('analyze-button');

    fireEvent.change(input, { target: { value: 'C:/projects/my-repo' } });
    fireEvent.click(button);

    expect(mockFetch).toHaveBeenCalledWith('/api/v1/sync-local', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ directoryPath: 'C:/projects/my-repo' }),
    }));

    expect(await screen.findByTestId('progress-overview', {}, { timeout: 3000 })).toBeInTheDocument();
    expect(screen.getByText(/Local Task/i)).toBeInTheDocument();
  });
});