import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { User as AuthUser } from '@/types';
import { FileText, User } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProfilePersonalInfoCardProps {
  user: AuthUser | null;
  fullName: string;
  phone: string;
  bio: string;
  onFullNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onBioChange: (value: string) => void;
}

export function ProfilePersonalInfoCard({
  user,
  fullName,
  phone,
  bio,
  onFullNameChange,
  onPhoneChange,
  onBioChange,
}: ProfilePersonalInfoCardProps) {
  const { language } = useLanguage();
  const copy = language === 'pt'
    ? {
        personalInfo: 'Informacoes pessoais',
        personalDescription: 'Atualize o seu nome e telefone de contacto.',
        fullName: 'Nome completo',
        fullNamePlaceholder: 'O seu nome completo',
        phone: 'Telefone',
        email: 'Email',
        emailHelp: 'O seu email esta ligado a conta e nao pode ser alterado.',
        about: 'Sobre si',
        aboutDescription: 'Escreva uma breve descricao sobre o seu background e objetivos.',
        bioPlaceholder: 'Exemplo: Full-stack developer com 5 anos de experiencia a procurar oportunidades em startups...',
        sharedHelp: 'Esta informacao pode ficar visivel em links partilhados.',
      }
    : {
        personalInfo: 'Personal Information',
        personalDescription: 'Update your name and contact phone number.',
        fullName: 'Full name',
        fullNamePlaceholder: 'Your full name',
        phone: 'Phone',
        email: 'Email',
        emailHelp: 'Your email is tied to your account and cannot be changed.',
        about: 'About You',
        aboutDescription: 'Write a short description about your background and goals.',
        bioPlaceholder: 'Example: Full-stack developer with 5 years of experience looking for startup opportunities...',
        sharedHelp: 'This information may be visible in shared links.',
      };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">{copy.personalInfo}</CardTitle>
          </div>
          <CardDescription>{copy.personalDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">{copy.fullName}</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(event) => onFullNameChange(event.target.value)}
                placeholder={copy.fullNamePlaceholder}
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{copy.phone}</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(event) => onPhoneChange(event.target.value)}
                placeholder="+1 555 123 4567"
                maxLength={20}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{copy.email}</Label>
            <Input id="email" value={user?.email || ''} disabled className="bg-muted/50" />
            <p className="text-xs text-muted-foreground">{copy.emailHelp}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">{copy.about}</CardTitle>
          </div>
          <CardDescription>{copy.aboutDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Textarea
              id="bio"
              value={bio}
              onChange={(event) => onBioChange(event.target.value)}
              placeholder={copy.bioPlaceholder}
              maxLength={500}
              rows={4}
              className="resize-none"
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">{copy.sharedHelp}</p>
              <span className="text-xs text-muted-foreground tabular-nums">{bio.length}/500</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
