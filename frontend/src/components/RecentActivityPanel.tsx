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
    <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
      <div className="px-8 py-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Recent Activity</h2>
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-900/20"></div>
      </div>
      <div className="divide-y divide-slate-800 h-[500px] overflow-y-auto no-scrollbar">
        {activities.length === 0 ? (
          <div className="p-8 text-center text-slate-600 text-xs uppercase tracking-widest font-mono">No telemetry data.</div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="p-6 hover:bg-slate-800/30 transition-colors group">
              <div className="flex justify-between items-start mb-2">
                <p className="text-xs font-semibold text-slate-300 line-clamp-2 leading-relaxed">
                  {activity.message}
                </p>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono">
                <div className="flex items-center gap-2 text-slate-500">
                  <span className="text-blue-500 font-bold uppercase">{activity.author}</span>
                  <span>•</span>
                  <span>{activity.id.substring(0, 7)}</span>
                </div>
                <time className="text-slate-600">
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