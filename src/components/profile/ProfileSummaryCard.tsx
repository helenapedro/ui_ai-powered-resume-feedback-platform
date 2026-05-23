import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import type { UserProfile } from '@/services/users';
import type { User as AuthUser } from '@/types';
import { Camera, Loader2, Mail, Phone } from 'lucide-react';

interface ProfileSummaryCardProps {
  profile: UserProfile | null;
  user: AuthUser | null;
  fullName: string;
  phone: string;
  initials: string;
  isUploadingAvatar: boolean;
  onAvatarClick: () => void;
}

export function ProfileSummaryCard({
  profile,
  user,
  fullName,
  phone,
  initials,
  isUploadingAvatar,
  onAvatarClick,
}: ProfileSummaryCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            <Avatar className="h-24 w-24 ring-4 ring-primary/10">
              <AvatarImage src={profile?.avatarUrl || undefined} alt={fullName || 'Avatar'} />
              <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div
              className="absolute inset-0 rounded-full bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
              onClick={onAvatarClick}
            >
              {isUploadingAvatar ? (
                <Loader2 className="h-6 w-6 text-primary-foreground animate-spin" />
              ) : (
                <Camera className="h-6 w-6 text-primary-foreground" />
              )}
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1">
            <h2 className="text-xl font-semibold text-foreground">{fullName || 'No name set'}</h2>
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
  );
}
