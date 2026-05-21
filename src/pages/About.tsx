import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowRight,
  ExternalLink,
  Eye,
  FileText,
  History,
  Share2,
  Sparkles,
  Trophy,
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

      <section className="pb-20 px-4">
        <div className="container max-w-6xl">
          <div className="overflow-hidden rounded-[2rem] border bg-[linear-gradient(135deg,hsl(var(--primary)/0.08),transparent_50%),linear-gradient(180deg,hsl(var(--background)),hsl(var(--muted)/0.18))] shadow-sm">
            <div className="grid gap-8 p-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  <Trophy className="h-4 w-4" />
                  Featured Project
                </div>
                <div className="space-y-3">
                  <h2 className="text-3xl font-bold text-foreground">Recognized in the Handshake AI Showcase</h2>
                  <p className="text-base leading-7 text-muted-foreground">
                    Resume Feedback Platform was featured in the Handshake AI Showcase through the OpenAI Developers x
                    Handshake Codex Creator Challenge, highlighting the project’s approach to version-aware AI resume
                    review and structured iteration.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button asChild>
                    <a
                      href="https://app.joinhandshake.com/ai-showcase?project_id=3056375"
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Handshake Feature
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button asChild variant="outline">
                    <a href="/docs/featured.html" target="_blank" rel="noreferrer">
                      View LinkedIn Embed
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>

              <div className="rounded-[1.5rem] border bg-background/90 p-3 shadow-sm">
                <img
                  src="/docs/project-images/handshake_featured.png"
                  alt="Resume Feedback Platform featured in the Handshake AI Showcase"
                  className="w-full rounded-[1rem] object-cover"
                />
              </div>
            </div>
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
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">How it works</p>
            <h2 className="mt-4 text-3xl font-bold text-foreground">Built for version-aware resume improvement</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
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

          <Card className="mt-8 border bg-background shadow-sm">
            <CardHeader>
              <CardTitle>Who it's for</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm leading-7 text-muted-foreground md:grid-cols-3">
              <p>Job seekers improving resumes over multiple drafts.</p>
              <p>Mentors and peers who want a cleaner way to review and comment.</p>
              <p>Anyone who wants AI feedback without losing version history or review context.</p>
            </CardContent>
          </Card>
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
