import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProfileHeaderActionsProps {
  displayName: string;
  onBack: () => void;
  onRefresh: () => void;
}

export function ProfileHeaderActions({ displayName, onBack, onRefresh }: ProfileHeaderActionsProps) {
  const { language } = useLanguage();
  const copy = language === 'pt'
    ? {
        back: 'Voltar',
        refresh: 'Atualizar',
        title: 'Meu perfil',
        welcome: `Bem-vindo/a, ${displayName}. Atualize as suas informacoes pessoais e preferencias.`,
      }
    : {
        back: 'Back',
        refresh: 'Refresh',
        title: 'My Profile',
        welcome: `Welcome, ${displayName}. Update your personal information and preferences.`,
      };

  return (
    <div className="mb-8 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {copy.back}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          {copy.refresh}
        </Button>
      </div>
      <h1 className="text-3xl font-bold text-foreground">{copy.title}</h1>
      <p className="text-muted-foreground mt-1">
        {copy.welcome}
      </p>
    </div>
  );
}
