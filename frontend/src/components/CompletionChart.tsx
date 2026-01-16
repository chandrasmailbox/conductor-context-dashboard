import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";

interface CompletionChartProps {
  completed: number;
  total: number;
}

export default function CompletionChart({ completed, total }: CompletionChartProps) {
  // Ensure we don't have a 0 total for the chart data
  const isDataEmpty = total === 0;

  const data = isDataEmpty 
    ? [{ name: "No Tasks", value: 1 }]
    : [
        { name: "Completed", value: completed },
        { name: "Remaining", value: Math.max(0, total - completed) },
      ];

  // Using specific colors to match the "Completed" status (Emerald) across the UI
  const COLORS = isDataEmpty 
    ? ["var(--color-muted)"] 
    : ["#10b981", "var(--color-muted)"]; // emerald-500 for Completed

  return (
    <Card className="border card-hover" data-testid="completion-chart">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs uppercase tracking-widest font-bold text-muted-foreground">
          Task Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full flex items-center justify-center">
          {total >= 0 ? (
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={750}
                  isAnimationActive={true}
                >
                  {data.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--color-card))",
                    borderColor: "hsl(var(--color-border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "hsl(var(--color-foreground))"
                  }}
                  itemStyle={{ color: "hsl(var(--color-foreground))" }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <div className="w-20 h-20 rounded-full border-8 border-muted flex items-center justify-center mb-2">
                <span className="text-[10px] font-bold">0%</span>
              </div>
              <p className="text-[10px] uppercase font-bold tracking-tighter">No tasks found</p>
            </div>
          )}
        </div>
        
        {total > 0 && (
          <div className="flex justify-center gap-4 mt-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Done</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-muted" />
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Remaining</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}