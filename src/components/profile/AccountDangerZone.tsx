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
  return (
    <Card className="border-destructive/30">
      <CardHeader>
        <div className="flex items-center gap-2">
          <UserX className="h-5 w-5 text-destructive" />
          <CardTitle className="text-lg">Account</CardTitle>
        </div>
        <CardDescription>Manage your account state. These actions affect your access immediately.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="outline" className="border-amber-500 text-amber-700 hover:bg-amber-50">
                <UserX className="h-4 w-4 mr-2" />
                Deactivate Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Deactivate account?</AlertDialogTitle>
                <AlertDialogDescription>
                  Your account will become inactive, but your data will be kept. You can reactivate it later using your email and password.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDeactivateAccount} disabled={isDeactivatingAccount}>
                  {isDeactivatingAccount ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Confirm deactivation
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete account permanently?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. Your account will be removed permanently.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDeleteAccount}
                  disabled={isDeletingAccount}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeletingAccount ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Confirm deletion
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
