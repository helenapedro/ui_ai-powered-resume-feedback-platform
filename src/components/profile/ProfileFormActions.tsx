import { Button } from '@/components/ui/button';
import { Loader2, Save, X } from 'lucide-react';

interface ProfileFormActionsProps {
  hasChanges: boolean;
  isSaving: boolean;
  onCancelChanges: () => void;
}

export function ProfileFormActions({ hasChanges, isSaving, onCancelChanges }: ProfileFormActionsProps) {
  return (
    <div className="flex items-center justify-between pt-2">
      <p className="text-sm text-muted-foreground">{hasChanges ? 'You have unsaved changes.' : 'Everything is saved.'}</p>
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" disabled={!hasChanges || isSaving} onClick={onCancelChanges}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving || !hasChanges} className="min-w-[160px]">
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>
    </div>
  );
}
