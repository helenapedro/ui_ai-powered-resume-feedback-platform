import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { User as AuthUser } from '@/types';
import { FileText, User } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

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
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </div>
          <CardDescription>Update your name and contact phone number.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(event) => onFullNameChange(event.target.value)}
                placeholder="Your full name"
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
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
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user?.email || ''} disabled className="bg-muted/50" />
            <p className="text-xs text-muted-foreground">Your email is tied to your account and cannot be changed.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">About You</CardTitle>
          </div>
          <CardDescription>Write a short description about your background and goals.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Textarea
              id="bio"
              value={bio}
              onChange={(event) => onBioChange(event.target.value)}
              placeholder="Example: Full-stack developer with 5 years of experience looking for startup opportunities..."
              maxLength={500}
              rows={4}
              className="resize-none"
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">This information may be visible in shared links.</p>
              <span className="text-xs text-muted-foreground tabular-nums">{bio.length}/500</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
