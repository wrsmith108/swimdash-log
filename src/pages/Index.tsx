import { QuickLogForm } from "@/components/QuickLogForm";
import { RecentSessions } from "@/components/RecentSessions";
import { DataManagement } from "@/components/DataManagement";
import { SwimSessionsProvider } from "@/contexts/SwimSessionsContext";
import { Waves } from "lucide-react";

const Index = () => {
  return (
    <SwimSessionsProvider>
      <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Waves className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">SwimDash - Quick Swim Logger</h1>
              <p className="text-sm text-muted-foreground">Track your swimming sessions</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Left Column - Quick Log Form & Data Management */}
          <div className="w-full space-y-6">
            <QuickLogForm />
            <DataManagement />
          </div>

          {/* Right Column - Recent Sessions */}
          <div className="w-full">
            <RecentSessions />
          </div>
        </div>
      </main>
    </div>
    </SwimSessionsProvider>
  );
};

export default Index;
