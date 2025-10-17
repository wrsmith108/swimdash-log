import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useSwimSessionsContext } from "@/contexts/SwimSessionsContext";
import { SwimSessionFormData } from "@/types/swim";
import { Check } from "lucide-react";

// Helper function to parse time string to seconds
const parseTimeToSeconds = (timeStr: string): number => {
  const parts = timeStr.split(':').map(part => parseInt(part, 10));
  
  if (parts.length === 2) {
    // MM:SS format
    const [minutes, seconds] = parts;
    return minutes * 60 + seconds;
  } else if (parts.length === 3) {
    // HH:MM:SS format
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  }
  
  return 0;
};

// Helper function to format seconds to time string
const formatSecondsToTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Validation function for time format
const validateTimeFormat = (value: string): boolean | string => {
  if (!value) return "Duration is required";

  // Check basic format (MM:SS or HH:MM:SS)
  const timeRegex = /^(?:(\d+):)?([0-5]?[0-9]):([0-5]?[0-9])$/;

  if (!timeRegex.test(value)) {
    return "Please enter time in MM:SS or HH:MM:SS format (e.g., 25:30 or 1:05:45)";
  }

  const parts = value.split(':').map(p => parseInt(p, 10));

  // Validate based on format
  if (parts.length === 2) {
    // MM:SS format
    const [minutes, seconds] = parts;

    if (seconds >= 60) return "Seconds must be less than 60";
    if (minutes < 0 || seconds < 0) return "Time values must be positive";
    if (isNaN(minutes) || isNaN(seconds)) return "Invalid time format";

    // Check for reasonable duration (not 00:00, not more than 10 hours)
    const totalSeconds = minutes * 60 + seconds;
    if (totalSeconds === 0) return "Duration must be greater than 0";
    if (totalSeconds > 36000) return "Duration seems too long (max 10 hours)";

  } else if (parts.length === 3) {
    // HH:MM:SS format
    const [hours, minutes, seconds] = parts;

    if (minutes >= 60) return "Minutes must be less than 60";
    if (seconds >= 60) return "Seconds must be less than 60";
    if (hours < 0 || minutes < 0 || seconds < 0) return "Time values must be positive";
    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) return "Invalid time format";

    // Check for reasonable duration
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    if (totalSeconds === 0) return "Duration must be greater than 0";
    if (totalSeconds > 36000) return "Duration seems too long (max 10 hours)";
  }

  return true;
};

export const QuickLogForm = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const { saveSession } = useSwimSessionsContext();
  
  const form = useForm<SwimSessionFormData>({
    defaultValues: {
      distance: undefined,
      duration: "",
      notes: "",
    },
  });

  const calculatePace = (distance: number, durationStr: string): number => {
    const durationSeconds = parseTimeToSeconds(durationStr);
    if (distance && durationSeconds) {
      // Calculate seconds per 100m
      return (durationSeconds / (distance / 100));
    }
    return 0;
  };

  const formatPace = (paceSeconds: number): string => {
    if (paceSeconds === 0) return "--:--/100m";
    
    const minutes = Math.floor(paceSeconds / 60);
    const seconds = Math.round(paceSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}/100m`;
  };

  const onSubmit = (data: SwimSessionFormData) => {
    const durationSeconds = parseTimeToSeconds(data.duration);
    const pace = calculatePace(data.distance, data.duration);
    
    const result = saveSession({
      distance: data.distance,
      duration: durationSeconds,
      pace: pace,
      date: new Date().toISOString(),
      notes: data.notes || undefined,
    });

    if (result.success) {
      setIsSuccess(true);
      toast({
        title: "Swim session logged!",
        description: `${data.distance}m in ${data.duration} (${formatPace(pace)})`,
      });

      // Reset form after successful submission
      form.reset({
        distance: undefined,
        duration: "",
        notes: "",
      });

      setTimeout(() => setIsSuccess(false), 2000);
    } else {
      // Handle quota exceeded specifically
      if (result.errorType === 'QUOTA_EXCEEDED') {
        toast({
          title: "Storage limit reached",
          description: "Please export and delete old sessions to continue logging new swims.",
          variant: "destructive",
          duration: 10000, // Show longer for important error
        });
      } else {
        toast({
          title: "Error saving session",
          description: "Please try again",
          variant: "destructive",
        });
      }
    }
  };

  const watchDistance = form.watch("distance");
  const watchDuration = form.watch("duration");
  
  // Calculate pace in real-time for display
  const currentPace = (() => {
    const distance = watchDistance;
    const duration = watchDuration;
    
    if (distance && duration && validateTimeFormat(duration) === true) {
      const pace = calculatePace(distance, duration);
      return formatPace(pace);
    }
    return "--:--/100m";
  })();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="bg-card rounded-lg p-6 shadow-sm border border-border">
        <h2 className="text-2xl font-semibold mb-4">Log Today's Swim</h2>
        
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="distance"
            rules={{
              required: "Distance is required",
              min: {
                value: 1,
                message: "Distance must be positive"
              },
              validate: (value) => {
                if (!value || value <= 0) return "Distance must be a positive number";
                if (!Number.isInteger(value)) return "Distance must be a whole number";
                return true;
              }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Distance (meters)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g., 1500"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    min="1"
                    step="1"
                    className="h-11"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            rules={{
              required: "Duration is required",
              validate: validateTimeFormat,
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration</FormLabel>
                <FormControl>
                  <Input
                    placeholder="MM:SS or HH:MM:SS (e.g., 25:30)"
                    {...field}
                    className="h-11"
                  />
                </FormControl>
                <p className="text-xs text-muted-foreground mt-1">
                  Examples: 25:30 (25min 30sec) or 1:05:45 (1hr 5min 45sec)
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes (optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="How did it feel?"
                    {...field}
                    className="h-9"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-2">
            <Button
              type="submit"
              className={`w-full h-13 text-base font-semibold transition-all ${
                isSuccess ? "bg-green-600 hover:bg-green-600" : ""
              }`}
              disabled={form.formState.isSubmitting}
            >
              {isSuccess ? (
                <span className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  Logged!
                </span>
              ) : (
                "Log Swim →"
              )}
            </Button>
          </div>

          <div className="text-sm text-muted-foreground text-center pt-1">
            Pace: {currentPace}
          </div>
        </div>
      </form>
    </Form>
  );
};
