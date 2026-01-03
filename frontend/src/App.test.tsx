// frontend/src/App.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

describe('App', () => {
  it('should render a dashboard header', () => {
    render(<App />);
    expect(screen.getByRole('banner', { name: /dashboard header/i })).toBeInTheDocument();
  });

  it('should render a main content area', () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('should render a sync button', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /sync/i })).toBeInTheDocument();
  });

  it('should trigger API call with repo URL when sync is clicked', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    render(<App />);
    const input = screen.getByPlaceholderText(/enter repository url/i);
    const syncButton = screen.getByRole('button', { name: /sync/i });

    fireEvent.change(input, { target: { value: 'https://github.com/owner/repo' } });
    fireEvent.click(syncButton);

    expect(global.fetch).toHaveBeenCalledWith('/api/v1/verify-phase-2', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repoUrl: 'https://github.com/owner/repo' }),
    }));
  });

  it('should render the integrated dashboard components after sync', async () => {
    // Mock successful fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        plan: {
          title: 'Test Project',
          phases: [{ title: 'Phase 1', tasks: [{ description: 'Task 1', status: 'completed' }] }]
        },
        commits: []
      }),
    });

    render(<App />);
    const input = screen.getByPlaceholderText(/enter repository url/i);
    const button = screen.getByRole('button', { name: /sync/i });

    fireEvent.change(input, { target: { value: 'https://github.com/owner/repo' } });
    fireEvent.click(button);

    // Check for synced content
    expect(await screen.findByText(/Test Project/i)).toBeInTheDocument();
    expect(screen.getByText(/Task 1/i)).toBeInTheDocument();
  });

  it('should display an error message if sync fails', async () => {
    // Mock fetch failure
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
    
    render(<App />);
    const input = screen.getByPlaceholderText(/enter repository url/i);
    const button = screen.getByRole('button', { name: /sync/i });
    
    fireEvent.change(input, { target: { value: 'https://github.com/owner/repo' } });
    fireEvent.click(button);
    
    expect(await screen.findByText(/failed to sync/i)).toBeInTheDocument();
  });
});
