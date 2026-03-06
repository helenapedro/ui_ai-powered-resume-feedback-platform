import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, MessageSquare, History, Sparkles, ArrowRight } from 'lucide-react';

export default function Landing() {
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
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              AI feedback for your resume
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-primary leading-tight">
              Improve your resume with
              <br />
              <span className="text-primary/80">artificial intelligence</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get instant, detailed feedback on your resume, share it with others, and keep improving your career materials.
            </p>

            <div className="flex items-center justify-center gap-4 pt-4">
              <Button asChild size="lg" className="gap-2">
                <Link to="/auth">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/about">Learn more</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/50">
        <div className="container max-w-6xl px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why use Resume Feedback?</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background rounded-xl p-6 shadow-sm border">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Feedback</h3>
              <p className="text-muted-foreground">
                Advanced AI analyzes your resume and highlights areas to improve.
              </p>
            </div>

            <div className="bg-background rounded-xl p-6 shadow-sm border">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Collaboration</h3>
              <p className="text-muted-foreground">
                Share your resume and collect feedback from other professionals.
              </p>
            </div>

            <div className="bg-background rounded-xl p-6 shadow-sm border">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <History className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Version History</h3>
              <p className="text-muted-foreground">
                Keep every resume version organized and revisit older iterations when needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container max-w-4xl px-4 text-center">
          <FileText className="h-12 w-12 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">Ready to improve your resume?</h2>
          <p className="text-lg opacity-90 mb-8">
            Join professionals who are refining their resumes with faster, clearer feedback.
          </p>
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
          <p>© 2025 Resume Feedback. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
