import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useTheme, themes } from './useTheme';

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  it('should initialize with the default theme', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('control-room');
    expect(document.documentElement.classList.contains('theme-control-room')).toBe(true);
  });

  it('should change the theme', () => {
    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current.setTheme('emerald');
    });

    expect(result.current.theme).toBe('emerald');
    expect(document.documentElement.classList.contains('theme-emerald')).toBe(true);
    expect(document.documentElement.classList.contains('theme-control-room')).toBe(false);
  });

  it('should persist the theme in localStorage', () => {
    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current.setTheme('cyberpunk');
    });

    expect(localStorage.getItem('theme')).toBe('cyberpunk');
  });

  it('should load the theme from localStorage on initialization', () => {
    localStorage.setItem('theme', 'midnight');
    const { result } = renderHook(() => useTheme());
    
    expect(result.current.theme).toBe('midnight');
    expect(document.documentElement.classList.contains('theme-midnight')).toBe(true);
  });
});
