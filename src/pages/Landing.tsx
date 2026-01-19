import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, MessageSquare, History, Sparkles, ArrowRight } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Public Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">Resume Feedback</span>
          </Link>
          <Button asChild>
            <Link to="/auth">Entrar</Link>
          </Button>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="container max-w-6xl">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Feedback de IA para seu currículo
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-primary leading-tight">
              Melhore seu currículo com
              <br />
              <span className="text-primary/80">inteligência artificial</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Receba feedback instantâneo e detalhado sobre seu currículo, 
              compartilhe com a comunidade e evolua sua carreira.
            </p>
            
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button asChild size="lg" className="gap-2">
                <Link to="/auth">
                  Começar Agora
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/auth">Já tenho conta</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container max-w-6xl px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Por que usar o Resume Feedback?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background rounded-xl p-6 shadow-sm border">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Feedback de IA</h3>
              <p className="text-muted-foreground">
                Análise detalhada do seu currículo usando inteligência artificial avançada para identificar pontos de melhoria.
              </p>
            </div>
            
            <div className="bg-background rounded-xl p-6 shadow-sm border">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Comunidade Ativa</h3>
              <p className="text-muted-foreground">
                Compartilhe seu currículo e receba feedback de outros profissionais da comunidade.
              </p>
            </div>
            
            <div className="bg-background rounded-xl p-6 shadow-sm border">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <History className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Versionamento</h3>
              <p className="text-muted-foreground">
                Mantenha o histórico de todas as versões do seu currículo e restaure quando precisar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container max-w-4xl px-4 text-center">
          <FileText className="h-12 w-12 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">
            Pronto para melhorar seu currículo?
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Junte-se a milhares de profissionais que já estão evoluindo suas carreiras.
          </p>
          <Button asChild size="lg" variant="secondary" className="gap-2">
            <Link to="/auth">
              Criar conta grátis
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2024 Resume Feedback. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
