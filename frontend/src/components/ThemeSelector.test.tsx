import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ThemeSelector from './ThemeSelector';
import { themes } from '../hooks/useTheme';

describe('ThemeSelector', () => {
  const mockSetTheme = vi.fn();

  it('should render all theme options', () => {
    render(<ThemeSelector currentTheme="control-room" onThemeChange={mockSetTheme} />);
    
    themes.forEach(theme => {
      const displayTitle = theme.replace('-', ' ');
      expect(screen.getByTitle(new RegExp(displayTitle, 'i'))).toBeInTheDocument();
    });
  });

  it('should call onThemeChange when a theme is clicked', () => {
    render(<ThemeSelector currentTheme="control-room" onThemeChange={mockSetTheme} />);
    
    const emeraldButton = screen.getByTitle(/emerald/i);
    fireEvent.click(emeraldButton);
    
    expect(mockSetTheme).toHaveBeenCalledWith('emerald');
  });

  it('should highlight the current theme', () => {
    render(<ThemeSelector currentTheme="cyberpunk" onThemeChange={mockSetTheme} />);
    
    const cyberpunkButton = screen.getByTitle(/cyberpunk/i);
    // In our implementation, we'll use a specific border or ring class for active
    expect(cyberpunkButton).toHaveClass('ring-2');
  });
});
