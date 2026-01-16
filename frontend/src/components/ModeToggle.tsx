interface ModeToggleProps {
  mode: 'github' | 'local';
  onModeChange: (mode: 'github' | 'local') => void;
}

export default function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="flex bg-muted rounded-lg p-1 border border-border">
      <button
        onClick={() => onModeChange('github')}
        className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${
          mode === 'github'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        GitHub Mode
      </button>
      <button
        onClick={() => onModeChange('local')}
        className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${
          mode === 'local'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        Local Mode
      </button>
    </div>
  );
}