import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check } from "lucide-react";

const DISTANCE_PRESETS = [
  { value: "500", label: "500m" },
  { value: "1000", label: "1000m" },
  { value: "1500", label: "1500m" },
  { value: "2000", label: "2000m" },
  { value: "2500", label: "2500m" },
];

interface QuickLogFormProps {
  onSubmit: (data: { distance: number; duration: number; notes?: string; date: string }) => void;
  lastDistance?: string;
  lastDuration?: number;
}

export const QuickLogForm = ({ onSubmit, lastDistance = "1500", lastDuration = 30 }: QuickLogFormProps) => {
  const [distance, setDistance] = useState(lastDistance);
  const [duration, setDuration] = useState(lastDuration.toString());
  const [notes, setNotes] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const calculatePace = () => {
    const dist = parseInt(distance);
    const dur = parseInt(duration);
    if (dist && dur) {
      const pacePerHundred = (dur / (dist / 100)).toFixed(2);
      const minutes = Math.floor(Number(pacePerHundred));
      const seconds = Math.round((Number(pacePerHundred) - minutes) * 60);
      return `${minutes}:${seconds.toString().padStart(2, '0')}/100m`;
    }
    return "--:--/100m";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      distance: parseInt(distance),
      duration: parseInt(duration),
      notes: notes || undefined,
      date: new Date().toISOString(),
    });
    
    setIsSuccess(true);
    setNotes("");
    setTimeout(() => setIsSuccess(false), 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-lg p-6 shadow-sm border border-border">
      <h2 className="text-lg font-semibold mb-4">Log Today's Swim</h2>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="distance" className="text-sm font-medium mb-1.5 block">
            Distance
          </Label>
          <Select value={distance} onValueChange={setDistance}>
            <SelectTrigger id="distance" className="h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DISTANCE_PRESETS.map((preset) => (
                <SelectItem key={preset.value} value={preset.value}>
                  {preset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="duration" className="text-sm font-medium mb-1.5 block">
            Time (minutes)
          </Label>
          <Input
            id="duration"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            min="1"
            className="h-11"
            required
          />
        </div>

        <div>
          <Label htmlFor="notes" className="text-sm font-medium mb-1.5 block">
            Notes (optional)
          </Label>
          <Input
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How did it feel?"
            className="h-9"
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            className={`w-full h-13 text-base font-semibold transition-all ${
              isSuccess ? "bg-secondary hover:bg-secondary" : ""
            }`}
          >
            {isSuccess ? (
              <span className="flex items-center gap-2 animate-scale-success">
                <Check className="w-5 h-5" />
                Logged!
              </span>
            ) : (
              "Log Swim →"
            )}
          </Button>
        </div>

        <div className="text-sm text-muted-foreground text-center pt-1">
          Pace: {calculatePace()}
        </div>
      </div>
    </form>
  );
};
