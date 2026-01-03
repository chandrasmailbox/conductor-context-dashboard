// frontend/src/components/StageTimeline.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StageTimeline, { Stage } from './StageTimeline';

describe('StageTimeline', () => {
  const stages: Stage[] = [
    { id: '1', title: 'Planning', status: 'completed' },
    { id: '2', title: 'Development', status: 'in_progress' },
    { id: '3', title: 'Deployment', status: 'pending' },
  ];

  it('should render all stages', () => {
    render(<StageTimeline stages={stages} />);
    expect(screen.getByText('Planning')).toBeInTheDocument();
    expect(screen.getByText('Development')).toBeInTheDocument();
    expect(screen.getByText('Deployment')).toBeInTheDocument();
  });

  it('should render the timeline container', () => {
      render(<StageTimeline stages={stages} />);
      expect(screen.getByRole('region', { name: /stage timeline/i })).toBeInTheDocument();
  });

  it('should visually indicate completed stages', () => {
      const { container } = render(<StageTimeline stages={[{ id: '1', title: 'Done', status: 'completed' }]} />);
      const indicator = container.querySelector('.text-emerald-400');
      expect(indicator).toBeInTheDocument();
  });

   it('should visually indicate in-progress stages', () => {
      const { container } = render(<StageTimeline stages={[{ id: '1', title: 'WIP', status: 'in_progress' }]} />);
      const indicator = container.querySelector('.text-blue-400');
      expect(indicator).toBeInTheDocument();
  });
});