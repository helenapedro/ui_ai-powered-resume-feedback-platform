import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { ResumeCard, ResumeCardSkeleton } from '@/components/ResumeCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getPinnedResumeIds, togglePinnedResumeId } from '@/lib/pinned-resumes';
import { useResumesQuery } from '@/features/resumes/queries';
import type { ResumeSummary } from '@/types';
import { Calendar, FileText, Pin, Plus, Search, Upload } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function MyResumes() {
  const [pinnedResumeIds, setPinnedResumeIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();
  const { data: resumes = [], isLoading, error } = useResumesQuery();

  useEffect(() => {
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Unable to load resumes',
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    }
  }, [error, toast]);

  useEffect(() => {
    if (!user?.id) {
      setPinnedResumeIds([]);
      return;
    }

    setPinnedResumeIds(getPinnedResumeIds(user.id));
  }, [user?.id]);

  const filteredResumes = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const visibleResumes = normalizedQuery
      ? resumes.filter((resume) => (resume.title || '').toLowerCase().includes(normalizedQuery))
      : resumes;

    return [...visibleResumes].sort((left, right) => {
      const leftPinned = pinnedResumeIds.includes(left.id);
      const rightPinned = pinnedResumeIds.includes(right.id);

      if (leftPinned !== rightPinned) {
        return leftPinned ? -1 : 1;
      }

      return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
    });
  }, [pinnedResumeIds, resumes, searchQuery]);

  const handleTogglePin = (resumeId: string) => {
    if (!user?.id) {
      return;
    }

    setPinnedResumeIds(togglePinnedResumeId(user.id, resumeId));
  };

  const pinnedResumes = filteredResumes.filter((resume) => pinnedResumeIds.includes(resume.id));
  const unpinnedResumes = filteredResumes.filter((resume) => !pinnedResumeIds.includes(resume.id));
  const activeResumeCount = resumes.filter((resume) => resume.currentVersionId).length;
  const latestResume = useMemo(
    () =>
      resumes.length > 0
        ? [...resumes].sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())[0]
        : null,
    [resumes]
  );
  const isSearching = searchQuery.trim().length > 0;
  const mainSectionResumes = isSearching ? filteredResumes : unpinnedResumes;

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />

      <main className="flex-1">
        <section className="border-b bg-background">
          <div className="container max-w-[1440px] px-4 py-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <Badge variant="outline" className="mb-3 gap-2">
                  <FileText className="h-3.5 w-3.5" />
                  Resume workflows
                </Badge>
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">My Resume Workflow</h1>
                <p className="mt-2 text-muted-foreground">
                  Reopen active drafts, add new versions, and keep important review workflows pinned for quick access.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative min-w-full sm:min-w-[320px]">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search workflows"
                    className="pl-9"
                  />
                </div>
                <Button asChild>
                  <Link to="/upload">
                    <Plus className="mr-2 h-4 w-4" />
                    New Resume
                  </Link>
                </Button>
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <DashboardStat label="Total workflows" value={resumes.length.toString()} icon={FileText} />
              <DashboardStat label="Active workflows" value={activeResumeCount.toString()} icon={Upload} />
              <DashboardStat
                label="Newest workflow"
                value={latestResume ? formatDistanceToNow(new Date(latestResume.createdAt), { addSuffix: true }) : 'None yet'}
                icon={Calendar}
              />
            </div>
          </div>
        </section>

        <section className="container max-w-[1440px] px-4 py-8">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, index) => (
                <ResumeCardSkeleton key={index} />
              ))}
            </div>
          ) : resumes.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="You do not have any resume workflows yet"
              description="Upload your first resume to start a version-aware feedback workflow."
              actionLabel="Upload Resume"
              actionHref="/upload"
            />
          ) : filteredResumes.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No resume workflows found"
              description="Try searching with a different title."
            />
          ) : (
            <div className="space-y-10">
              {pinnedResumes.length > 0 && !isSearching && (
                <WorkflowSection
                  title="Pinned"
                  description="High-priority workflows stay at the top of your dashboard."
                  icon={Pin}
                >
                  <ResumeGrid
                    resumes={pinnedResumes}
                    pinnedResumeIds={pinnedResumeIds}
                    onTogglePin={handleTogglePin}
                  />
                </WorkflowSection>
              )}

              {mainSectionResumes.length > 0 && (
                <WorkflowSection
                  title={isSearching ? 'Search Results' : pinnedResumes.length > 0 ? 'All Workflows' : 'Recent Workflows'}
                  description={
                    isSearching
                      ? `${filteredResumes.length} matching workflow${filteredResumes.length === 1 ? '' : 's'}`
                      : 'Sorted by pinned status first, then newest created date.'
                  }
                  icon={FileText}
                >
                  <ResumeGrid
                    resumes={mainSectionResumes}
                    pinnedResumeIds={pinnedResumeIds}
                    onTogglePin={handleTogglePin}
                  />
                </WorkflowSection>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

interface DashboardStatProps {
  label: string;
  value: string;
  icon: typeof FileText;
}

function DashboardStat({ label, value, icon: Icon }: DashboardStatProps) {
  return (
    <Card className="border-border/80 shadow-sm">
      <CardContent className="flex items-center gap-3 p-4">
        <div className="rounded-md bg-primary/10 p-2">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
          <p className="mt-1 truncate text-lg font-semibold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

interface WorkflowSectionProps {
  title: string;
  description: string;
  icon: typeof FileText;
  children: ReactNode;
}

function WorkflowSection({ title, description, icon: Icon, children }: WorkflowSectionProps) {
  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Icon className="h-5 w-5 text-primary" />
            {title}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

interface ResumeGridProps {
  resumes: ResumeSummary[];
  pinnedResumeIds: string[];
  onTogglePin: (resumeId: string) => void;
}

function ResumeGrid({ resumes, pinnedResumeIds, onTogglePin }: ResumeGridProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {resumes.map((resume) => (
        <ResumeCard
          key={resume.id}
          resume={resume}
          showActions
          isPinned={pinnedResumeIds.includes(resume.id)}
          onTogglePin={onTogglePin}
        />
      ))}
    </div>
  );
}

interface EmptyStateProps {
  icon: typeof FileText;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

function EmptyState({ icon: Icon, title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="rounded-lg border bg-background py-20 text-center shadow-sm">
      <Icon className="mx-auto mb-4 h-14 w-14 text-muted-foreground" />
      <h2 className="mb-2 text-xl font-semibold">{title}</h2>
      <p className="mx-auto mb-6 max-w-md text-muted-foreground">{description}</p>
      {actionLabel && actionHref && (
        <Button asChild>
          <Link to={actionHref}>
            <Plus className="mr-2 h-4 w-4" />
            {actionLabel}
          </Link>
        </Button>
      )}
    </div>
  );
}
