// frontend/src/components/TaskTable.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TaskTable, { Task } from './TaskTable';

describe('TaskTable', () => {
  const tasks: Task[] = [
    { id: '1', description: 'Task B', status: 'pending' },
    { id: '2', description: 'Task A', status: 'completed' },
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
    const descriptionHeader = screen.getByRole('columnheader', { name: /data description/i });
    
    // Default is Description ASC.
    const rowsInitial = screen.getAllByRole('row');
    expect(rowsInitial[1]).toHaveTextContent('Task A');
    expect(rowsInitial[2]).toHaveTextContent('Task B');
    expect(rowsInitial[3]).toHaveTextContent('Task C');
    
    // Click to toggle to DESC
    fireEvent.click(descriptionHeader);
    
    const rowsDesc = screen.getAllByRole('row');
    expect(rowsDesc[1]).toHaveTextContent('Task C');
    expect(rowsDesc[2]).toHaveTextContent('Task B');
    expect(rowsDesc[3]).toHaveTextContent('Task A');
  });

  it('should sort tasks by status', () => {
    render(<TaskTable tasks={tasks} />);
    const statusHeader = screen.getByRole('columnheader', { name: /status flag/i });
    
    fireEvent.click(statusHeader);
    
    const rows = screen.getAllByRole('row');
    // Alphabetical status: completed, in_progress, pending
    expect(rows[1]).toHaveTextContent(/completed/i);
    expect(rows[2]).toHaveTextContent(/in_progress/i);
    expect(rows[3]).toHaveTextContent(/pending/i);
  });

  it('should display status badges', () => {
     render(<TaskTable tasks={[{ id: '1', description: 'Task 1', status: 'completed' }]} />);
     const badges = screen.getAllByRole('cell');
     const badge = badges.find(b => b.tagName === 'SPAN' || b.querySelector('span'));
     const span = badge?.querySelector('span') || badge;
     expect(span).toBeInTheDocument();
     expect(span).toHaveClass('text-brand-success');
  });

  it('should filter tasks by status', () => {
    render(<TaskTable tasks={tasks} />);
    const select = screen.getByRole('combobox', { name: /filter by status/i });
    
    fireEvent.change(select, { target: { value: 'completed' } });
    
    expect(screen.getByText('Task A')).toBeInTheDocument();
    expect(screen.queryByText('Task B')).not.toBeInTheDocument();
    expect(screen.queryByText('Task C')).not.toBeInTheDocument();

    fireEvent.change(select, { target: { value: 'all' } });
    expect(screen.getByText('Task A')).toBeInTheDocument();
    expect(screen.getByText('Task B')).toBeInTheDocument();
    expect(screen.getByText('Task C')).toBeInTheDocument();
  });
});
