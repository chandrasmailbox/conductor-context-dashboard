import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TaskTable from './TaskTable';
import type { Task } from './TaskTable';

describe('TaskTable', () => {
  const tasks: Task[] = [
    { id: '1', description: 'Task A', status: 'completed' },
    { id: '2', description: 'Task B', status: 'pending' },
    { id: '3', description: 'Task C', status: 'in_progress' },
  ];

  it('should render all tasks', () => {
    render(<TaskTable tasks={tasks} />);
    expect(screen.getByText('Task A')).toBeInTheDocument();
    expect(screen.getByText('Task B')).toBeInTheDocument();
    expect(screen.getByText('Task C')).toBeInTheDocument();
  });

  it('should sort tasks by description', () => {
    render(<TaskTable tasks={tasks} />);
    const descriptionHeader = screen.getByText(/Task Description/i);

    // Default is Description ASC.
    const rows = screen.getAllByRole('row').slice(1); // Exclude header
    expect(rows[0]).toHaveTextContent('Task A');

    fireEvent.click(descriptionHeader); // Sort DESC
    const rowsDesc = screen.getAllByRole('row').slice(1);
    expect(rowsDesc[0]).toHaveTextContent('Task C');
  });

  it('should sort tasks by status', () => {
    render(<TaskTable tasks={tasks} />);
    // Select specifically the column header
    const statusHeader = screen.getByRole('columnheader', { name: /Status/i });

    fireEvent.click(statusHeader); // Sort ASC
    const rowsAsc = screen.getAllByRole('row').slice(1);
    // completed, in_progress, pending
    expect(rowsAsc[0]).toHaveTextContent('completed');
  });

  it('should display status badges', () => {
     render(<TaskTable tasks={tasks} />);
     // Query within the table to find the badge
     const table = screen.getByRole('table');
     const badge = screen.getAllByText(/completed/i).find(el => table.contains(el));
     expect(badge).toBeInTheDocument();
     expect(badge).toHaveClass('text-emerald-600');
  });

  it('should filter tasks by status', () => {
    render(<TaskTable tasks={tasks} />);
    const select = screen.getByRole('combobox');

    fireEvent.change(select, { target: { value: 'completed' } });
    expect(screen.getByText('Task A')).toBeInTheDocument();
    expect(screen.queryByText('Task B')).not.toBeInTheDocument();
  });
});
