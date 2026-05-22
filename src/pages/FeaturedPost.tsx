import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LINKEDIN_EMBED_URL =
  'https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7462595076766982145';

const LINKEDIN_POST_URL =
  'https://www.linkedin.com/feed/update/urn:li:ugcPost:7462595076766982145/';

export default function FeaturedPost() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,hsl(var(--background)),hsl(var(--muted)/0.22))]">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">Resume Feedback</span>
          </Link>
          <Button asChild variant="ghost" className="gap-2">
            <Link to="/about">
              <ArrowLeft className="h-4 w-4" />
              Back to About
            </Link>
          </Button>
        </div>
      </header>

      <main className="px-4 py-12">
        <div className="container max-w-5xl">
          <div className="rounded-[2rem] border bg-background/95 p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Featured Project</p>
                <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
                  LinkedIn post about the Handshake AI Showcase feature
                </h1>
                <p className="max-w-3xl text-base leading-7 text-muted-foreground">
                  This post shares the project recognition in the Handshake AI Showcase and explains the product
                  direction behind version-aware AI resume feedback.
                </p>
              </div>
              <Button asChild variant="outline" className="gap-2">
                <a href={LINKEDIN_POST_URL} target="_blank" rel="noreferrer">
                  Open on LinkedIn
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>

            <div className="mt-8 overflow-hidden rounded-[1.5rem] border bg-muted/20">
              <iframe
                src={LINKEDIN_EMBED_URL}
                title="LinkedIn post embed"
                className="h-[1677px] w-full"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
