import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { ResumeCard, ResumeCardSkeleton } from '@/components/ResumeCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { resumeService } from '@/services/resumes';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getPinnedResumeIds, togglePinnedResumeId } from '@/lib/pinned-resumes';
import type { ResumeSummary } from '@/types';
import { FileText, Plus, Search } from 'lucide-react';

export default function MyResumes() {
  const [resumes, setResumes] = useState<ResumeSummary[]>([]);
  const [pinnedResumeIds, setPinnedResumeIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    void fetchResumes();
  }, []);

  useEffect(() => {
    if (!user?.id) {
      setPinnedResumeIds([]);
      return;
    }

    setPinnedResumeIds(getPinnedResumeIds(user.id));
  }, [user?.id]);

  const fetchResumes = async () => {
    setIsLoading(true);
    try {
      const data = await resumeService.getAllResumes();
      setResumes(data);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar curriculos',
        description: error instanceof Error ? error.message : 'Tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />

      <main className="flex-1 container py-8 px-4">
        <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              Meus Curriculos
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie seus curriculos, pesquise por titulo e mantenha os mais importantes no topo
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative min-w-[260px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Pesquisar por titulo"
                className="pl-9"
              />
            </div>
            <Button asChild>
              <Link to="/upload">
                <Plus className="h-4 w-4 mr-2" />
                Novo Curriculo
              </Link>
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <ResumeCardSkeleton key={index} />
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Voce ainda nao tem curriculos</h2>
            <p className="text-muted-foreground mb-6">
              Faca o upload do seu primeiro curriculo e receba feedback de IA!
            </p>
            <Button asChild>
              <Link to="/upload">
                <Plus className="h-4 w-4 mr-2" />
                Enviar Curriculo
              </Link>
            </Button>
          </div>
        ) : filteredResumes.length === 0 ? (
          <div className="text-center py-20">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Nenhum curriculo encontrado</h2>
            <p className="text-muted-foreground">Tente pesquisar com outro titulo.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredResumes.map((resume) => (
              <ResumeCard
                key={resume.id}
                resume={resume}
                showActions
                isPinned={pinnedResumeIds.includes(resume.id)}
                onTogglePin={handleTogglePin}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
