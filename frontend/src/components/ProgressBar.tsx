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
  color = 'bg-blue-600' 
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-base font-medium text-blue-700 dark:text-white">{label}</span>
          <span className="text-sm font-medium text-blue-700 dark:text-white">{clampedProgress}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700" role="progressbar" aria-valuenow={clampedProgress} aria-valuemin={0} aria-valuemax={100}>
        <div 
          className={`${color} h-2.5 rounded-full transition-all duration-300 ease-in-out`} 
          style={{ width: `${clampedProgress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
