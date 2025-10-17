export interface SwimSession {
  id: string;
  distance: number; // in meters
  duration: number; // in seconds
  pace: number; // seconds per 100m
  date: string; // ISO string
  notes?: string;
}

export interface SwimSessionFormData {
  distance: number;
  duration: string; // time format string (MM:SS or HH:MM:SS)
  notes?: string;
}