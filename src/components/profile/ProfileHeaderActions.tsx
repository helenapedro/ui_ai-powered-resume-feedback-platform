import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw } from 'lucide-react';

interface ProfileHeaderActionsProps {
  displayName: string;
  onBack: () => void;
  onRefresh: () => void;
}

export function ProfileHeaderActions({ displayName, onBack, onRefresh }: ProfileHeaderActionsProps) {
  return (
    <div className="mb-8 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
      <p className="text-muted-foreground mt-1">
        Welcome, {displayName}. Update your personal information and preferences.
      </p>
    </div>
  );
}
