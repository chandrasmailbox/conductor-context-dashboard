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
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-emerald-900/20'
                  : stage.status === 'in_progress'
                  ? 'bg-blue-500/10 border-blue-500 text-blue-400 animate-pulse shadow-blue-900/20'
                  : 'bg-slate-800 border-slate-700 text-slate-500'
              }`}
              title={`${stage.title} - ${stage.status}`}
              role="listitem"
            >
              {String(index + 1).padStart(2, '0')}
            </div>
            <div className="mt-3 text-center">
              <div className={`text-[10px] font-bold uppercase tracking-tighter ${
                stage.status === 'completed' ? 'text-emerald-500' : 
                stage.status === 'in_progress' ? 'text-blue-500' : 'text-slate-500'
              }`}>
                {stage.status.replace('_', ' ')}
              </div>
              <div className="text-xs font-semibold text-slate-300 mt-1 max-w-[100px] truncate">{stage.title}</div>
            </div>
          </div>
          {index < stages.length - 1 && (
            <div className="w-12 h-[2px] bg-slate-800 -mt-10 mx-[-10px] z-0"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StageTimeline;