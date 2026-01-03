import { useState } from 'react';
import './App.css'
import StageTimeline from './components/StageTimeline';
import type { Stage } from './components/StageTimeline';
import TaskTable from './components/TaskTable';
import type { Task } from './components/TaskTable';
import ProgressBar from './components/ProgressBar';
import DonutChart from './components/DonutChart';
import RecentActivityPanel from './components/RecentActivityPanel';
import type { Activity } from './components/RecentActivityPanel';

interface SyncData {
  setupState?: string;
  commits?: { sha: string; message: string; author: string; date: string }[];
  tracks?: { tracks: { title: string; link: string }[] };
  plan?: {
    title: string;
    phases: {
      title: string;
      tasks: {
        description: string;
        status: 'completed' | 'in_progress' | 'pending';
        subtasks: { description: string; status: 'completed' | 'in_progress' | 'pending' }[];
      }[];
      checkpoint?: string;
    }[];
  };
}

function App() {
  const [repoUrl, setRepoUrl] = useState('');
  const [syncData, setSyncData] = useState<SyncData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSync = async () => {
    if (!repoUrl) return;
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/verify-phase-2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl }),
      });
      const data = await response.json();
      setSyncData(data);
    } catch (error) {
      console.error('Error syncing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const stages: Stage[] = syncData?.plan?.phases.map((phase, index) => ({
    id: `phase-${index}`,
    title: phase.title,
    status: phase.tasks.every(t => t.status === 'completed') 
            ? 'completed' 
            : (phase.tasks.some(t => t.status === 'completed' || t.status === 'in_progress') ? 'in_progress' : 'pending')
  })) || [];

  const allTasks: Task[] = syncData?.plan?.phases.flatMap(phase => 
    phase.tasks.map((task, index) => ({
      id: `${phase.title}-task-${index}`,
      description: task.description,
      status: task.status as any
    }))
  ) || [];

  const activities: Activity[] = syncData?.commits?.map(c => ({
    id: c.sha,
    message: c.message,
    author: c.author,
    date: c.date
  })) || [];

  const completedCount = allTasks.filter(t => t.status === 'completed').length;
  const progress = allTasks.length > 0 ? Math.floor((completedCount / allTasks.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans">
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10" role="banner" aria-label="Dashboard Header">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white shadow-lg shadow-blue-900/20">C</div>
            <h1 className="text-xl font-bold tracking-tight uppercase">
              Conductor <span className="text-blue-500">Dashboard</span>
            </h1>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter Repository URL..."
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-96 text-sm text-slate-200 placeholder-slate-500"
            />
            <button 
              onClick={handleSync}
              disabled={isLoading}
              className={`px-6 py-2 rounded-md text-sm font-semibold uppercase tracking-wider transition-all shadow-md ${
                isLoading ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/40 active:scale-95'
              }`}
            >
              {isLoading ? 'Syncing...' : 'Sync'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8" role="main">
        {!syncData ? (
          <div className="text-center py-24 border-2 border-dashed border-slate-800 rounded-2xl">
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-2xl font-bold text-slate-300">Ready for Launch</h2>
            <p className="text-slate-500 mt-2 max-w-md mx-auto">
              Enter a public GitHub repository URL above to visualize project progress and activity.
            </p>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Top Grid: Overview & Stages */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <section className="bg-slate-900 p-8 rounded-xl border border-slate-800 shadow-xl xl:col-span-1">
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  Mission Status: {syncData.plan?.title || 'Unknown Project'}
                </h2>
                <div className="flex flex-col items-center gap-6">
                  <DonutChart progress={progress} />
                  <div className="w-full space-y-6">
                    <ProgressBar progress={progress} label="Overall Completion" color="bg-blue-500" />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Payloads</div>
                        <div className="text-xl font-mono font-bold text-slate-200">{completedCount} / {allTasks.length}</div>
                      </div>
                      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">State</div>
                        <div className={`text-xl font-mono font-bold ${progress === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {progress === 100 ? 'STABLE' : 'ACTIVE'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-slate-900 p-8 rounded-xl border border-slate-800 shadow-xl xl:col-span-2">
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Execution Timeline</h2>
                <div className="bg-slate-950/50 p-6 rounded-lg border border-slate-800">
                  <StageTimeline stages={stages} />
                </div>
              </section>
            </div>

            {/* Bottom Grid: Tasks & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <section className="lg:col-span-2 space-y-4">
                <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
                  <div className="px-8 py-6 border-b border-slate-800 flex justify-between items-center">
                    <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Operation Logs</h2>
                  </div>
                  <div className="p-4">
                    <TaskTable tasks={allTasks} />
                  </div>
                </div>
              </section>

              <aside className="lg:col-span-1">
                <RecentActivityPanel activities={activities} />
              </aside>
            </div>
          </div>
        )}
      </main>
      
      <footer className="max-w-7xl mx-auto py-8 px-4 text-center text-slate-600 text-xs uppercase tracking-widest">
        Powered by Google Conductor Context Dashboard • 2026
      </footer>
    </div>
  )
}

export default App