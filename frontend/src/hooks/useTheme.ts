import { useState, useEffect } from 'react';

export const themes = [
  'control-room',
  'emerald',
  'cyberpunk',
  'monotone',
  'deep-sea',
  'volcano',
  'midnight',
  'high-contrast',
  'solarized',
  'matrix'
] as const;

export type Theme = (typeof themes)[number];

export const useTheme = () => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    return themes.includes(savedTheme) ? savedTheme : 'control-room';
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    const root = document.documentElement;
    // Remove all theme classes
    themes.forEach((t) => {
      root.classList.remove(`theme-${t}`);
    });
    // Add new theme class
    root.classList.add(`theme-${theme}`);
  }, [theme]);

  return { theme, setTheme };
};
