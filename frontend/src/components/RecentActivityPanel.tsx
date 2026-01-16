import React from 'react';
import { GitCommit, User, Calendar, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";

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
    <Card className="border shadow-sm overflow-hidden flex flex-col h-[500px]">
      <CardHeader className="px-6 py-4 border-b border-border/50 bg-muted/20 flex flex-row items-center justify-between">
        <CardTitle className="text-xs uppercase tracking-widest font-bold text-muted-foreground">
          Recent Activity
        </CardTitle>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Live Feed</span>
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-y-auto no-scrollbar flex-1">
        {activities.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
            <GitCommit className="w-10 h-10 mb-2 opacity-10" />
            <p className="text-sm font-medium">No activity records found</p>
            <p className="text-xs opacity-60">Complete tasks or commit code to see updates here.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/30">
            {activities.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-muted/30 transition-all duration-200 group relative">
                <div className="flex gap-3">
                  <div className="mt-1 w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 border border-border/50 group-hover:bg-primary/10 transition-colors">
                    <GitCommit className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground line-clamp-2 leading-relaxed mb-2">
                      {activity.message}
                    </p>
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      <div className="flex items-center gap-1 bg-muted px-1.5 py-0.5 rounded">
                        <User className="w-3 h-3" />
                        <span className="text-foreground/80">{activity.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(activity.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' })}</span>
                      </div>
                      <div className="flex items-center gap-1 font-mono text-primary/70">
                        <span>{activity.id.substring(0, 7)}</span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivityPanel;
