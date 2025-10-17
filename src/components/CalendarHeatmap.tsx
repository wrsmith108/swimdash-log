import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SwimSession {
  distance: number;
  duration: number;
  date: string;
}

interface CalendarHeatmapProps {
  sessions: SwimSession[];
}

export const CalendarHeatmap = ({ sessions }: CalendarHeatmapProps) => {
  const getHeatColor = (distance: number) => {
    if (distance === 0) return "bg-heat-none";
    if (distance < 1000) return "bg-heat-light";
    if (distance < 2000) return "bg-heat-medium";
    return "bg-heat-high";
  };

  // Generate last 4 weeks of calendar data
  const weeks = 4;
  const daysInWeek = 7;
  const today = new Date();
  const calendarData: { date: Date; distance: number }[][] = [];

  for (let week = weeks - 1; week >= 0; week--) {
    const weekData: { date: Date; distance: number }[] = [];
    for (let day = 0; day < daysInWeek; day++) {
      const date = new Date(today);
      date.setDate(today.getDate() - (week * 7 + (6 - day)));
      
      // Find session for this date
      const daySession = sessions.find(s => {
        const sessionDate = new Date(s.date);
        return sessionDate.toDateString() === date.toDateString();
      });
      
      weekData.push({
        date,
        distance: daySession?.distance || 0,
      });
    }
    calendarData.push(weekData);
  }

  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
      <h2 className="text-lg font-semibold mb-4">Monthly Calendar</h2>
      
      <TooltipProvider>
        <div className="space-y-2">
          {/* Day labels */}
          <div className="flex gap-2 mb-1">
            <div className="w-12"></div>
            {dayLabels.map((label, i) => (
              <div key={i} className="w-10 text-center text-xs text-muted-foreground font-medium">
                {label}
              </div>
            ))}
          </div>

          {/* Calendar rows */}
          {calendarData.map((week, weekIndex) => (
            <div key={weekIndex} className="flex gap-2 items-center">
              <div className="w-12 text-xs text-muted-foreground">
                Week {Math.ceil((new Date().getDate() - (weeks - weekIndex - 1) * 7) / 7)}
              </div>
              {week.map((day, dayIndex) => {
                const isFuture = day.date > today;
                return (
                  <Tooltip key={dayIndex}>
                    <TooltipTrigger asChild>
                      <div
                        className={`w-10 h-10 rounded ${getHeatColor(day.distance)} ${
                          isFuture ? 'opacity-30' : 'cursor-pointer hover:ring-2 hover:ring-primary/50'
                        } transition-all`}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-medium">{day.date.toLocaleDateString()}</p>
                      <p className="text-sm">
                        {day.distance > 0 ? `${day.distance}m` : 'No swim'}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          ))}

          {/* Legend */}
          <div className="flex gap-4 pt-2 text-xs text-muted-foreground items-center">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-6 h-6 bg-heat-none rounded"></div>
              <div className="w-6 h-6 bg-heat-light rounded"></div>
              <div className="w-6 h-6 bg-heat-medium rounded"></div>
              <div className="w-6 h-6 bg-heat-high rounded"></div>
            </div>
            <span>More</span>
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
};
