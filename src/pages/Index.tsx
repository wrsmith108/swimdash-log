import { useState, useEffect } from "react";
import { QuickLogForm } from "@/components/QuickLogForm";
import { WeeklyChart } from "@/components/WeeklyChart";
import { CalendarHeatmap } from "@/components/CalendarHeatmap";
import { RecentSessions } from "@/components/RecentSessions";
import { GoalProgressBar } from "@/components/GoalProgressBar";
import { Waves } from "lucide-react";

interface SwimSession {
  id: string;
  distance: number;
  duration: number;
  date: string;
  notes?: string;
}

const STORAGE_KEY = 'swim-tracker-sessions';
const GOAL_STORAGE_KEY = 'swim-tracker-goal';

const Index = () => {
  const [sessions, setSessions] = useState<SwimSession[]>([]);
  const [goal, setGoal] = useState({ distance: 5000, type: 'weekly' as 'weekly' | 'monthly' });

  // Load sessions from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const storedGoal = localStorage.getItem(GOAL_STORAGE_KEY);
    
    if (stored) {
      setSessions(JSON.parse(stored));
    }
    if (storedGoal) {
      setGoal(JSON.parse(storedGoal));
    }
  }, []);

  // Save sessions to localStorage
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    }
  }, [sessions]);

  const handleLogSwim = (data: { distance: number; duration: number; notes?: string; date: string }) => {
    const newSession: SwimSession = {
      id: Date.now().toString(),
      ...data,
    };
    setSessions(prev => [...prev, newSession]);
  };

  // Calculate current week's progress
  const getWeekStart = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Start week on Monday
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() + diff);
    weekStart.setHours(0, 0, 0, 0);
    return weekStart;
  };

  const weekStart = getWeekStart();
  const thisWeekSessions = sessions.filter(s => new Date(s.date) >= weekStart);
  const currentWeekDistance = thisWeekSessions.reduce((sum, s) => sum + s.distance, 0);

  // Get current week number
  const getWeekNumber = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date.getTime() - firstDay.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + firstDay.getDay() + 1) / 7);
  };

  const currentWeek = getWeekNumber(new Date());

  // Get last logged values for defaults
  const lastSession = sessions.length > 0 ? sessions[sessions.length - 1] : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Waves className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">SwimTracker</h1>
                <p className="text-sm text-muted-foreground">Week {currentWeek}</p>
              </div>
            </div>
          </div>
          
          <GoalProgressBar 
            currentDistance={currentWeekDistance}
            goalDistance={goal.distance}
            goalType={goal.type}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Quick Log */}
          <div className="lg:col-span-1">
            <QuickLogForm 
              onSubmit={handleLogSwim}
              lastDistance={lastSession?.distance.toString()}
              lastDuration={lastSession?.duration}
            />
          </div>

          {/* Right Column - Progress & Data */}
          <div className="lg:col-span-2 space-y-6">
            <WeeklyChart 
              sessions={sessions}
              goalDistance={goal.type === 'weekly' ? goal.distance : undefined}
            />
            
            <CalendarHeatmap sessions={sessions} />
            
            <RecentSessions sessions={sessions} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
