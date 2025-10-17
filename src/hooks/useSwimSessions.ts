import { useState, useEffect } from 'react';
import { SwimSession } from '@/types/swim';

const STORAGE_KEY = 'swimSessions';

export const useSwimSessions = () => {
  const [sessions, setSessions] = useState<SwimSession[]>([]);

  // Load sessions from localStorage on mount
  useEffect(() => {
    const loadSessions = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        console.log('Loading sessions from localStorage:', stored);
        if (stored) {
          const parsedSessions = JSON.parse(stored) as SwimSession[];
          console.log('Parsed sessions:', parsedSessions);
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSessions));
      console.log('Saved sessions to localStorage:', updatedSessions);
      setSessions(updatedSessions);
      return { success: true, session: newSession };
    } catch (error) {
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

  return {
    sessions,
    saveSession,
    deleteSession,
    getRecentSessions,
    getSessionsByDateRange,
    getStatistics,
  };
};