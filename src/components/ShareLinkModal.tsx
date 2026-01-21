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

export interface ShareLinkFormData {
  permission: SharePermission;
  maxUses?: number;
}

interface ShareLinkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ShareLinkFormData) => Promise<void>;
  isLoading: boolean;
}

export function ShareLinkModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: ShareLinkModalProps) {
  const [permission, setPermission] = useState<SharePermission>('VIEW');
  const [maxUses, setMaxUses] = useState<string>('');

  const handleSubmit = async () => {
    await onSubmit({
      permission,
      maxUses: maxUses ? parseInt(maxUses, 10) : undefined,
    });
    setPermission('VIEW');
    setMaxUses('');
  };

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
            <Label htmlFor="maxUses">Número Máximo de Utilizações (opcional)</Label>
            <Input
              id="maxUses"
              type="number"
              min="1"
              placeholder="Sem limite"
              value={maxUses}
              onChange={(e) => setMaxUses(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Deixe em branco para utilizações ilimitadas.
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
