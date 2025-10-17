interface GoalProgressBarProps {
  currentDistance: number;
  goalDistance: number;
  goalType: 'weekly' | 'monthly';
}

export const GoalProgressBar = ({ currentDistance, goalDistance, goalType }: GoalProgressBarProps) => {
  const percentage = Math.min((currentDistance / goalDistance) * 100, 100);
  const remaining = Math.max(goalDistance - currentDistance, 0);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">
          Goal: {(goalDistance / 1000).toFixed(1)}km {goalType}
        </span>
        <span className="text-muted-foreground">
          {percentage.toFixed(0)}% · {remaining}m to go
        </span>
      </div>
      
      <div className="relative h-6 bg-muted rounded-full overflow-hidden">
        <div 
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent to-secondary transition-all duration-500 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        />
        {percentage >= 100 && (
          <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
            Goal Achieved! 🎉
          </div>
        )}
      </div>
    </div>
  );
};
