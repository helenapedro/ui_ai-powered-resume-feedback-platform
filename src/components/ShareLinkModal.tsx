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
  const [permission, setPermission] = useState<SharePermission>('VIEW');
  const [maxUses, setMaxUses] = useState<string>('');
  const [expiresAt, setExpiresAt] = useState<string>('');

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
            Create Share Link
          </DialogTitle>
          <DialogDescription>
            Create a link to share this resume with other people.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label>Permissions</Label>
            <RadioGroup value={permission} onValueChange={(value) => setPermission(value as SharePermission)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="VIEW" id="view" />
                <Label htmlFor="view" className="font-normal cursor-pointer">
                  View only
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="COMMENT" id="comment" />
                <Label htmlFor="comment" className="font-normal cursor-pointer">
                  View and comment
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label htmlFor="expiresAt">Expiration date (optional)</Label>
            <Input
              id="expiresAt"
              type="datetime-local"
              value={expiresAt}
              onChange={(event) => setExpiresAt(event.target.value)}
            />
            <p className="text-xs text-muted-foreground">Leave blank for a link with no expiration.</p>
          </div>

          <div className="space-y-3">
            <Label htmlFor="maxUses">Maximum uses (optional)</Label>
            <Input
              id="maxUses"
              type="number"
              min="1"
              placeholder="Unlimited"
              value={maxUses}
              onChange={(event) => setMaxUses(event.target.value)}
            />
            <p className="text-xs text-muted-foreground">Leave blank for unlimited uses.</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Link'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
