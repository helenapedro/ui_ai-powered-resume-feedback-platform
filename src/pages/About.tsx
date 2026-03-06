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
      title: 'Upload your resume',
      description: 'Send your resume as a PDF and keep it safely stored on the platform.',
    },
    {
      icon: Sparkles,
      title: 'Get AI feedback',
      description: 'Our AI reviews your resume and generates concrete suggestions for improvement.',
    },
    {
      icon: MessageSquare,
      title: 'Comment and collaborate',
      description: 'Collect comments on specific sections and get feedback from other professionals.',
    },
    {
      icon: History,
      title: 'Track every version',
      description: 'Each change creates a new version so you can compare and revisit earlier drafts.',
    },
    {
      icon: Share2,
      title: 'Share with ease',
      description: 'Create share links with expiration controls for recruiters, mentors, or peers.',
    },
  ];

  const highlights = [
    {
      icon: Shield,
      title: 'Privacy first',
      description: 'Your data and resumes stay protected. You control who can access them.',
    },
    {
      icon: Eye,
      title: 'Built-in preview',
      description: 'Preview your PDF directly in the platform without downloading it first.',
    },
    {
      icon: FileText,
      title: 'Free to use',
      description: 'Core features are available without hidden plans or complicated onboarding.',
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
              About
            </Link>
            <Button asChild>
              <Link to="/auth">Sign in</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="py-20 px-4">
        <div className="container max-w-3xl text-center space-y-4 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
            How does <span className="text-primary">Resume Feedback</span> work?
          </h1>
          <p className="text-lg text-muted-foreground">
            A complete platform to improve your resume with AI, version history, and collaboration.
          </p>
        </div>
      </section>

      <section className="pb-20 px-4">
        <div className="container max-w-4xl">
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="flex gap-6 items-start animate-fade-in"
                style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'both' }}
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 hover-scale">
                    <step.icon className="h-5 w-5 text-primary" />
                  </div>
                  {index < steps.length - 1 && <div className="w-px flex-1 bg-border mt-2 min-h-[24px]" />}
                </div>
                <div className="pb-6">
                  <h3 className="text-lg font-semibold text-foreground">
                    {index + 1}. {step.title}
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
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Why choose Resume Feedback?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {highlights.map((highlight, index) => (
              <Card
                key={highlight.title}
                className="border bg-background hover-scale animate-fade-in"
                style={{ animationDelay: `${index * 100 + 600}ms`, animationFillMode: 'both' }}
              >
                <CardContent className="p-6 space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <highlight.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{highlight.title}</h3>
                  <p className="text-sm text-muted-foreground">{highlight.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground px-4">
        <div className="container max-w-3xl text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to get started?</h2>
          <p className="text-lg opacity-90">Create your account in seconds and upload your first resume.</p>
          <Button asChild size="lg" variant="secondary" className="gap-2">
            <Link to="/auth">
              Create a free account
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="py-8 border-t">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2024 Resume Feedback. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
