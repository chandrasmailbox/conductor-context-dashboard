// frontend/src/components/RecentActivityPanel.tsx
import React from 'react';

export interface Activity {
  id: string;
  message: string;
  author: string;
  date: string;
}

interface RecentActivityPanelProps {
  activities: Activity[];
}

const RecentActivityPanel: React.FC<RecentActivityPanelProps> = ({ activities }) => {
  return (
    <div className="bg-brand-bg-surface rounded-xl border border-brand-border shadow-xl overflow-hidden">
      <div className="px-8 py-6 border-b border-brand-border flex justify-between items-center bg-brand-bg-surface/50">
        <h2 className="text-xs font-bold text-brand-text-muted uppercase tracking-widest">Recent Activity</h2>
        <div className="w-2 h-2 bg-brand-success rounded-full animate-pulse shadow-lg shadow-brand-success/20"></div>
      </div>
      <div className="divide-y divide-brand-border h-[500px] overflow-y-auto no-scrollbar">
        {activities.length === 0 ? (
          <div className="p-8 text-center text-brand-text-muted text-xs uppercase tracking-widest font-mono">No telemetry data.</div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="p-6 hover:bg-brand-bg-overlay/30 transition-colors group">
              <div className="flex justify-between items-start mb-2">
                <p className="text-xs font-semibold text-brand-text-secondary line-clamp-2 leading-relaxed">
                  {activity.message}
                </p>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono">
                <div className="flex items-center gap-2 text-brand-text-muted">
                  <span className="text-brand-primary font-bold uppercase">{activity.author}</span>
                  <span>•</span>
                  <span>{activity.id.substring(0, 7)}</span>
                </div>
                <time className="text-brand-text-muted/80">
                  {new Date(activity.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </time>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentActivityPanel;