// frontend/src/components/ModeToggle.tsx

interface ModeToggleProps {
  mode: 'github' | 'local';
  onModeChange: (mode: 'github' | 'local') => void;
}

export default function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="flex bg-brand-bg-overlay rounded-lg p-1 border border-brand-border">
      <button
        onClick={() => onModeChange('github')}
        className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${
          mode === 'github'
            ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30'
            : 'text-brand-text-muted hover:text-brand-text-secondary'
        }`}
      >
        GitHub Mode
      </button>
      <button
        onClick={() => onModeChange('local')}
        className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${
          mode === 'local'
            ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30'
            : 'text-brand-text-muted hover:text-brand-text-secondary'
        }`}
      >
        Local Mode
      </button>
    </div>
  );
}
