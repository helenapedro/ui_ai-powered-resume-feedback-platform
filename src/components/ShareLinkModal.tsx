import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Loader2, Link as LinkIcon } from 'lucide-react';
import type { SharePermission } from '@/types';

interface ShareLinkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (permission: SharePermission, expiresAt?: string) => Promise<void>;
  isLoading: boolean;
}

export function ShareLinkModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: ShareLinkModalProps) {
  const [permission, setPermission] = useState<SharePermission>('VIEW');
  const [expiresAt, setExpiresAt] = useState('');

  const handleSubmit = async () => {
    await onSubmit(permission, expiresAt || undefined);
    setPermission('VIEW');
    setExpiresAt('');
  };

  // Get tomorrow's date as minimum
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            Gerar Link de Partilha
          </DialogTitle>
          <DialogDescription>
            Crie um link para partilhar este currículo com outras pessoas.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label>Permissões</Label>
            <RadioGroup
              value={permission}
              onValueChange={(v) => setPermission(v as SharePermission)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="VIEW" id="view" />
                <Label htmlFor="view" className="font-normal cursor-pointer">
                  Apenas visualizar
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="COMMENT" id="comment" />
                <Label htmlFor="comment" className="font-normal cursor-pointer">
                  Visualizar e comentar
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label htmlFor="expires">Data de Expiração (opcional)</Label>
            <Input
              id="expires"
              type="date"
              min={minDate}
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Deixe em branco para link sem expiração.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Gerando...
              </>
            ) : (
              'Gerar Link'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
