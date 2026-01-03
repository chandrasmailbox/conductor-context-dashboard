import { useState, useEffect } from 'react';
import './App.css'
import StageTimeline from './components/StageTimeline';
import type { Stage } from './components/StageTimeline';
import TaskTable from './components/TaskTable';
import type { Task } from './components/TaskTable';
import ProgressBar from './components/ProgressBar';
import DonutChart from './components/DonutChart';
import RecentActivityPanel from './components/RecentActivityPanel';
import type { Activity } from './components/RecentActivityPanel';
import ThemeSelector from './components/ThemeSelector';
import ModeToggle from './components/ModeToggle';
import { useTheme } from './hooks/useTheme';

interface SyncData {
  setupState?: string;
  commits?: { sha: string; message: string; author: string; date: string }[];
  tracks?: { tracks: { title: string; link: string; status: string }[] };
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
  const [repoUrl, setRepoUrl] = useState(() => localStorage.getItem('repoUrl') || '');
  const [syncMode, setSyncMode] = useState<'github' | 'local'>(() => (localStorage.getItem('syncMode') as 'github' | 'local') || 'github');
  const [syncData, setSyncData] = useState<SyncData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    localStorage.setItem('repoUrl', repoUrl);
  }, [repoUrl]);

  useEffect(() => {
    localStorage.setItem('syncMode', syncMode);
  }, [syncMode]);

  const handleSync = async () => {
    if (!repoUrl) return;
    setIsLoading(true);
    setError(null);
    try {
      const endpoint = syncMode === 'github' ? '/api/v1/verify-phase-2' : '/api/v1/sync-local';
      const body = syncMode === 'github' ? { repoUrl } : { directoryPath: repoUrl };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      const data = await response.json();
      setSyncData(data);
    } catch (error) {
      console.error('Error syncing data:', error);
      setError(`Failed to sync ${syncMode === 'github' ? 'repository' : 'local'} data. Please verify the ${syncMode === 'github' ? 'URL' : 'path'} and ensure the project contains Conductor artifacts.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeChange = (mode: 'github' | 'local') => {
    setSyncMode(mode);
    setRepoUrl('');
    setSyncData(null);
    setError(null);
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
    <div className="min-h-screen bg-brand-bg-base text-brand-text-primary font-sans transition-colors duration-300">
      <header className="bg-brand-bg-surface border-b border-brand-border sticky top-0 z-10" role="banner" aria-label="Dashboard Header">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-brand-secondary rounded flex items-center justify-center font-bold text-white shadow-lg shadow-brand-primary/20">C</div>
              <h1 className="text-xl font-bold tracking-tight uppercase">
                Conductor <span className="text-brand-primary">Dashboard</span>
              </h1>
            </div>
            <ModeToggle mode={syncMode} onModeChange={handleModeChange} />
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={syncMode === 'github' ? "Enter Repository URL..." : "Enter Local Directory Path..."}
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="px-4 py-2 bg-brand-bg-overlay border border-brand-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary w-full md:w-96 text-sm text-brand-text-secondary placeholder-brand-text-muted"
            />
            <button 
              onClick={handleSync}
              disabled={isLoading}
              className={`px-6 py-2 rounded-md text-sm font-semibold uppercase tracking-wider transition-all shadow-md ${
                isLoading ? 'bg-brand-bg-overlay text-brand-text-muted cursor-not-allowed' : 'bg-brand-primary hover:bg-brand-secondary text-white shadow-brand-primary/40 active:scale-95'
              }`}
            >
              {isLoading ? 'Syncing...' : 'Sync'}
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 border-t border-brand-border/30 flex justify-end">
          <ThemeSelector currentTheme={theme} onThemeChange={setTheme} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8" role="main">
        {error && (
          <div className="mb-8 p-4 bg-brand-bg-overlay border border-brand-primary/30 rounded-lg flex items-center gap-3 text-brand-primary animate-in slide-in-from-top-4 duration-300">
            <span className="text-xl">⚠️</span>
            <div className="flex-1 text-sm font-semibold">{error}</div>
            <button onClick={() => setError(null)} className="text-brand-text-muted hover:text-brand-text-primary">✕</button>
          </div>
        )}
        {!syncData ? (
          <div className="text-center py-24 border-2 border-dashed border-brand-border rounded-2xl">
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-2xl font-bold text-brand-text-secondary">Ready for Launch</h2>
            <p className="text-brand-text-muted mt-2 max-w-md mx-auto">
              {syncMode === 'github' 
                ? "Enter a public GitHub repository URL above to visualize project progress and activity."
                : "Enter a local directory path above to visualize your local development progress."}
            </p>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Top Grid: Overview & Stages */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <section className="bg-brand-bg-surface p-8 rounded-xl border border-brand-border shadow-xl xl:col-span-1">
                <h2 className="text-xs font-bold text-brand-text-muted uppercase tracking-widest mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 bg-brand-primary rounded-full animate-pulse"></span>
                  Mission Status: {syncData.plan?.title || 'Unknown Project'}
                </h2>
                <div className="flex flex-col items-center gap-6">
                  <DonutChart progress={progress} />
                  <div className="w-full space-y-6">
                    <ProgressBar progress={progress} label="Overall Completion" color="bg-brand-primary" />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-brand-bg-overlay/50 rounded-lg border border-brand-border/50">
                        <div className="text-[10px] text-brand-text-muted font-bold uppercase tracking-wider mb-1">Payloads</div>
                        <div className="text-xl font-mono font-bold text-brand-text-secondary">{completedCount} / {allTasks.length}</div>
                      </div>
                      <div className="p-4 bg-brand-bg-overlay/50 rounded-lg border border-brand-border/50">
                        <div className="text-[10px] text-brand-text-muted font-bold uppercase tracking-wider mb-1">State</div>
                        <div className={`text-xl font-mono font-bold ${progress === 100 ? 'text-brand-success' : 'text-brand-warning'}`}>
                          {progress === 100 ? 'STABLE' : 'ACTIVE'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-brand-bg-surface p-8 rounded-xl border border-brand-border shadow-xl xl:col-span-2">
                <h2 className="text-xs font-bold text-brand-text-muted uppercase tracking-widest mb-6">Execution Timeline</h2>
                <div className="bg-brand-bg-base/50 p-6 rounded-lg border border-brand-border">
                  <StageTimeline stages={stages} />
                </div>
              </section>
            </div>

            {/* Bottom Grid: Tasks & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <section className="lg:col-span-2 space-y-4">
                <div className="bg-brand-bg-surface rounded-xl border border-brand-border shadow-xl overflow-hidden">
                  <div className="px-8 py-6 border-b border-brand-border flex justify-between items-center">
                    <h2 className="text-xs font-bold text-brand-text-muted uppercase tracking-widest">Operation Logs</h2>
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
      
      <footer className="max-w-7xl mx-auto py-8 px-4 text-center text-brand-text-muted text-xs uppercase tracking-widest">
        Powered by Google Conductor Context Dashboard • 2026
      </footer>
    </div>
  )
}

export default App
