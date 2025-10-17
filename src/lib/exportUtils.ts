import { SwimSession } from '@/types/swim';

export const exportToJSON = (sessions: SwimSession[], filename: string = 'swimdash-export.json') => {
  const dataStr = JSON.stringify({
    version: '1.0',
    exportDate: new Date().toISOString(),
    sessionCount: sessions.length,
    sessions: sessions,
  }, null, 2);

  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
};

export const exportToCSV = (sessions: SwimSession[], filename: string = 'swimdash-export.csv') => {
  // CSV Headers
  const headers = ['Date', 'Distance (m)', 'Duration (seconds)', 'Pace (sec/100m)', 'Notes'];

  // Convert sessions to CSV rows
  const rows = sessions.map(session => [
    new Date(session.date).toISOString(),
    session.distance.toString(),
    session.duration.toString(),
    session.pace.toFixed(2),
    `"${(session.notes || '').replace(/"/g, '""')}"`, // Escape quotes in notes
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
};

export const importFromJSON = (file: File): Promise<{ sessions: SwimSession[], version: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        // Validate structure
        if (!data.sessions || !Array.isArray(data.sessions)) {
          throw new Error('Invalid export file format');
        }

        // Validate sessions have required fields
        const isValid = data.sessions.every((s: any) =>
          s.id && s.distance && s.duration && s.pace && s.date
        );

        if (!isValid) {
          throw new Error('Export file contains invalid session data');
        }

        resolve({
          sessions: data.sessions,
          version: data.version || '1.0',
        });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};
