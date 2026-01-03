// frontend/src/components/ProgressBar.tsx
import React from 'react';

interface ProgressBarProps {
  progress: number;
  label?: string;
  color?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, label, color = 'bg-brand-primary' }) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full space-y-2" role="group" aria-label={`${label} progress indicator`}>
      <div className="flex justify-between items-end px-1">
        <span className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest">{label}</span>
        <span className="text-[10px] font-mono font-bold text-brand-text-secondary">{clampedProgress}%</span>
      </div>
      <div className="w-full bg-brand-bg-overlay rounded-full h-1.5 border border-brand-border/50 overflow-hidden" role="progressbar" aria-valuenow={clampedProgress} aria-valuemin={0} aria-valuemax={100}>
        <div 
          className={`h-full ${color} transition-all duration-1000 ease-out shadow-sm shadow-blue-500/20`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};
export default ProgressBar;