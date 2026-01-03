// frontend/src/components/RecentActivityPanel.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import RecentActivityPanel from './RecentActivityPanel';
import type { Activity } from './RecentActivityPanel';

describe('RecentActivityPanel', () => {
  const activities: Activity[] = [
    { id: '123456789', message: 'feat: Add feature', author: 'User A', date: '2026-01-02T10:00:00Z' },
    { id: '987654321', message: 'fix: Bug fix', author: 'User B', date: '2026-01-01T15:00:00Z' },
  ];

  it('should render all activities', () => {
    render(<RecentActivityPanel activities={activities} />);
    expect(screen.getByText('feat: Add feature')).toBeInTheDocument();
    expect(screen.getByText('fix: Bug fix')).toBeInTheDocument();
    expect(screen.getByText('User A')).toBeInTheDocument();
    expect(screen.getByText('User B')).toBeInTheDocument();
  });

  it('should display "No telemetry data." if list is empty', () => {
    render(<RecentActivityPanel activities={[]} />);
    expect(screen.getByText(/no telemetry data/i)).toBeInTheDocument();
  });
});
