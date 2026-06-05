import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

interface LegalLinksProps {
  className?: string;
}

export function LegalLinks({ className = '' }: LegalLinksProps) {
  const { language } = useLanguage();
  const copy = language === 'pt'
    ? {
        privacy: 'Politica de Privacidade',
        terms: 'Termos de Servico',
      }
    : {
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
      };

  return (
    <nav className={`flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground ${className}`}>
      <Link to="/privacy" className="hover:text-foreground hover:underline">
        {copy.privacy}
      </Link>
      <Link to="/terms" className="hover:text-foreground hover:underline">
        {copy.terms}
      </Link>
    </nav>
  );
}
