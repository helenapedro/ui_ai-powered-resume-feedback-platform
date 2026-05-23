import { Header } from '@/components/Header';
import { AccountDangerZone } from '@/components/profile/AccountDangerZone';
import { ProfileFormActions } from '@/components/profile/ProfileFormActions';
import { ProfileHeaderActions } from '@/components/profile/ProfileHeaderActions';
import { ProfileLoading } from '@/components/profile/ProfileLoading';
import { ProfilePersonalInfoCard } from '@/components/profile/ProfilePersonalInfoCard';
import { ProfilePhotoCard } from '@/components/profile/ProfilePhotoCard';
import { ProfileSummaryCard } from '@/components/profile/ProfileSummaryCard';
import { useProfilePage } from '@/features/profile/useProfilePage';

export default function Profile() {
  const profilePage = useProfilePage();

  if (profilePage.isLoading) {
    return <ProfileLoading />;
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <Header />
      <main className="container max-w-3xl py-10 px-4">
        <ProfileHeaderActions
          displayName={profilePage.displayName}
          onBack={() => profilePage.navigate(-1)}
          onRefresh={profilePage.handleRefreshProfile}
        />

        <form onSubmit={profilePage.handleSave} className="space-y-6">
          <ProfileSummaryCard
            profile={profilePage.profile}
            user={profilePage.user}
            fullName={profilePage.fullName}
            phone={profilePage.phone}
            initials={profilePage.initials}
            isUploadingAvatar={profilePage.isUploadingAvatar}
            onAvatarClick={() => profilePage.fileInputRef.current?.click()}
          />

          <ProfilePersonalInfoCard
            user={profilePage.user}
            fullName={profilePage.fullName}
            phone={profilePage.phone}
            bio={profilePage.bio}
            onFullNameChange={profilePage.setFullName}
            onPhoneChange={profilePage.setPhone}
            onBioChange={profilePage.setBio}
          />

          <ProfilePhotoCard
            profile={profilePage.profile}
            initials={profilePage.initials}
            isUploadingAvatar={profilePage.isUploadingAvatar}
            fileInputRef={profilePage.fileInputRef}
            onAvatarUpload={profilePage.handleAvatarUpload}
          />

          <AccountDangerZone
            isDeactivatingAccount={profilePage.isDeactivatingAccount}
            isDeletingAccount={profilePage.isDeletingAccount}
            onDeactivateAccount={profilePage.handleDeactivateAccount}
            onDeleteAccount={profilePage.handleDeleteAccount}
          />

          <ProfileFormActions
            hasChanges={profilePage.hasChanges}
            isSaving={profilePage.isSaving}
            onCancelChanges={profilePage.handleCancelChanges}
          />
        </form>
      </main>
    </div>
  );
}
