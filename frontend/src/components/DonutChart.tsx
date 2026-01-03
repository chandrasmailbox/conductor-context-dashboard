// frontend/src/components/DonutChart.tsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface DonutChartProps {
  progress: number;
}

const DonutChart: React.FC<DonutChartProps> = ({ progress }) => {
  const data = [
    { name: 'Completed', value: progress },
    { name: 'Remaining', value: Math.max(0, 100 - progress) },
  ];

  // Colors will be handled by CSS variables if possible, or we can use computed styles
  const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--brand-primary').trim() || '#3b82f6';
  const overlayColor = getComputedStyle(document.documentElement).getPropertyValue('--brand-bg-overlay').trim() || '#1e293b';
  
  const COLORS = [primaryColor, overlayColor];

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="w-48 h-48 md:w-56 md:h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="70%"
              outerRadius="90%"
              paddingAngle={2}
              dataKey="value"
              stroke="none"
              animationDuration={1000}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-4xl font-mono font-bold text-brand-text-primary tracking-tighter">{progress}%</span>
        <span className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest mt-1">Percent</span>
      </div>
    </div>
  );
};

export default DonutChart;