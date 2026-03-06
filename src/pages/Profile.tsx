import { useState, useEffect, useRef, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { useAuth } from '@/contexts/AuthContext';
import { userService, type UserProfile, type UpdateProfileRequest } from '@/services/users';
import { useToast } from '@/hooks/use-toast';
import {
  Loader2,
  Save,
  Mail,
  Phone,
  User,
  FileText,
  Camera,
  Upload,
  ArrowLeft,
  RefreshCw,
  X,
  UserX,
  Trash2,
} from 'lucide-react';

const MAX_AVATAR_SIZE_BYTES = 2 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = new Set(['image/png', 'image/jpeg', 'image/jpg', 'image/webp']);
const MAX_AVATAR_DIMENSION = 1024;
const AVATAR_OUTPUT_QUALITY = 0.82;

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Unable to load the image.'));
    };
    image.src = objectUrl;
  });
}

function getScaledDimensions(width: number, height: number): { width: number; height: number } {
  const longestSide = Math.max(width, height);
  if (longestSide <= MAX_AVATAR_DIMENSION) {
    return { width, height };
  }

  const scale = MAX_AVATAR_DIMENSION / longestSide;
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

async function optimizeAvatarFile(file: File): Promise<File> {
  const image = await loadImageFromFile(file);
  const { width, height } = getScaledDimensions(image.width, image.height);
  const outputType = file.type === 'image/png' ? 'image/png' : 'image/webp';

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) {
    return file;
  }

  context.drawImage(image, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) => {
    const quality = outputType === 'image/png' ? undefined : AVATAR_OUTPUT_QUALITY;
    canvas.toBlob(resolve, outputType, quality);
  });

  if (!blob) {
    return file;
  }

  const extension = outputType === 'image/png' ? 'png' : 'webp';
  const baseName = file.name.replace(/\.[^.]+$/, '');
  const optimizedFile = new File([blob], `${baseName}.${extension}`, { type: outputType });
  return optimizedFile.size < file.size ? optimizedFile : file;
}

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isDeactivatingAccount, setIsDeactivatingAccount] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');

  const applyProfileToForm = (data: UserProfile) => {
    setFullName(data.fullName || '');
    setPhone(data.phone || '');
    setBio(data.bio || '');
  };

  useEffect(() => {
    void loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await userService.getMe();
      setProfile(data);
      applyProfileToForm(data);
    } catch {
      toast({
        title: 'Unable to load profile',
        description: 'We could not load your profile data.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      const payload: UpdateProfileRequest = {};
      if (fullName !== (profile?.fullName || '')) payload.fullName = fullName;
      if (phone !== (profile?.phone || '')) payload.phone = phone;
      if (bio !== (profile?.bio || '')) payload.bio = bio;

      if (Object.keys(payload).length === 0) {
        toast({ title: 'No changes', description: 'No fields were modified.' });
        setIsSaving(false);
        return;
      }

      const updated = await userService.updateMe(payload);
      setProfile(updated);
      applyProfileToForm(updated);
      toast({ title: 'Profile updated', description: 'Your information has been saved.' });
    } catch (error) {
      toast({
        title: 'Unable to save profile',
        description: error instanceof Error ? error.message : 'We could not update your profile.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_AVATAR_TYPES.has(file.type)) {
      toast({
        title: 'Invalid file format',
        description: 'Use PNG, JPG, JPEG, or WEBP.',
        variant: 'destructive',
      });
      event.target.value = '';
      return;
    }

    setIsUploadingAvatar(true);
    try {
      let fileToUpload = file;
      try {
        fileToUpload = await optimizeAvatarFile(file);
      } catch {
        fileToUpload = file;
      }

      if (fileToUpload.size > MAX_AVATAR_SIZE_BYTES) {
        toast({
          title: 'File too large',
          description: 'The maximum allowed size is 2MB.',
          variant: 'destructive',
        });
        return;
      }

      const updated = await userService.uploadAvatar(fileToUpload);
      setProfile(updated);
      applyProfileToForm(updated);
      toast({
        title: 'Avatar updated',
        description: 'Your profile image was uploaded successfully.',
      });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'We could not upload the image.',
        variant: 'destructive',
      });
    } finally {
      setIsUploadingAvatar(false);
      event.target.value = '';
    }
  };

  const initials = fullName
    ? fullName
        .split(' ')
        .map((name) => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : (user?.email?.[0] || 'U').toUpperCase();

  const hasChanges = () => {
    if (!profile) return false;
    return (
      fullName !== (profile.fullName || '') ||
      phone !== (profile.phone || '') ||
      bio !== (profile.bio || '')
    );
  };

  const handleCancelChanges = () => {
    if (!profile) return;
    applyProfileToForm(profile);
    toast({ title: 'Changes discarded', description: 'Fields were reset to the last saved state.' });
  };

  const handleRefreshProfile = async () => {
    setIsLoading(true);
    await loadProfile();
    toast({ title: 'Profile refreshed', description: 'Data reloaded from the server.' });
  };

  const handleDeactivateAccount = async () => {
    setIsDeactivatingAccount(true);
    try {
      await userService.deactivateMe();
      logout();
      toast({
        title: 'Account deactivated',
        description: 'Your account was deactivated. You can reactivate it later from the login page.',
      });
      navigate('/auth');
    } catch (error) {
      toast({
        title: 'Unable to deactivate account',
        description: error instanceof Error ? error.message : 'We could not deactivate your account.',
        variant: 'destructive',
      });
    } finally {
      setIsDeactivatingAccount(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      await userService.deleteMe();
      logout();
      toast({
        title: 'Account deleted',
        description: 'Your account was permanently deleted.',
      });
      navigate('/auth');
    } catch (error) {
      toast({
        title: 'Unable to delete account',
        description: error instanceof Error ? error.message : 'We could not delete your account.',
        variant: 'destructive',
      });
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const displayName = fullName || user?.email?.split('@')[0] || 'user';

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
        <div className="mb-8 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={handleRefreshProfile}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground mt-1">
            Welcome, {displayName}. Update your personal information and preferences.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
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
                    onClick={() => fileInputRef.current?.click()}
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
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Your full name"
                    maxLength={100}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
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
                  onChange={(event) => setBio(event.target.value)}
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

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Profile Photo</CardTitle>
              </div>
              <CardDescription>Upload a PNG, JPG, JPEG, or WEBP image up to 2MB.</CardDescription>
            </CardHeader>
            <CardContent>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className="hidden"
                onChange={handleAvatarUpload}
              />
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 shrink-0">
                  <AvatarImage src={profile?.avatarUrl || undefined} alt="Preview" />
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
                  {isUploadingAvatar ? 'Uploading...' : 'Select image'}
                </Button>
              </div>
            </CardContent>
          </Card>

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
                      <AlertDialogAction onClick={handleDeactivateAccount} disabled={isDeactivatingAccount}>
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
                        onClick={handleDeleteAccount}
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

          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-muted-foreground">{hasChanges() ? 'You have unsaved changes.' : 'Everything is saved.'}</p>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" disabled={!hasChanges() || isSaving} onClick={handleCancelChanges}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving || !hasChanges()} className="min-w-[160px]">
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
