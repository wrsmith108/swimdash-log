import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

interface SwimSession {
  distance: number;
  duration: number;
  date: string;
}

interface WeeklyChartProps {
  sessions: SwimSession[];
  goalDistance?: number;
}

export const WeeklyChart = ({ sessions, goalDistance }: WeeklyChartProps) => {
  // Group sessions by week and calculate totals
  const getWeekNumber = (date: string) => {
    const d = new Date(date);
    const firstDay = new Date(d.getFullYear(), 0, 1);
    const days = Math.floor((d.getTime() - firstDay.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + firstDay.getDay() + 1) / 7);
  };

  const weeklyData = sessions.reduce((acc, session) => {
    const week = getWeekNumber(session.date);
    const year = new Date(session.date).getFullYear();
    const key = `Week ${week}`;
    
    if (!acc[key]) {
      acc[key] = { week: key, distance: 0, count: 0 };
    }
    acc[key].distance += session.distance;
    acc[key].count += 1;
    return acc;
  }, {} as Record<string, { week: string; distance: number; count: number }>);

  const chartData = Object.values(weeklyData)
    .sort((a, b) => {
      const weekA = parseInt(a.week.split(' ')[1]);
      const weekB = parseInt(b.week.split(' ')[1]);
      return weekA - weekB;
    })
    .slice(-4); // Last 4 weeks

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
      <h2 className="text-2xl font-semibold mb-4">Weekly Progress</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="week" 
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
          />
          <YAxis 
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            label={{ value: 'Distance (m)', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '0.5rem'
            }}
          />
          {goalDistance && (
            <ReferenceLine 
              y={goalDistance} 
              stroke="hsl(var(--muted-foreground))" 
              strokeDasharray="5 5"
              label={{ value: 'Goal', fill: 'hsl(var(--muted-foreground))' }}
            />
          )}
          <Line 
            type="monotone" 
            dataKey="distance" 
            stroke="hsl(var(--primary))" 
            strokeWidth={3}
            dot={{ fill: 'hsl(var(--primary))', r: 6 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
