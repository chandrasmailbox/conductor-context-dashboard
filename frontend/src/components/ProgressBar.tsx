// frontend/src/components/ProgressBar.tsx
import React from 'react';

interface ProgressBarProps {
  progress: number;
  label?: string;
  color?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  label, 
  color = 'bg-blue-500' 
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
          <span className="text-[10px] font-mono font-bold text-slate-400">{clampedProgress}%</span>
        </div>
      )}
      <div className="w-full bg-slate-800 rounded-full h-1.5 border border-slate-700/50 overflow-hidden" role="progressbar" aria-valuenow={clampedProgress} aria-valuemin={0} aria-valuemax={100}>
        <div 
          className={`${color} h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]`} 
          style={{ width: `${clampedProgress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;