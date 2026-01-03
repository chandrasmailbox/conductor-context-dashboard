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
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {activities.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No recent activity.</div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start mb-1">
                <p className="text-sm font-medium text-gray-900 truncate pr-4">
                  {activity.message}
                </p>
                <time className="text-xs text-gray-500 whitespace-nowrap">
                  {new Date(activity.date).toLocaleDateString()}
                </time>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <span className="font-semibold">{activity.author}</span>
                <span className="mx-1">•</span>
                <span className="font-mono">{activity.id.substring(0, 7)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentActivityPanel;
