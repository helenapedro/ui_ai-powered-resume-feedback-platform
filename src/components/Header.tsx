import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Menu, User, LogOut, ChevronRight, Info, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { LegalLinks } from '@/components/LegalLinks';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export function Header() {
  const { isAuthenticated, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const nextLanguage = language === 'en' ? 'pt' : 'en';

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to={isAuthenticated ? '/my-resumes' : '/'} className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-primary">{t('app.name')}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLanguage(nextLanguage)}
            aria-label={t('language.switchLabel')}
          >
            {language === 'en' ? 'PT' : 'EN'}
          </Button>
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                title={t('nav.profile')}
              >
                <User className="h-4 w-4" />
                <span>{t('nav.profile')}</span>
                <ChevronRight className="h-3.5 w-3.5 opacity-70" />
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                {t('nav.signOut')}
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/#about"
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                title={t('nav.about')}
              >
                <Info className="h-4 w-4" />
                <span>{t('nav.about')}</span>
              </Link>
              <Button asChild variant="ghost" size="sm">
                <Link to="/auth">
                  <LogIn className="h-4 w-4 mr-2" />
                  {t('nav.signIn')}
                </Link>
              </Button>
            </>
          )}
        </nav>

        <div className="md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SheetHeader className="sr-only">
                <SheetTitle>{t('nav.menuTitle')}</SheetTitle>
                <SheetDescription>{t('nav.menuDescription')}</SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLanguage(nextLanguage)}
                  className="justify-start"
                  aria-label={t('language.switchLabel')}
                >
                  {language === 'en' ? t('language.portuguese') : t('language.english')}
                </Button>
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      <span>{t('nav.profile')}</span>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={handleLogout} className="justify-start">
                      <LogOut className="h-4 w-4 mr-2" />
                      {t('nav.signOut')}
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/#about"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Info className="h-4 w-4" />
                      <span>{t('nav.about')}</span>
                    </Link>
                    <Link
                      to="/auth"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      <LogIn className="h-4 w-4" />
                      <span>{t('nav.signIn')}</span>
                    </Link>
                  </>
                )}
                <div className="border-t pt-4">
                  <LegalLinks className="justify-start" />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
