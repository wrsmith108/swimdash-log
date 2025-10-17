import { format } from "date-fns";
import { useSwimSessionsContext } from "@/contexts/SwimSessionsContext";
import { SwimSession } from "@/types/swim";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const RecentSessions = () => {
  const { sessions } = useSwimSessionsContext();

  // Format duration from seconds to MM:SS or HH:MM:SS
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Format pace from seconds per 100m to MM:SS
  const formatPace = (paceInSeconds: number): string => {
    const minutes = Math.floor(paceInSeconds / 60);
    const seconds = Math.round(paceInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Sort sessions by date (most recent first)
  const sortedSessions = [...sessions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (sortedSessions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No swims logged yet</p>
            <p className="text-xs mt-1">Your sessions will appear here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedSessions.map((session) => (
            <div 
              key={session.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-baseline gap-2 text-sm sm:text-base">
                  <span className="font-semibold text-foreground">
                    {session.distance}m
                  </span>
                  <span className="text-muted-foreground">
                    •
                  </span>
                  <span className="text-muted-foreground">
                    {formatDuration(session.duration)}
                  </span>
                  <span className="text-muted-foreground">
                    •
                  </span>
                  <span className="text-muted-foreground">
                    {formatPace(session.pace)}/100m
                  </span>
                </div>
                {session.notes && (
                  <p className="text-xs sm:text-sm text-muted-foreground italic line-clamp-2">
                    {session.notes}
                  </p>
                )}
              </div>
              <div className="text-sm text-muted-foreground mt-2 sm:mt-0 sm:ml-4 sm:text-right">
                <div className="font-medium">
                  {format(new Date(session.date), 'MMM d, yyyy')}
                </div>
                <div className="text-xs">
                  {format(new Date(session.date), 'h:mm a')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
