// frontend/src/components/TaskTable.tsx
import React, { useState } from 'react';

export type TaskStatus = 'completed' | 'in_progress' | 'pending' | 'blocked';

export interface Task {
  id: string;
  description: string;
  status: TaskStatus;
}

interface TaskTableProps {
  tasks: Task[];
}

type SortField = 'description' | 'status';
type SortDirection = 'asc' | 'desc';

const TaskTable: React.FC<TaskTableProps> = ({ tasks }) => {
  const [sortField, setSortField] = useState<SortField>('description');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (statusFilter === 'all') return true;
    return task.status === statusFilter;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label htmlFor="status-filter" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Filter Status</label>
          <select
            id="status-filter"
            aria-label="Filter by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-md py-1.5 px-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
          >
            <option value="all">ALL ENTRIES</option>
            <option value="completed">COMPLETED</option>
            <option value="in_progress">IN PROGRESS</option>
            <option value="pending">PENDING</option>
            <option value="blocked">BLOCKED</option>
          </select>
        </div>
        <div className="text-[10px] font-mono text-slate-500 bg-slate-800/50 px-2 py-1 rounded">
          DISPLAYING {sortedTasks.length} / {tasks.length} RECORDS
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-800" role="table">
          <thead>
            <tr>
              <th
                className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest cursor-pointer hover:text-slate-300 transition-colors"
                onClick={() => handleSort('description')}
              >
                Data Description {sortField === 'description' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest cursor-pointer hover:text-slate-300 transition-colors"
                onClick={() => handleSort('status')}
              >
                Status Flag {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {sortedTasks.map((task) => (
              <tr key={task.id} className="hover:bg-slate-800/30 transition-colors group">
                <td className="px-4 py-4 text-sm text-slate-300 font-medium">
                  {task.description}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-tighter ${
                      task.status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : task.status === 'in_progress'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                  >
                    {task.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskTable;
