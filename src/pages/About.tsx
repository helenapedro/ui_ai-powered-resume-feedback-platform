import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  FileText,
  Sparkles,
  MessageSquare,
  History,
  Share2,
  Shield,
  ArrowRight,
  Upload,
  Eye,
} from 'lucide-react';

export default function About() {
  const steps = [
    {
      icon: Upload,
      title: 'Faça upload do seu currículo',
      description:
        'Envie seu currículo em PDF e ele será armazenado com segurança na plataforma.',
    },
    {
      icon: Sparkles,
      title: 'Receba feedback de IA',
      description:
        'Nossa inteligência artificial analisa seu currículo e gera sugestões detalhadas de melhoria.',
    },
    {
      icon: MessageSquare,
      title: 'Comente e colabore',
      description:
        'Adicione comentários em seções específicas e receba opiniões de outros profissionais.',
    },
    {
      icon: History,
      title: 'Versione seu progresso',
      description:
        'Cada alteração gera uma nova versão. Restaure versões anteriores quando quiser.',
    },
    {
      icon: Share2,
      title: 'Compartilhe com facilidade',
      description:
        'Gere links de compartilhamento com data de expiração para recrutadores ou mentores.',
    },
  ];

  const highlights = [
    {
      icon: Shield,
      title: 'Privacidade em primeiro lugar',
      description:
        'Seus dados e currículos são protegidos. Apenas você decide quem pode visualizar.',
    },
    {
      icon: Eye,
      title: 'Visualização integrada',
      description:
        'Visualize seu PDF diretamente na plataforma, sem precisar baixar.',
    },
    {
      icon: FileText,
      title: '100% gratuito',
      description:
        'Todas as funcionalidades estão disponíveis gratuitamente. Sem planos escondidos.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">Resume Feedback</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/about" className="text-sm font-medium text-foreground transition-colors">
              Sobre
            </Link>
            <Button asChild>
              <Link to="/auth">Entrar</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="py-20 px-4">
        <div className="container max-w-3xl text-center space-y-4 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
            Como funciona o <span className="text-primary">Resume Feedback</span>?
          </h1>
          <p className="text-lg text-muted-foreground">
            Uma plataforma completa para melhorar seu currículo com inteligência artificial,
            versionamento e colaboração.
          </p>
        </div>
      </section>

      <section className="pb-20 px-4">
        <div className="container max-w-4xl">
          <div className="space-y-6">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className="flex gap-6 items-start animate-fade-in"
                style={{ animationDelay: `${i * 150}ms`, animationFillMode: 'both' }}
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 hover-scale">
                    <step.icon className="h-5 w-5 text-primary" />
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-px flex-1 bg-border mt-2 min-h-[24px]" />
                  )}
                </div>
                <div className="pb-6">
                  <h3 className="text-lg font-semibold text-foreground">
                    {i + 1}. {step.title}
                  </h3>
                  <p className="text-muted-foreground mt-1">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/50 px-4">
        <div className="container max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Por que escolher o Resume Feedback?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {highlights.map((h, i) => (
              <Card
                key={h.title}
                className="border bg-background hover-scale animate-fade-in"
                style={{ animationDelay: `${i * 100 + 600}ms`, animationFillMode: 'both' }}
              >
                <CardContent className="p-6 space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <h.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{h.title}</h3>
                  <p className="text-sm text-muted-foreground">{h.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground px-4">
        <div className="container max-w-3xl text-center space-y-6">
          <h2 className="text-3xl font-bold">Pronto para começar?</h2>
          <p className="text-lg opacity-90">
            Crie sua conta em segundos e envie seu primeiro currículo.
          </p>
          <Button asChild size="lg" variant="secondary" className="gap-2">
            <Link to="/auth">
              Criar conta grátis
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="py-8 border-t">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2024 Resume Feedback. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
