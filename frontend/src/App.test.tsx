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

  it('should call handleSync when the sync button is clicked', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    render(<App />);
    const syncButton = screen.getByRole('button', { name: /sync/i });
    fireEvent.click(syncButton);
    expect(consoleSpy).toHaveBeenCalledWith('Syncing data...');
    consoleSpy.mockRestore();
  });

  it('should have an input for repository URL', () => {
    render(<App />);
    expect(screen.getByPlaceholderText(/repository url/i)).toBeInTheDocument();
  });

  it('should trigger API call with repo URL when sync is clicked', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    render(<App />);
    const input = screen.getByPlaceholderText(/repository url/i);
    const syncButton = screen.getByRole('button', { name: /sync/i });

    fireEvent.change(input, { target: { value: 'https://github.com/owner/repo' } });
    fireEvent.click(syncButton);

    expect(global.fetch).toHaveBeenCalledWith('/api/v1/verify-phase-2', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repoUrl: 'https://github.com/owner/repo' }),
    }));
  });
});


