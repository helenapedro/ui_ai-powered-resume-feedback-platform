import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/useAuth';
import { useToast } from '@/hooks/use-toast';
import { userService, type UpdateProfileRequest, type UserProfile } from '@/services/users';
import { optimizeAvatarFile } from '@/features/profile/avatar-utils';

const MAX_AVATAR_SIZE_BYTES = 2 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = new Set(['image/png', 'image/jpeg', 'image/jpg', 'image/webp']);

export function useProfilePage() {
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

  const applyProfileToForm = useCallback((data: UserProfile) => {
    setFullName(data.fullName || '');
    setPhone(data.phone || '');
    setBio(data.bio || '');
  }, []);

  const loadProfile = useCallback(async () => {
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
  }, [applyProfileToForm, toast]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const hasChanges = useMemo(() => {
    if (!profile) {
      return false;
    }

    return (
      fullName !== (profile.fullName || '') ||
      phone !== (profile.phone || '') ||
      bio !== (profile.bio || '')
    );
  }, [bio, fullName, phone, profile]);

  const initials = useMemo(
    () =>
      fullName
        ? fullName
            .split(' ')
            .map((name) => name[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
        : (user?.email?.[0] || 'U').toUpperCase(),
    [fullName, user?.email]
  );

  const displayName = fullName || user?.email?.split('@')[0] || 'user';

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const payload: UpdateProfileRequest = {};
      if (fullName !== (profile?.fullName || '')) payload.fullName = fullName;
      if (phone !== (profile?.phone || '')) payload.phone = phone;
      if (bio !== (profile?.bio || '')) payload.bio = bio;

      if (Object.keys(payload).length === 0) {
        toast({ title: 'No changes', description: 'No fields were modified.' });
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

  return {
    user,
    profile,
    isLoading,
    isSaving,
    isUploadingAvatar,
    isDeactivatingAccount,
    isDeletingAccount,
    fullName,
    phone,
    bio,
    initials,
    displayName,
    hasChanges,
    fileInputRef,
    setFullName,
    setPhone,
    setBio,
    navigate,
    handleSave,
    handleAvatarUpload,
    handleCancelChanges,
    handleRefreshProfile,
    handleDeactivateAccount,
    handleDeleteAccount,
  };
}
