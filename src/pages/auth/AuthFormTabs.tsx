import type { FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type AuthFormTabsProps = {
  isLoading: boolean;
  onLogin: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  onRegister: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  onReactivate: (event: FormEvent<HTMLFormElement>) => Promise<void>;
};

export function AuthFormTabs({ isLoading, onLogin, onRegister, onReactivate }: AuthFormTabsProps) {
  return (
    <Tabs defaultValue="login" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
        <TabsTrigger value="reactivate">Reactivate</TabsTrigger>
      </TabsList>

      <TabsContent value="login">
        <form onSubmit={onLogin} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <Input id="login-email" name="email" type="email" placeholder="you@email.com" required disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-password">Password</Label>
            <Input id="login-password" name="password" type="password" placeholder="******" required disabled={isLoading} />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
      </TabsContent>

      <TabsContent value="register">
        <form onSubmit={onRegister} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="register-email">Email</Label>
            <Input id="register-email" name="email" type="email" placeholder="you@email.com" required disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="register-password">Password</Label>
            <Input id="register-password" name="password" type="password" placeholder="******" required disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="register-confirm">Confirm Password</Label>
            <Input id="register-confirm" name="confirmPassword" type="password" placeholder="******" required disabled={isLoading} />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>
      </TabsContent>

      <TabsContent value="reactivate">
        <form onSubmit={onReactivate} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="reactivate-email">Email</Label>
            <Input id="reactivate-email" name="email" type="email" placeholder="you@email.com" required disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reactivate-password">Password</Label>
            <Input id="reactivate-password" name="password" type="password" placeholder="******" required disabled={isLoading} />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Reactivating...
              </>
            ) : (
              'Reactivate Account'
            )}
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  );
}
