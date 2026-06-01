import { Button } from '@/components/ui/button';
import { Loader2, Save, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProfileFormActionsProps {
  hasChanges: boolean;
  isSaving: boolean;
  onCancelChanges: () => void;
}

export function ProfileFormActions({ hasChanges, isSaving, onCancelChanges }: ProfileFormActionsProps) {
  const { language } = useLanguage();
  const copy = language === 'pt'
    ? {
        unsaved: 'Tem alteracoes nao guardadas.',
        saved: 'Tudo esta guardado.',
        cancel: 'Cancelar',
        save: 'Guardar alteracoes',
      }
    : {
        unsaved: 'You have unsaved changes.',
        saved: 'Everything is saved.',
        cancel: 'Cancel',
        save: 'Save Changes',
      };

  return (
    <div className="flex items-center justify-between pt-2">
      <p className="text-sm text-muted-foreground">{hasChanges ? copy.unsaved : copy.saved}</p>
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" disabled={!hasChanges || isSaving} onClick={onCancelChanges}>
          <X className="h-4 w-4 mr-2" />
          {copy.cancel}
        </Button>
        <Button type="submit" disabled={isSaving || !hasChanges} className="min-w-[160px]">
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {copy.save}
        </Button>
      </div>
    </div>
  );
}
