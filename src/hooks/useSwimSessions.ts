import { useState, useEffect } from 'react';
import { SwimSession } from '@/types/swim';

const STORAGE_KEY = 'swimSessions';
const MAX_SESSIONS_WARNING = 500; // Warn user before hitting quota

// Helper to estimate storage size in bytes
const getStorageSize = (): number => {
  let total = 0;
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  return total;
};

// Helper to check if storage is approaching limit (4MB threshold out of typical 5-10MB)
const isStorageNearLimit = (): boolean => {
  const sizeInBytes = getStorageSize();
  const sizeInMB = sizeInBytes / (1024 * 1024);
  return sizeInMB > 4;
};

export const useSwimSessions = () => {
  const [sessions, setSessions] = useState<SwimSession[]>([]);

  // Load sessions from localStorage on mount
  useEffect(() => {
    const loadSessions = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsedSessions = JSON.parse(stored) as SwimSession[];
          setSessions(parsedSessions);
        }
      } catch (error) {
        console.error('Error loading swim sessions from localStorage:', error);
      }
    };

    loadSessions();
  }, []);

  // Save a new session
  const saveSession = (session: Omit<SwimSession, 'id'>) => {
    const newSession: SwimSession = {
      ...session,
      id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    const updatedSessions = [newSession, ...sessions];

    try {
      // Check if approaching storage limit
      if (isStorageNearLimit()) {
        console.warn('Storage approaching limit. Consider exporting old data.');
      }

      // Check if too many sessions
      if (updatedSessions.length > MAX_SESSIONS_WARNING) {
        console.warn(`You have ${updatedSessions.length} sessions. Consider exporting and archiving old data.`);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSessions));
      setSessions(updatedSessions);
      return { success: true, session: newSession };
    } catch (error) {
      // Handle quota exceeded error specifically
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.error('Storage quota exceeded. Please export and delete old sessions.');
        return {
          success: false,
          error: 'Storage limit reached. Please export and delete old sessions to continue.',
          errorType: 'QUOTA_EXCEEDED' as const
        };
      }

      console.error('Error saving swim session to localStorage:', error);
      return { success: false, error };
    }
  };

  // Delete a session
  const deleteSession = (id: string) => {
    const updatedSessions = sessions.filter(session => session.id !== id);
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSessions));
      setSessions(updatedSessions);
      return { success: true };
    } catch (error) {
      console.error('Error deleting swim session from localStorage:', error);
      return { success: false, error };
    }
  };

  // Get recent sessions (last N sessions)
  const getRecentSessions = (count: number = 5) => {
    return sessions.slice(0, count);
  };

  // Get sessions for a specific date range
  const getSessionsByDateRange = (startDate: Date, endDate: Date) => {
    return sessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= startDate && sessionDate <= endDate;
    });
  };

  // Calculate statistics
  const getStatistics = () => {
    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        totalDistance: 0,
        totalDuration: 0,
        averagePace: 0,
        averageDistance: 0,
        averageDuration: 0,
      };
    }

    const totalDistance = sessions.reduce((sum, session) => sum + session.distance, 0);
    const totalDuration = sessions.reduce((sum, session) => sum + session.duration, 0);
    const totalPace = sessions.reduce((sum, session) => sum + session.pace, 0);

    return {
      totalSessions: sessions.length,
      totalDistance,
      totalDuration,
      averagePace: totalPace / sessions.length,
      averageDistance: totalDistance / sessions.length,
      averageDuration: totalDuration / sessions.length,
    };
  };

  // Import sessions (merge or replace)
  const importSessions = (importedSessions: SwimSession[], mode: 'merge' | 'replace') => {
    try {
      let updatedSessions: SwimSession[];

      if (mode === 'replace') {
        updatedSessions = importedSessions;
      } else {
        // Merge: deduplicate by ID
        const existingIds = new Set(sessions.map(s => s.id));
        const newSessions = importedSessions.filter(s => !existingIds.has(s.id));
        updatedSessions = [...sessions, ...newSessions];
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSessions));
      setSessions(updatedSessions);
      return { success: true };
    } catch (error) {
      console.error('Error importing sessions:', error);
      return { success: false, error };
    }
  };

  return {
    sessions,
    saveSession,
    deleteSession,
    getRecentSessions,
    getSessionsByDateRange,
    getStatistics,
    importSessions,
  };
};