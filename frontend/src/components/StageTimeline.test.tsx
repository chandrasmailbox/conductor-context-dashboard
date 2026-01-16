import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StageTimeline from './StageTimeline';
import type { Phase } from './StageTimeline';

describe('StageTimeline', () => {
  const stages: Phase[] = [
    { title: 'Planning', status: 'completed', tasks: [] },
    { title: 'Development', status: 'in_progress', tasks: [] },
    { title: 'Deployment', status: 'pending', tasks: [] },
  ];

  it('should render all stages', () => {
    render(<StageTimeline stages={stages} />);
    expect(screen.getByText('Planning')).toBeInTheDocument();
    expect(screen.getByText('Development')).toBeInTheDocument();
    expect(screen.getByText('Deployment')).toBeInTheDocument();
  });

  it('should render the timeline container', () => {
      render(<StageTimeline stages={stages} />);
      expect(screen.getByText(/Development Timeline/i)).toBeInTheDocument();
  });

  it('should visually indicate completed stages', () => {
        render(<StageTimeline stages={[{ title: 'Done', status: 'completed', tasks: [] }]} />);
        // Checking for the "COMPLETED" badge text
        expect(screen.getByText('COMPLETED')).toBeInTheDocument();
    });

    it('should visually indicate in-progress stages', () => {
        render(<StageTimeline stages={[{ title: 'WIP', status: 'in_progress', tasks: [] }]} />);
        // Checking for the "IN PROGRESS" badge text
        expect(screen.getByText('IN PROGRESS')).toBeInTheDocument();
    });
});