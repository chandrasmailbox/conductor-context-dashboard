import { useState } from 'react';
import './App.css'
import StageTimeline, { Stage } from './components/StageTimeline';
import TaskTable, { Task } from './components/TaskTable';
import ProgressBar from './components/ProgressBar';

interface SyncData {
  setupState?: string;
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
    console.log('Syncing data...');
    try {
      const response = await fetch('/api/v1/verify-phase-2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ repoUrl }),
      });
      const data = await response.json();
      console.log('Synced data:', data);
      setSyncData(data);
    } catch (error) {
      console.error('Error syncing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Map syncData to component-friendly formats
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

  const completedCount = allTasks.filter(t => t.status === 'completed').length;
  const progress = allTasks.length > 0 ? Math.floor((completedCount / allTasks.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow" role="banner" aria-label="Dashboard Header">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Progress Visualization Dashboard
          </h1>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Repository URL"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-80"
            />
            <button 
              onClick={handleSync}
              disabled={isLoading}
              className={`px-4 py-2 rounded-md text-white transition-colors ${
                isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? 'Syncing...' : 'Sync'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8" role="main">
        {!syncData ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Enter a repository URL to see its progress.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <section className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Project Overview: {syncData.plan?.title}</h2>
              <ProgressBar progress={progress} label="Overall Completion" />
            </section>

            <section className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Stages</h2>
              <StageTimeline stages={stages} />
            </section>

            <section className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Tasks</h2>
              <TaskTable tasks={allTasks} />
            </section>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
