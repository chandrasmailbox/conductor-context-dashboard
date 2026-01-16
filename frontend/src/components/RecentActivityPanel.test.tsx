import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import RecentActivityPanel from './RecentActivityPanel';
import type { Activity } from './RecentActivityPanel';

describe('RecentActivityPanel', () => {
  const activities: Activity[] = [
    { id: '1', message: 'First commit', author: 'user1', date: '2026-01-01T10:00:00Z' },
    { id: '2', message: 'Second commit', author: 'user2', date: '2026-01-01T11:00:00Z' },
  ];

  it('should render all activities', () => {
    render(<RecentActivityPanel activities={activities} />);
    expect(screen.getByText('First commit')).toBeInTheDocument();
    expect(screen.getByText('Second commit')).toBeInTheDocument();
    expect(screen.getByText('user1')).toBeInTheDocument();
    expect(screen.getByText('user2')).toBeInTheDocument();
  });

  it('should display "No activity records found" if list is empty', () => {
    render(<RecentActivityPanel activities={[]} />);
    expect(screen.getByText(/no activity records found/i)).toBeInTheDocument();
  });
});