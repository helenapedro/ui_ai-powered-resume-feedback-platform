import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Loader2, Trash2, UserX } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface AccountDangerZoneProps {
  isDeactivatingAccount: boolean;
  isDeletingAccount: boolean;
  onDeactivateAccount: () => void;
  onDeleteAccount: () => void;
}

export function AccountDangerZone({
  isDeactivatingAccount,
  isDeletingAccount,
  onDeactivateAccount,
  onDeleteAccount,
}: AccountDangerZoneProps) {
  const { language } = useLanguage();
  const copy = language === 'pt'
    ? {
        account: 'Conta',
        description: 'Gerencie o estado da sua conta. Estas acoes afetam o acesso imediatamente.',
        deactivate: 'Desativar conta',
        deactivateTitle: 'Desativar conta?',
        deactivateDescription: 'A sua conta ficara inativa, mas os seus dados serao mantidos. Pode reativa-la mais tarde com email e password.',
        cancel: 'Cancelar',
        confirmDeactivate: 'Confirmar desativacao',
        delete: 'Eliminar conta',
        deleteTitle: 'Eliminar conta permanentemente?',
        deleteDescription: 'Esta acao nao pode ser desfeita. A sua conta sera removida permanentemente.',
        confirmDelete: 'Confirmar eliminacao',
      }
    : {
        account: 'Account',
        description: 'Manage your account state. These actions affect your access immediately.',
        deactivate: 'Deactivate Account',
        deactivateTitle: 'Deactivate account?',
        deactivateDescription: 'Your account will become inactive, but your data will be kept. You can reactivate it later using your email and password.',
        cancel: 'Cancel',
        confirmDeactivate: 'Confirm deactivation',
        delete: 'Delete Account',
        deleteTitle: 'Delete account permanently?',
        deleteDescription: 'This action cannot be undone. Your account will be removed permanently.',
        confirmDelete: 'Confirm deletion',
      };

  return (
    <Card className="border-destructive/30">
      <CardHeader>
        <div className="flex items-center gap-2">
          <UserX className="h-5 w-5 text-destructive" />
          <CardTitle className="text-lg">{copy.account}</CardTitle>
        </div>
        <CardDescription>{copy.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="outline" className="border-amber-500 text-amber-700 hover:bg-amber-50">
                <UserX className="h-4 w-4 mr-2" />
                {copy.deactivate}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{copy.deactivateTitle}</AlertDialogTitle>
                <AlertDialogDescription>
                  {copy.deactivateDescription}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{copy.cancel}</AlertDialogCancel>
                <AlertDialogAction onClick={onDeactivateAccount} disabled={isDeactivatingAccount}>
                  {isDeactivatingAccount ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  {copy.confirmDeactivate}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                {copy.delete}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{copy.deleteTitle}</AlertDialogTitle>
                <AlertDialogDescription>
                  {copy.deleteDescription}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{copy.cancel}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDeleteAccount}
                  disabled={isDeletingAccount}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeletingAccount ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  {copy.confirmDelete}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
