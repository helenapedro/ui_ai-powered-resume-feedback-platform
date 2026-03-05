import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { userService, type UserProfile, type UpdateProfileRequest } from '@/services/users';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Mail, Phone, User, FileText, Camera } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await userService.getMe();
      setProfile(data);
      setFullName(data.fullName || '');
      setPhone(data.phone || '');
      setBio(data.bio || '');
      setAvatarUrl(data.avatarUrl || '');
    } catch (error) {
      toast({
        title: 'Erro ao carregar perfil',
        description: 'Não foi possível carregar seus dados.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload: UpdateProfileRequest = {};
      if (fullName !== (profile?.fullName || '')) payload.fullName = fullName;
      if (phone !== (profile?.phone || '')) payload.phone = phone;
      if (bio !== (profile?.bio || '')) payload.bio = bio;
      if (avatarUrl !== (profile?.avatarUrl || '')) payload.avatarUrl = avatarUrl;

      if (Object.keys(payload).length === 0) {
        toast({ title: 'Nenhuma alteração', description: 'Nenhum campo foi modificado.' });
        setIsSaving(false);
        return;
      }

      const updated = await userService.updateMe(payload);
      setProfile(updated);
      toast({ title: 'Perfil atualizado!', description: 'Suas informações foram salvas.' });
    } catch (error) {
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível atualizar o perfil.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const initials = fullName
    ? fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : (user?.email?.[0] || 'U').toUpperCase();

  const hasChanges = () => {
    if (!profile) return false;
    return (
      fullName !== (profile.fullName || '') ||
      phone !== (profile.phone || '') ||
      bio !== (profile.bio || '') ||
      avatarUrl !== (profile.avatarUrl || '')
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-3xl py-10 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Meu Perfil</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie suas informações pessoais e preferências.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative group">
                  <Avatar className="h-24 w-24 ring-4 ring-primary/10">
                    <AvatarImage src={avatarUrl || undefined} alt={fullName || 'Avatar'} />
                    <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 rounded-full bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                    <Camera className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>

                <div className="flex-1 text-center sm:text-left space-y-1">
                  <h2 className="text-xl font-semibold text-foreground">
                    {fullName || 'Sem nome definido'}
                  </h2>
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{user?.email}</span>
                  </div>
                  {phone && (
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">{phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Informações Pessoais</CardTitle>
              </div>
              <CardDescription>
                Atualize seu nome e telefone de contato.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome completo</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Seu nome completo"
                    maxLength={100}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+55 11 99999-9999"
                    maxLength={20}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user?.email || ''} disabled className="bg-muted/50" />
                <p className="text-xs text-muted-foreground">
                  O email é vinculado à sua conta e não pode ser alterado.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Sobre você</CardTitle>
              </div>
              <CardDescription>
                Escreva uma breve descrição sobre sua experiência e objetivos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Ex: Desenvolvedor full-stack com 5 anos de experiência, buscando oportunidades em startups..."
                  maxLength={500}
                  rows={4}
                  className="resize-none"
                />
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">
                    Essa informação pode ser visível em links compartilhados.
                  </p>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {bio.length}/500
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Foto de perfil</CardTitle>
              </div>
              <CardDescription>
                Insira a URL de uma imagem para usar como avatar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-end">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="avatarUrl">URL da imagem</Label>
                  <Input
                    id="avatarUrl"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://exemplo.com/minha-foto.jpg"
                    type="url"
                  />
                </div>
                {avatarUrl && (
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={avatarUrl} alt="Preview" />
                    <AvatarFallback className="text-xs bg-muted">?</AvatarFallback>
                  </Avatar>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-muted-foreground">
              {hasChanges() ? 'Você tem alterações não salvas.' : 'Tudo salvo.'}
            </p>
            <Button type="submit" disabled={isSaving || !hasChanges()} className="min-w-[160px]">
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Salvar Alterações
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
