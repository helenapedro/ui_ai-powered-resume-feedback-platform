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
      title: 'Version-aware AI feedback',
      description: 'The AI review is connected to a specific resume version, so feedback does not get detached from the draft it was generated for.',
    },
    {
      icon: History,
      title: 'Progress across drafts',
      description: 'Users can upload a new version and see how it changed compared with the previous resume, including improved areas, remaining issues, and new issues.',
    },
    {
      icon: Eye,
      title: 'Review context in one place',
      description: 'Resume preview, AI feedback, version history, comments, and sharing stay together, instead of being spread across separate files and conversations.',
    },
    {
      icon: Share2,
      title: 'Controlled sharing',
      description: 'Users can create share links for reviewers, revoke access, set limits, and keep an audit trail of shared resume activity.',
    },
  ];

  const steps = [
    {
      title: '1. Upload a resume',
      description: 'Users create a resume entry and can keep adding new versions as their application materials improve.',
    },
    {
      title: '2. Review the exact version',
      description: 'Each version keeps its own file preview, AI feedback, comments, and review context, so feedback stays tied to the right draft.',
    },
    {
      title: '3. Get AI feedback',
      description: 'AI review runs in the background and returns structured feedback, including a summary, strengths, and improvement areas for that version.',
    },
    {
      title: '4. Compare progress',
      description: 'When users upload a newer version, the platform can show what improved, what still needs work, and what new issues appeared.',
    },
  ];

  const technicalDesign = [
    {
      title: 'Fast uploads',
      description: 'The app saves the resume and creates an AI review job right away, instead of making the user wait while the AI model processes the file.',
    },
    {
      title: 'Background AI processing',
      description: 'A separate worker handles slower AI tasks like extracting resume text, calling the AI model, retrying failures, and saving feedback.',
    },
    {
      title: 'Structured data storage',
      description: 'MySQL stores users, resumes, versions, jobs, sharing, comments, and audit records. MongoDB stores the AI-generated feedback and progress documents.',
    },
    {
      title: 'Practical architecture',
      description: 'The backend is organized into clear parts: one for user-facing API work, one for background AI work, and one shared area for common data structures.',
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
            AI resume feedback that helps users improve across drafts
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
            Resume Feedback helps job seekers move from scattered resume edits to a structured review workflow. Users
            can upload a resume, get AI-generated feedback, add new versions, compare progress, and share the right
            draft for review.
          </p>
        </div>
      </section>

      <section className="pb-20 px-4">
        <div className="container max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border bg-background shadow-sm">
              <CardHeader>
                <CardTitle>The problem</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
                <p>
                  Resume feedback often gets split across renamed files, email threads, messages, and disconnected
                  comments. Once a new draft appears, it becomes hard to know what changed, what improved, and what
                  still needs work.
                </p>
              </CardContent>
            </Card>

            <Card className="border bg-background shadow-sm">
              <CardHeader>
                <CardTitle>The impact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
                <p>
                  The platform keeps the resume, feedback, version history, preview, comments, and sharing in one
                  workflow. That helps users review the exact version being discussed and understand how their resume is
                  improving over time.
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
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">What Makes It Different</p>
            <h2 className="mt-4 text-3xl font-bold text-foreground">More than a one-time AI response</h2>
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
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">How It Works</p>
            <h2 className="mt-4 text-3xl font-bold text-foreground">Built around real resume improvement cycles</h2>
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

          <div className="mt-8">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Technical Design</p>
              <h2 className="mt-4 text-3xl font-bold text-foreground">Designed to keep uploads fast and feedback reliable</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {technicalDesign.map((item, index) => (
                <Card
                  key={item.title}
                  className="border bg-background shadow-sm animate-fade-in"
                  style={{ animationDelay: `${index * 120}ms`, animationFillMode: 'both' }}
                >
                  <CardContent className="p-6 space-y-3">
                    <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm leading-7 text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card className="mt-8 border bg-background shadow-sm">
            <CardHeader>
              <CardTitle>Who it's for</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm leading-7 text-muted-foreground md:grid-cols-3">
              <p>Job seekers improving resumes through multiple drafts and wanting clearer feedback after each revision.</p>
              <p>Students who want AI feedback that is tied to their actual resume version instead of generic resume advice.</p>
              <p>Mentors, peers, or reviewers who need a cleaner way to view, comment on, and discuss the right resume draft.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground px-4">
        <div className="container max-w-3xl text-center space-y-6">
          <h2 className="text-3xl font-bold">Start improving your resume with better review context.</h2>
          <p className="text-lg opacity-90">Create an account, upload a resume version, review AI feedback, and track how each draft changes.</p>
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
