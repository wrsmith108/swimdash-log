import { format } from "date-fns";

interface SwimSession {
  id: string;
  distance: number;
  duration: number;
  date: string;
  notes?: string;
}

interface RecentSessionsProps {
  sessions: SwimSession[];
}

export const RecentSessions = ({ sessions }: RecentSessionsProps) => {
  const calculatePace = (distance: number, duration: number) => {
    const pacePerHundred = (duration / (distance / 100));
    const minutes = Math.floor(pacePerHundred);
    const seconds = Math.round((pacePerHundred - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const sortedSessions = [...sessions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 10);

  if (sortedSessions.length === 0) {
    return (
      <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
        <h2 className="text-2xl font-semibold mb-4">Recent Sessions</h2>
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">No swims logged yet</p>
          <p className="text-xs mt-1">Your sessions will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
      <h2 className="text-2xl font-semibold mb-4">Recent Sessions</h2>
      
      <div className="space-y-3">
        {sortedSessions.map((session) => (
          <div 
            key={session.id}
            className="flex items-center justify-between p-3 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-foreground">{session.distance}m</span>
                <span className="text-sm text-muted-foreground">
                  {session.duration} min
                </span>
                <span className="text-xs text-muted-foreground">
                  · {calculatePace(session.distance, session.duration)}/100m
                </span>
              </div>
              {session.notes && (
                <p className="text-xs text-muted-foreground mt-1 italic">
                  {session.notes}
                </p>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {format(new Date(session.date), 'MMM d')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
