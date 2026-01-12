import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { ResumeCard, ResumeCardSkeleton } from '@/components/ResumeCard';
import { Button } from '@/components/ui/button';
import { resumeService } from '@/services/resumes';
import { useToast } from '@/hooks/use-toast';
import type { Resume } from '@/types';
import { FileText, Plus, RefreshCw } from 'lucide-react';

export default function MyResumes() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    setIsLoading(true);
    try {
      const data = await resumeService.getMyResume();
      setResume(data);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar currículo',
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
              Meu Currículo
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie seu currículo e visualize o histórico de versões
            </p>
          </div>
          <Button asChild>
            <Link to="/upload">
              {resume ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Atualizar Currículo
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Currículo
                </>
              )}
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <ResumeCardSkeleton />
          </div>
        ) : !resume ? (
          <div className="text-center py-20">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Você ainda não tem currículo</h2>
            <p className="text-muted-foreground mb-6">
              Faça o upload do seu primeiro currículo e receba feedback de IA!
            </p>
            <Button asChild>
              <Link to="/upload">
                <Plus className="h-4 w-4 mr-2" />
                Enviar Currículo
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <ResumeCard resume={resume} showActions />
          </div>
        )}
      </main>
    </div>
  );
}
