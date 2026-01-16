import React, { useState } from 'react';
import { Search, Filter, ArrowUpDown, CheckCircle2, Circle, Clock, AlertCircle } from "lucide-react";
import { cn } from "../utils/cn";
import { Input } from "./ui/Input";

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
  const [searchQuery, setSearchQuery] = useState('');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesSearch = task.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
      case "in_progress":
        return <Clock className="w-3.5 h-3.5 text-amber-500" />;
      case "blocked":
        return <AlertCircle className="w-3.5 h-3.5 text-rose-500" />;
      default:
        return <Circle className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring outline-none"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="in_progress">In Progress</option>
            <option value="pending">Pending</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 py-1 bg-muted rounded-full">
          {sortedTasks.length} {sortedTasks.length === 1 ? 'task' : 'tasks'} found
        </div>
      </div>
      
      <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
        <table className="min-w-full divide-y divide-border/50" role="table">
          <thead className="bg-muted/30">
            <tr>
              <th
                className="px-6 py-3 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest cursor-pointer hover:text-foreground transition-colors"
                onClick={() => handleSort('description')}
              >
                <div className="flex items-center gap-2">
                  Task Description
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest cursor-pointer hover:text-foreground transition-colors"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-2">
                  Status
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {sortedTasks.map((task) => (
              <tr key={task.id} className="hover:bg-muted/20 transition-colors group">
                <td className="px-6 py-4 text-sm font-medium text-foreground leading-relaxed">
                  {task.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      task.status === 'completed' ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" :
                      task.status === 'in_progress' ? "bg-amber-500/10 text-amber-600 border border-amber-500/20" :
                      "bg-slate-100 text-slate-500 border border-slate-200"
                    )}
                  >
                    {getStatusIcon(task.status)}
                    {task.status.replace('_', ' ')}
                  </span>
                </td>
              </tr>
            ))}
            {sortedTasks.length === 0 && (
              <tr>
                <td colSpan={2} className="px-6 py-12 text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <Filter className="w-8 h-8 opacity-20" />
                    <p>No tasks match your current filters</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskTable;