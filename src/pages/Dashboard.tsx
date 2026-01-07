import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { ResumeCard, ResumeCardSkeleton } from '@/components/ResumeCard';
import { PaginationControls } from '@/components/PaginationControls';
import { resumeService } from '@/services/resumes';
import { useToast } from '@/hooks/use-toast';
import type { Resume } from '@/types';
import { FileText } from 'lucide-react';

export default function Dashboard() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    fetchResumes();
  }, [currentPage]);

  const fetchResumes = async () => {
    setIsLoading(true);
    try {
      const response = await resumeService.getAllResumes(currentPage, 12);
      setResumes(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar currículos',
        description: error instanceof Error ? error.message : 'Tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      
      <main className="flex-1 container py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              Feed de Currículos
            </h1>
            <p className="text-muted-foreground mt-1">
              Explore currículos da comunidade e deixe seu feedback
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ResumeCardSkeleton key={i} />
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Nenhum currículo encontrado</h2>
            <p className="text-muted-foreground">
              Seja o primeiro a enviar um currículo!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {resumes.map((resume) => (
                <ResumeCard key={resume.id} resume={resume} />
              ))}
            </div>
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </main>
    </div>
  );
}
