import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, MessageSquare, History, Sparkles, ArrowRight, Eye, Share2, BrainCircuit } from 'lucide-react';

export default function Landing() {
  const pillars = [
    {
      icon: Sparkles,
      title: 'AI Feedback',
      description:
        'Generate structured feedback that explains the resume’s current strengths and the most important gaps to close.',
    },
    {
      icon: History,
      title: 'Version History',
      description:
        'Keep each draft organized, compare progress, and understand whether the resume is getting stronger over time.',
    },
    {
      icon: Eye,
      title: 'Resume Preview',
      description:
        'Preview and download the exact version under review so feedback stays connected to the right file.',
    },
    {
      icon: Share2,
      title: 'Shared Reviews',
      description:
        'Create controlled share links, collect comments, and keep collaboration tied to the selected resume version.',
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
            <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Button asChild>
              <Link to="/auth">Sign in</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="container max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <BrainCircuit className="h-4 w-4" />
                AI Resume Review with Version Tracking
              </div>

              <div className="space-y-5">
                <h1 className="text-4xl font-bold leading-tight text-primary md:text-6xl">
                  Improve your resume across drafts with AI feedback
                </h1>

                <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
                  Upload a resume, get structured AI feedback, track what changed across versions, and share the right
                  draft for review.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button asChild size="lg" className="gap-2">
                  <Link to="/auth">
                    Start Reviewing
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/about">See How It Works</Link>
                </Button>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border bg-background p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Review</p>
                  <p className="mt-2 text-sm text-foreground">
                    Get focused AI feedback with a summary, strengths, and the highest-priority improvements.
                  </p>
                </div>
                <div className="rounded-2xl border bg-background p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Track</p>
                  <p className="mt-2 text-sm text-foreground">
                    Keep resume versions in one place and see how each draft changes over time.
                  </p>
                </div>
                <div className="rounded-2xl border bg-background p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Share</p>
                  <p className="mt-2 text-sm text-foreground">
                    Use controlled share links and comments to get feedback without losing review context.
                  </p>
                </div>
              </div>
            </div>

            <Card className="overflow-hidden border-border/70 bg-[linear-gradient(135deg,hsl(var(--primary)/0.07),transparent_42%),linear-gradient(180deg,hsl(var(--background)),hsl(var(--muted)/0.2))] shadow-xl">
              <CardContent className="space-y-6 p-6 sm:p-8">
                <div className="flex items-center justify-between rounded-2xl border bg-background/90 px-4 py-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Current Workflow</p>
                    <p className="mt-1 text-lg font-semibold text-foreground">Resume Review in Progress</p>
                  </div>
                  <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">v3 selected</div>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-2xl border bg-background p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-primary/10 p-2.5">
                        <Sparkles className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold">AI Feedback</h3>
                        <p className="text-sm text-muted-foreground">Structured review for the selected resume version.</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border bg-background p-5 shadow-sm">
                      <div className="flex items-center gap-3">
                        <History className="h-5 w-5 text-primary" />
                        <div>
                          <h3 className="text-base font-semibold">Version History</h3>
                          <p className="text-sm text-muted-foreground">Compare progress across drafts.</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-2xl border bg-background p-5 shadow-sm">
                      <div className="flex items-center gap-3">
                        <Eye className="h-5 w-5 text-primary" />
                        <div>
                          <h3 className="text-base font-semibold">Resume Preview</h3>
                          <p className="text-sm text-muted-foreground">Open the exact file being reviewed.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border bg-background p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      <div>
                        <h3 className="text-base font-semibold">Shared Reviews</h3>
                        <p className="text-sm text-muted-foreground">Comments and controlled access stay tied to the resume version.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-20">
        <div className="container max-w-6xl px-4">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Product Pillars</p>
            <h2 className="mt-4 text-3xl font-bold text-foreground md:text-4xl">
              Built for real resume improvement cycles
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Resume Feedback keeps the review process organized across AI feedback, version history, preview, and
              controlled sharing.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {pillars.map((pillar) => (
              <Card key={pillar.title} className="h-full border bg-background shadow-sm">
                <CardContent className="space-y-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <pillar.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{pillar.title}</h3>
                    <p className="text-sm leading-6 text-muted-foreground">{pillar.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container max-w-6xl px-4">
          <div className="grid gap-8 rounded-[2rem] border bg-background p-8 shadow-sm lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Built for Resume Iteration</p>
              <h2 className="mt-4 text-3xl font-bold text-foreground">Turn resume feedback into a repeatable improvement process.</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border bg-muted/20 p-5">
                <h3 className="text-base font-semibold">Upload</h3>
                <p className="mt-2 text-sm text-muted-foreground">Create a resume record or add a new version as your application materials evolve.</p>
              </div>
              <div className="rounded-2xl border bg-muted/20 p-5">
                <h3 className="text-base font-semibold">Review</h3>
                <p className="mt-2 text-sm text-muted-foreground">Run AI feedback in the background and review structured results for the selected version.</p>
              </div>
              <div className="rounded-2xl border bg-muted/20 p-5">
                <h3 className="text-base font-semibold">Collaborate</h3>
                <p className="mt-2 text-sm text-muted-foreground">Share the right draft, collect comments, and keep feedback connected to the version being reviewed.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container max-w-4xl px-4 text-center">
          <FileText className="h-12 w-12 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">Start improving your resume with better review context.</h2>
          <p className="text-lg opacity-90 mb-8">
            Create an account, upload a resume, review AI feedback, and track how each draft changes.
          </p>
          <Button asChild size="lg" variant="secondary" className="gap-2">
            <Link to="/auth">
              Enter the Platform
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
