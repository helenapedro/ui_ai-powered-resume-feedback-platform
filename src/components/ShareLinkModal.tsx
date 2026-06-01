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
import { useLanguage } from '@/contexts/LanguageContext';

export interface ShareLinkFormData {
  permission: SharePermission;
  expiresAt?: string | null;
  maxUses?: number | null;
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
  const { language } = useLanguage();
  const [permission, setPermission] = useState<SharePermission>('VIEW');
  const [maxUses, setMaxUses] = useState<string>('');
  const [expiresAt, setExpiresAt] = useState<string>('');

  const copy = language === 'pt'
    ? {
        title: 'Criar link de partilha',
        description: 'Crie um link para partilhar este CV com outras pessoas.',
        permissions: 'Permissoes',
        viewOnly: 'Apenas visualizar',
        viewAndComment: 'Visualizar e comentar',
        expiration: 'Data de expiracao (opcional)',
        expirationHelp: 'Deixe em branco para um link sem expiracao.',
        maxUses: 'Numero maximo de usos (opcional)',
        unlimited: 'Ilimitado',
        maxUsesHelp: 'Deixe em branco para usos ilimitados.',
        cancel: 'Cancelar',
        creating: 'A criar...',
        create: 'Criar link',
      }
    : {
        title: 'Create Share Link',
        description: 'Create a link to share this resume with other people.',
        permissions: 'Permissions',
        viewOnly: 'View only',
        viewAndComment: 'View and comment',
        expiration: 'Expiration date (optional)',
        expirationHelp: 'Leave blank for a link with no expiration.',
        maxUses: 'Maximum uses (optional)',
        unlimited: 'Unlimited',
        maxUsesHelp: 'Leave blank for unlimited uses.',
        cancel: 'Cancel',
        creating: 'Creating...',
        create: 'Create Link',
      };

  const handleSubmit = async () => {
    await onSubmit({
      permission,
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
      maxUses: maxUses ? parseInt(maxUses, 10) : null,
    });
    setPermission('VIEW');
    setMaxUses('');
    setExpiresAt('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            {copy.title}
          </DialogTitle>
          <DialogDescription>
            {copy.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label>{copy.permissions}</Label>
            <RadioGroup value={permission} onValueChange={(value) => setPermission(value as SharePermission)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="VIEW" id="view" />
                <Label htmlFor="view" className="font-normal cursor-pointer">
                  {copy.viewOnly}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="COMMENT" id="comment" />
                <Label htmlFor="comment" className="font-normal cursor-pointer">
                  {copy.viewAndComment}
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label htmlFor="expiresAt">{copy.expiration}</Label>
            <Input
              id="expiresAt"
              type="datetime-local"
              value={expiresAt}
              onChange={(event) => setExpiresAt(event.target.value)}
            />
            <p className="text-xs text-muted-foreground">{copy.expirationHelp}</p>
          </div>

          <div className="space-y-3">
            <Label htmlFor="maxUses">{copy.maxUses}</Label>
            <Input
              id="maxUses"
              type="number"
              min="1"
              placeholder={copy.unlimited}
              value={maxUses}
              onChange={(event) => setMaxUses(event.target.value)}
            />
            <p className="text-xs text-muted-foreground">{copy.maxUsesHelp}</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {copy.cancel}
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {copy.creating}
              </>
            ) : (
              copy.create
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
