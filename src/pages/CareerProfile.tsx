import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Loader2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { CareerExperienceCard } from '@/components/career-profile/CareerExperienceCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCareerProfileQuery, useCurrentUserQuery } from '@/features/career-profile/queries';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { groupCareerProfileItems } from '@/lib/career-profile';

export default function CareerProfile() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { data, isLoading, error, refetch } = useCareerProfileQuery();
  const { data: currentUser } = useCurrentUserQuery();

  useEffect(() => {
    if (error) {
      toast({
        variant: 'destructive',
        title: t('careerProfile.loadErrorTitle'),
        description: error instanceof Error ? error.message : t('careerProfile.loadErrorDescription'),
      });
    }
  }, [error, t, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/40">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  const experiences = groupCareerProfileItems(data?.items ?? []);
  // The account holder's name comes from the account, never from the
  // interview. When fullName is missing or blank, show nothing for the
  // name rather than inventing one.
  const displayName = currentUser?.fullName?.trim() || null;

  return (
    <div className="min-h-screen bg-muted/40">
      <Header />
      <main className="container max-w-3xl py-10 px-4">
        <div className="mb-8 space-y-2">
          <h1 className="text-2xl font-bold">{t('careerProfile.title')}</h1>
          {displayName ? <p className="text-lg font-medium">{displayName}</p> : null}
          <p className="text-sm text-muted-foreground">{t('careerProfile.description')}</p>
        </div>

        {error ? (
          <Card>
            <CardContent className="space-y-4 p-6 text-center">
              <p className="font-medium">{t('careerProfile.loadErrorTitle')}</p>
              <p className="text-sm text-muted-foreground">{t('careerProfile.loadErrorDescription')}</p>
              <Button onClick={() => void refetch()}>{t('feedback.tryAgain')}</Button>
            </CardContent>
          </Card>
        ) : experiences.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
              <Briefcase className="h-8 w-8 text-muted-foreground" />
              <p className="font-medium">{t('careerProfile.emptyTitle')}</p>
              <p className="text-sm text-muted-foreground">{t('careerProfile.emptyDescription')}</p>
              <Button asChild className="mt-2">
                <Link to="/career-profile/interview">{t('careerProfile.startInterview')}</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {experiences.map((experience) => (
              <CareerExperienceCard key={experience.originProposalId} experience={experience} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
