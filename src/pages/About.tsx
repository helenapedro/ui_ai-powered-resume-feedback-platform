import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FileText,
  Sparkles,
  History,
  Share2,
  ArrowRight,
  Eye,
  BrainCircuit,
  Server,
  Database,
  Cpu,
} from 'lucide-react';

export default function About() {
  const differentiators = [
    {
      icon: Sparkles,
      title: 'AI Feedback',
      description: 'Each version can trigger an async AI review that returns a summary, strengths, and improvement items.',
    },
    {
      icon: History,
      title: 'Version History',
      description: 'Resume iteration stays organized in one place instead of being scattered across duplicate files.',
    },
    {
      icon: Eye,
      title: 'Resume Preview',
      description: 'The product keeps the file in view so review context stays tied to the exact version being discussed.',
    },
    {
      icon: Share2,
      title: 'Shared Reviews',
      description: 'Share links support controlled access and collaboration flows without opening the entire account.',
    },
  ];

  const steps = [
    {
      title: '1. Upload a resume',
      description: 'Create a resume entry, then keep adding new versions as your application materials evolve.',
    },
    {
      title: '2. Select the version under review',
      description: 'Preview the exact file, open version history, and keep review context anchored to the current draft.',
    },
    {
      title: '3. Run AI review jobs',
      description: 'Worker services process AI feedback asynchronously and return a structured review for that version.',
    },
    {
      title: '4. Review, revise, and share',
      description: 'Use comments, controlled share links, preview, and download to move through real review cycles.',
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
        <div className="container max-w-5xl text-center space-y-6 animate-fade-in">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Resume Feedback Platform</p>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
            AI resume review with version tracking, preview, and shared feedback
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
            Resume Feedback is built for one job: helping people improve resumes through a real review workflow that
            supports multiple versions, AI-generated feedback, controlled sharing, and collaboration.
          </p>
        </div>
      </section>

      <section className="pb-20 px-4">
        <div className="container max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border bg-background shadow-sm">
              <CardHeader>
                <CardTitle>What it does</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
                <p>
                  The product accepts resume uploads, stores multiple versions, runs async AI feedback jobs, and keeps
                  version-specific preview, download, comments, and sharing in one workflow.
                </p>
                <p>
                  The result is a cleaner review process: one place to inspect the current file, understand what changed,
                  and decide what to improve next.
                </p>
              </CardContent>
            </Card>

            <Card className="border bg-background shadow-sm">
              <CardHeader>
                <CardTitle>Why it exists</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
                <p>
                  Resume work usually breaks across email threads, renamed PDFs, and feedback that loses context as soon
                  as a new draft appears.
                </p>
                <p>
                  Resume Feedback keeps the review attached to the version being evaluated so iteration feels structured
                  instead of chaotic.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/50 px-4">
        <div className="container max-w-5xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">What makes it different</p>
            <h2 className="mt-4 text-3xl font-bold text-foreground">A real workflow, not a generic feedback form</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {differentiators.map((highlight, index) => (
              <Card
                key={highlight.title}
                className="border bg-background hover-scale animate-fade-in"
                style={{ animationDelay: `${index * 100 + 150}ms`, animationFillMode: 'both' }}
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

      <section className="py-20 px-4">
        <div className="container max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">How it works</p>
              <h2 className="mt-4 text-3xl font-bold text-foreground">Built for version-aware resume improvement</h2>
              <div className="mt-8 space-y-6">
                {steps.map((step, index) => (
                  <div
                    key={step.title}
                    className="rounded-2xl border bg-background p-6 shadow-sm animate-fade-in"
                    style={{ animationDelay: `${index * 120}ms`, animationFillMode: 'both' }}
                  >
                    <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <Card className="border bg-background shadow-sm">
                <CardHeader>
                  <CardTitle>Who it’s for</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
                  <p>Job seekers improving resumes over multiple drafts.</p>
                  <p>Mentors and peers who want a cleaner way to review and comment.</p>
                  <p>Anyone who wants AI feedback without losing version history or review context.</p>
                </CardContent>
              </Card>

              <Card className="border bg-background shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BrainCircuit className="h-5 w-5 text-primary" />
                    Built with Codex
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
                  <p>
                    Codex was used as an engineering accelerator to move faster across frontend structure, integration,
                    and product refinement while keeping the implementation grounded in the real API.
                  </p>
                  <p>
                    That makes the project a practical showcase of how Codex can speed up shipping without inventing a
                    product that the backend does not actually support.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/50 py-20 px-4">
        <div className="container max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">How it’s built</p>
            <h2 className="mt-4 text-3xl font-bold text-foreground">The product architecture behind the workflow</h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <Card className="border bg-background shadow-sm">
              <CardContent className="space-y-3 p-6">
                <Sparkles className="h-6 w-6 text-primary" />
                <h3 className="font-semibold text-foreground">Frontend</h3>
                <p className="text-sm leading-6 text-muted-foreground">React frontend deployed on AWS Amplify.</p>
              </CardContent>
            </Card>
            <Card className="border bg-background shadow-sm">
              <CardContent className="space-y-3 p-6">
                <Server className="h-6 w-6 text-primary" />
                <h3 className="font-semibold text-foreground">API</h3>
                <p className="text-sm leading-6 text-muted-foreground">Spring Boot API on Heroku handling auth, resumes, sharing, and comments.</p>
              </CardContent>
            </Card>
            <Card className="border bg-background shadow-sm">
              <CardContent className="space-y-3 p-6">
                <Cpu className="h-6 w-6 text-primary" />
                <h3 className="font-semibold text-foreground">Workers</h3>
                <p className="text-sm leading-6 text-muted-foreground">Worker services process AI review jobs asynchronously.</p>
              </CardContent>
            </Card>
            <Card className="border bg-background shadow-sm">
              <CardContent className="space-y-3 p-6">
                <Database className="h-6 w-6 text-primary" />
                <h3 className="font-semibold text-foreground">Data</h3>
                <p className="text-sm leading-6 text-muted-foreground">MySQL and MongoDB support transactional and AI feedback data.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground px-4">
        <div className="container max-w-3xl text-center space-y-6">
          <h2 className="text-3xl font-bold">Enter the resume review workflow.</h2>
          <p className="text-lg opacity-90">Create your account, upload a version, and start reviewing with better context.</p>
          <Button asChild size="lg" variant="secondary" className="gap-2">
            <Link to="/auth">
              Start Reviewing
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="py-8 border-t">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2026 Resume Feedback. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
