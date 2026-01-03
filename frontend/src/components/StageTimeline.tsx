// frontend/src/components/StageTimeline.tsx
import React from 'react';

export type StageStatus = 'completed' | 'in_progress' | 'pending' | 'blocked';

export interface Stage {
  id: string;
  title: string;
  status: StageStatus;
}

interface StageTimelineProps {
  stages: Stage[];
}

const StageTimeline: React.FC<StageTimelineProps> = ({ stages }) => {
  return (
    <div className="flex items-center space-x-2 py-4 overflow-x-auto no-scrollbar" role="region" aria-label="Stage Timeline">
      {stages.map((stage, index) => (
        <div key={stage.id} className="flex items-center group">
          <div className="flex flex-col items-center min-w-[120px]">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-lg border-2 font-mono text-sm transition-all shadow-lg ${
                stage.status === 'completed'
                  ? 'bg-brand-success/10 border-brand-success text-brand-success shadow-brand-success/20'
                  : stage.status === 'in_progress'
                  ? 'bg-brand-primary/10 border-brand-primary text-brand-primary animate-pulse shadow-brand-primary/20'
                  : 'bg-brand-bg-overlay border-brand-border text-brand-text-muted'
              }`}
              title={`${stage.title} - ${stage.status}`}
              role="listitem"
            >
              {String(index + 1).padStart(2, '0')}
            </div>
            <div className="mt-3 text-center">
              <div className={`text-[10px] font-bold uppercase tracking-tighter ${
                stage.status === 'completed' ? 'text-brand-success' : 
                stage.status === 'in_progress' ? 'text-brand-primary' : 'text-brand-text-muted'
              }`}>
                {stage.status.replace('_', ' ')}
              </div>
              <div className="text-xs font-semibold text-brand-text-secondary mt-1 max-w-[100px] truncate">{stage.title}</div>
            </div>
          </div>
          {index < stages.length - 1 && (
            <div className="w-12 h-[2px] bg-brand-border -mt-10 mx-[-10px] z-0"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StageTimeline;