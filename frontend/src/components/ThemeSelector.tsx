import React from 'react';
import { Theme, themes } from '../hooks/useTheme';

interface ThemeSelectorProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const themeColors: Record<Theme, string> = {
  'control-room': 'bg-slate-900',
  'emerald': 'bg-emerald-600',
  'cyberpunk': 'bg-fuchsia-600',
  'monotone': 'bg-zinc-600',
  'midnight': 'bg-violet-900',
  'volcano': 'bg-red-700',
  'deep-sea': 'bg-teal-700',
  'solarized': 'bg-amber-700',
  'matrix': 'bg-lime-600',
  'high-contrast': 'bg-white'
};

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, onThemeChange }) => {
  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Theme selection">
      <span className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest mr-2">Visual Mode</span>
      {themes.map((theme) => (
        <button
          key={theme}
          onClick={() => onThemeChange(theme)}
          title={theme.replace('-', ' ')}
          className={`w-6 h-6 rounded-full border border-brand-border transition-all hover:scale-110 active:scale-95 ${themeColors[theme]} ${
            currentTheme === theme ? 'ring-2 ring-brand-primary ring-offset-2 ring-offset-brand-bg-base scale-110' : 'opacity-70 hover:opacity-100'
          }`}
          aria-pressed={currentTheme === theme}
        />
      ))}
    </div>
  );
};

export default ThemeSelector;
