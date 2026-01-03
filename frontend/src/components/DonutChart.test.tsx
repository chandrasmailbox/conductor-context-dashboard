// frontend/src/components/DonutChart.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DonutChart from './DonutChart';

// Mock Recharts
vi.mock('recharts', () => ({
  PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
}));

describe('DonutChart', () => {
  it('should render the chart container', () => {
    render(<DonutChart progress={75} />);
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });

  it('should display the progress percentage text', () => {
    render(<DonutChart progress={75} />);
    expect(screen.getByText(/75/)).toBeInTheDocument();
    expect(screen.getByText(/%/)).toBeInTheDocument();
    expect(screen.getByText(/percent/i)).toBeInTheDocument();
  });
});