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
    <div className="flex items-center space-x-4 p-4 overflow-x-auto" role="region" aria-label="Stage Timeline">
      {stages.map((stage, index) => (
        <div key={stage.id} className="flex items-center">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              stage.status === 'completed'
                ? 'bg-green-500 border-green-500 text-white'
                : stage.status === 'in_progress'
                ? 'bg-blue-500 border-blue-500 text-white animate-pulse'
                : 'bg-gray-200 border-gray-400 text-gray-500'
            }`}
            title={`${stage.title} - ${stage.status}`}
            role="listitem"
          >
            {index + 1}
          </div>
          <div className="ml-2 mr-2">
            <div className="text-sm font-medium">{stage.title}</div>
            <div className="text-xs text-gray-500 capitalize">{stage.status.replace('_', ' ')}</div>
          </div>
          {index < stages.length - 1 && (
            <div className="w-8 h-1 bg-gray-300"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StageTimeline;
