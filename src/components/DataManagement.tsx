import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Upload, FileJson, FileSpreadsheet } from 'lucide-react';
import { useSwimSessionsContext } from '@/contexts/SwimSessionsContext';
import { useToast } from '@/hooks/use-toast';
import { exportToJSON, exportToCSV, importFromJSON } from '@/lib/exportUtils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export const DataManagement = () => {
  const { sessions, importSessions } = useSwimSessionsContext();
  const { toast } = useToast();
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  const handleExportJSON = () => {
    try {
      const filename = `swimdash-export-${new Date().toISOString().split('T')[0]}.json`;
      exportToJSON(sessions, filename);
      toast({
        title: 'Export successful',
        description: `Exported ${sessions.length} sessions to JSON`,
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'There was an error exporting your data',
        variant: 'destructive',
      });
    }
  };

  const handleExportCSV = () => {
    try {
      const filename = `swimdash-export-${new Date().toISOString().split('T')[0]}.csv`;
      exportToCSV(sessions, filename);
      toast({
        title: 'Export successful',
        description: `Exported ${sessions.length} sessions to CSV`,
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'There was an error exporting your data',
        variant: 'destructive',
      });
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const { sessions: importedSessions } = await importFromJSON(file);

      // Ask user how to handle import (merge or replace)
      const shouldMerge = window.confirm(
        `Import ${importedSessions.length} sessions?\n\n` +
        `Click OK to MERGE with existing data (${sessions.length} sessions).\n` +
        `Click Cancel to REPLACE all existing data.`
      );

      if (shouldMerge) {
        importSessions(importedSessions, 'merge');
        toast({
          title: 'Import successful',
          description: `Merged ${importedSessions.length} sessions with existing data`,
        });
      } else {
        importSessions(importedSessions, 'replace');
        toast({
          title: 'Import successful',
          description: `Replaced all data with ${importedSessions.length} imported sessions`,
        });
      }

      setIsImportDialogOpen(false);
      // Reset the file input
      event.target.value = '';
    } catch (error) {
      toast({
        title: 'Import failed',
        description: error instanceof Error ? error.message : 'Invalid file format',
        variant: 'destructive',
      });
      event.target.value = '';
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Data Management</h3>

      <div className="space-y-3">
        <div className="flex gap-2">
          <Button onClick={handleExportJSON} variant="outline" className="flex-1">
            <FileJson className="w-4 h-4 mr-2" />
            Export JSON
          </Button>
          <Button onClick={handleExportCSV} variant="outline" className="flex-1">
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <Upload className="w-4 h-4 mr-2" />
              Import Data
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Import Swim Sessions</DialogTitle>
              <DialogDescription>
                Import your swim sessions from a JSON export file. You can choose to merge with
                existing data or replace it entirely.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary file:text-primary-foreground
                  hover:file:bg-primary/90"
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <p className="text-xs text-muted-foreground mt-4">
        {sessions.length} session{sessions.length !== 1 ? 's' : ''} stored locally
      </p>
    </Card>
  );
};
