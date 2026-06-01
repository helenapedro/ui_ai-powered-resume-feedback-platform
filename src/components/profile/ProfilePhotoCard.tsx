import { type ChangeEvent, type RefObject } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { UserProfile } from '@/services/users';
import { Camera, Loader2, Upload } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProfilePhotoCardProps {
  profile: UserProfile | null;
  initials: string;
  isUploadingAvatar: boolean;
  fileInputRef: RefObject<HTMLInputElement>;
  onAvatarUpload: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function ProfilePhotoCard({
  profile,
  initials,
  isUploadingAvatar,
  fileInputRef,
  onAvatarUpload,
}: ProfilePhotoCardProps) {
  const { language } = useLanguage();
  const copy = language === 'pt'
    ? {
        title: 'Foto de perfil',
        description: 'Carregue uma imagem PNG, JPG, JPEG ou WEBP ate 2MB.',
        preview: 'Pre-visualizacao',
        uploading: 'A carregar...',
        select: 'Selecionar imagem',
      }
    : {
        title: 'Profile Photo',
        description: 'Upload a PNG, JPG, JPEG, or WEBP image up to 2MB.',
        preview: 'Preview',
        uploading: 'Uploading...',
        select: 'Select image',
      };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">{copy.title}</CardTitle>
        </div>
        <CardDescription>{copy.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          className="hidden"
          onChange={onAvatarUpload}
        />
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 shrink-0">
            <AvatarImage src={profile?.avatarUrl || undefined} alt={copy.preview} />
            <AvatarFallback className="text-xs bg-muted">{initials}</AvatarFallback>
          </Avatar>
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingAvatar}
          >
            {isUploadingAvatar ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            {isUploadingAvatar ? copy.uploading : copy.select}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
