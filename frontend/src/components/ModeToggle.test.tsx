import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ModeToggle from './ModeToggle';

describe('ModeToggle', () => {
  const mockOnModeChange = vi.fn();

  it('should render GitHub and Local mode options', () => {
    render(<ModeToggle mode="github" onModeChange={mockOnModeChange} />);
    expect(screen.getByText(/GitHub Mode/i)).toBeInTheDocument();
    expect(screen.getByText(/Local Mode/i)).toBeInTheDocument();
  });

  it('should call onModeChange when a mode is clicked', () => {
    render(<ModeToggle mode="github" onModeChange={mockOnModeChange} />);
    fireEvent.click(screen.getByText(/Local Mode/i));
    expect(mockOnModeChange).toHaveBeenCalledWith('local');
  });

  it('should highlight the active mode', () => {
    const { rerender } = render(<ModeToggle mode="github" onModeChange={() => {}} />);
    expect(screen.getByText(/GitHub Mode/i)).toHaveClass('bg-background');

    rerender(<ModeToggle mode="local" onModeChange={() => {}} />);
    expect(screen.getByText(/Local Mode/i)).toHaveClass('bg-background');
  });
});