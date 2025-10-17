import React, { createContext, useContext, ReactNode } from 'react';
import { useSwimSessions } from '@/hooks/useSwimSessions';
import { SwimSession } from '@/types/swim';

interface SwimSessionsContextType {
  sessions: SwimSession[];
  saveSession: (session: Omit<SwimSession, 'id'>) => { success: boolean; session?: SwimSession; error?: any; errorType?: string };
  deleteSession: (id: string) => { success: boolean; error?: any };
  getRecentSessions: (count?: number) => SwimSession[];
  getSessionsByDateRange: (startDate: Date, endDate: Date) => SwimSession[];
  getStatistics: () => {
    totalSessions: number;
    totalDistance: number;
    totalDuration: number;
    averagePace: number;
    averageDistance: number;
    averageDuration: number;
  };
  importSessions: (sessions: SwimSession[], mode: 'merge' | 'replace') => { success: boolean; error?: any };
}

const SwimSessionsContext = createContext<SwimSessionsContextType | undefined>(undefined);

export const SwimSessionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const swimSessions = useSwimSessions();

  return (
    <SwimSessionsContext.Provider value={swimSessions}>
      {children}
    </SwimSessionsContext.Provider>
  );
};

export const useSwimSessionsContext = () => {
  const context = useContext(SwimSessionsContext);
  if (context === undefined) {
    throw new Error('useSwimSessionsContext must be used within a SwimSessionsProvider');
  }
  return context;
};