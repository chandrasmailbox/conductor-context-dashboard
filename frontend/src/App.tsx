import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "sonner";
import './App.css'
import Header from './components/Header';
import RepoInput from './components/RepoInput';
import ProgressOverview from './components/ProgressOverview';
import CompletionChart from './components/CompletionChart';
import StageTimeline from './components/StageTimeline';
import type { Phase } from './components/StageTimeline';
import TaskTable from './components/TaskTable';
import type { Task } from './components/TaskTable';
import RecentActivityPanel from './components/RecentActivityPanel';
import type { Activity } from './components/RecentActivityPanel';
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
  product_name?: string;
  owner?: string;
  repo_name?: string;
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

  const handleSync = async (url?: string) => {
    const targetUrl = url || repoUrl;
    if (!targetUrl) return;

    setIsLoading(true);
    setError(null);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const endpoint = syncMode === 'github' ? `${baseUrl}/api/v1/verify-phase-2` : `${baseUrl}/api/v1/sync-local`;
      const body = syncMode === 'github' ? { repoUrl: targetUrl } : { directoryPath: targetUrl };

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

  const handleRepoSubmit = (url: string) => {
    setRepoUrl(url);
    handleSync(url);
  };

  const phases: Phase[] = syncData?.plan?.phases.map((phase) => ({
    title: phase.title,
    status: phase.tasks.every(t => t.status === 'completed')
      ? 'completed'
      : (phase.tasks.some(t => t.status === 'completed' || t.status === 'in_progress') ? 'in_progress' : 'pending'),
    tasks: phase.tasks.map(t => ({
      description: t.description,
      status: t.status,
      // In a real app, we'd map this to a commit if available, 
      // but for now we'll leave it undefined or map from subtasks if structured that way
    }))
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
  const inProgressCount = allTasks.filter(t => t.status === 'in_progress').length;
  const pendingCount = allTasks.filter(t => t.status === 'pending').length;
  const blockedCount = allTasks.filter(t => (t.status as any) === 'blocked').length;
  const progress = allTasks.length > 0 ? Math.floor((completedCount / allTasks.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-300">
      <Header
        onSync={() => handleSync()}
        loading={isLoading}
        hasData={!!syncData}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      />

      <main className="container mx-auto px-6 md:px-12 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Repo Input - Full Width */}
          <div className="col-span-12">
            <RepoInput
              onSubmit={handleRepoSubmit}
              loading={isLoading}
              defaultValue={repoUrl}
              syncMode={syncMode}
              onModeChange={handleModeChange}
            />
          </div>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-12 flex flex-col items-center justify-center py-20"
              >
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-muted-foreground font-medium">Synchronizing project artifacts...</p>
              </motion.div>
            ) : error && !syncData ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-12 bg-destructive/5 border border-destructive/20 p-8 rounded-2xl text-center"
              >
                <div className="text-4xl mb-4">⚠️</div>
                <h3 className="text-lg font-bold text-destructive mb-2">Sync Failed</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">{error}</p>
                <button
                  onClick={() => handleSync()}
                  className="px-6 py-2 bg-destructive text-destructive-foreground rounded-lg font-bold uppercase tracking-widest text-[10px]"
                >
                  Retry Connection
                </button>
              </motion.div>
            ) : syncData ? (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="col-span-12 grid grid-cols-1 md:grid-cols-12 gap-8"
              >
                {/* Sidebar: Progress & Chart */}
                <div className="col-span-12 md:col-span-4 lg:col-span-3 space-y-8">
                  <ProgressOverview
                    progress={progress}
                    completedTasks={completedCount}
                    totalTasks={allTasks.length}
                    inProgressTasks={inProgressCount}
                    pendingTasks={pendingCount}
                    blockedTasks={blockedCount}
                    projectName={syncData.plan?.title}
                    repoName={syncMode === 'github' ? repoUrl.split('github.com/')[1] : repoUrl}
                    phasesCount={phases.length}
                  />
                  <CompletionChart
                    completed={completedCount}
                    total={allTasks.length}
                  />
                </div>

                {/* Main Content: Timeline, Tasks, and Activity */}
                <div className="col-span-12 md:col-span-8 lg:col-span-9 space-y-8">
                  <StageTimeline stages={phases} repoUrl={syncMode === 'github' ? repoUrl : undefined} />
                  <TaskTable tasks={allTasks} />
                  <RecentActivityPanel activities={activities} />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-12 text-center py-20 border-2 border-dashed border-border rounded-2xl bg-muted/10"
              >
                <div className="text-5xl mb-4 opacity-20">🚀</div>
                <h2 className="text-xl font-bold">Ready for Analysis</h2>
                <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                  {syncMode === 'github'
                    ? "Enter a public GitHub repository URL above to visualize project progress and activity."
                    : "Enter a local directory path above to visualize your local development progress."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="container mx-auto px-6 py-12 text-center border-t border-border mt-12">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
          Powered by Gemini • Conductor Intelligence Dashboard • 2026
        </p>
      </footer>
      <Toaster position="bottom-right" />
    </div>
  )
}

export default App
