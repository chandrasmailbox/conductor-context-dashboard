// frontend/src/components/ProgressBar.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProgressBar from './ProgressBar';

describe('ProgressBar', () => {
  it('should render the progress bar container', () => {
    render(<ProgressBar progress={50} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should display the label if provided', () => {
    render(<ProgressBar progress={50} label="Loading..." />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('should clamp progress between 0 and 100', () => {
    render(<ProgressBar progress={150} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');

    render(<ProgressBar progress={-20} />);
    // Testing specific instance clamping might require checking style or re-rendering
    // But accessibility attribute should reflect clamped value
    const bars = screen.getAllByRole('progressbar');
    expect(bars[1]).toHaveAttribute('aria-valuenow', '0'); 
  });

  it('should apply custom color class', () => {
     const { container } = render(<ProgressBar progress={50} color="bg-red-500" />);
     // Select the inner div which should have the color class
     const innerBar = container.querySelector('.bg-red-500');
     expect(innerBar).toBeInTheDocument();
  });
});
