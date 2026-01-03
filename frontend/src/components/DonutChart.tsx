// frontend/src/components/DonutChart.tsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface DonutChartProps {
  progress: number;
}

const DonutChart: React.FC<DonutChartProps> = ({ progress }) => {
  const data = [
    { name: 'Completed', value: progress },
    { name: 'Remaining', value: 100 - progress },
  ];

  const COLORS = ['#3b82f6', '#1e293b']; // Blue-500, Slate-800

  return (
    <div className="relative w-full h-48 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={85}
            paddingAngle={0}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
                className={index === 0 ? 'drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : ''}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-mono font-black text-white leading-none">
          {Math.round(progress)}
        </span>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Percent</span>
      </div>
    </div>
  );
};

export default DonutChart;