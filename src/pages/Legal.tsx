import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LegalLinks } from '@/components/LegalLinks';
import { useLanguage } from '@/contexts/LanguageContext';

type LegalPageType = 'privacy' | 'terms';

interface LegalPageProps {
  type: LegalPageType;
}

type LegalSection = {
  title: string;
  body: string[];
};

const updatedAt = 'June 5, 2026';

const content: Record<LegalPageType, Record<'en' | 'pt', {
  eyebrow: string;
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
}>> = {
  privacy: {
    en: {
      eyebrow: 'Privacy',
      title: 'Privacy Policy',
      intro: 'This policy explains how Resume Feedback handles personal data when you create an account, upload resumes, request AI feedback, manage comments, or share review links.',
      updated: `Last updated: ${updatedAt}`,
      sections: [
        {
          title: 'Data we collect',
          body: [
            'Account data such as email address, password hash, sign-in status, Google sign-in identifiers, role, creation date, and last login date.',
            'Profile data such as full name, phone number, bio, and profile image when you choose to provide it.',
            'Resume data such as uploaded PDF files, filenames, file size, content type, checksums, extracted text used for analysis, version history, comments, and share-link settings.',
            'Technical and security data such as IP address, user agent, access audit events, JWT session data, language preference, and pinned resume preferences.',
          ],
        },
        {
          title: 'How we use data',
          body: [
            'We use your data to provide authentication, resume upload and preview, version tracking, AI feedback, progress comparison, comments, controlled sharing, account management, security, abuse prevention, debugging, and support.',
            'When you upload a resume, the system may extract text from the PDF and send relevant excerpts to an AI provider to generate feedback and version-to-version progress analysis.',
          ],
        },
        {
          title: 'Service providers',
          body: [
            'The platform may use infrastructure and service providers such as hosting platforms, database providers, AWS S3 for file storage, Google Identity Services for Google sign-in, and AI providers such as OpenAI or Google Gemini.',
            'Shared resume previews or downloads may use time-limited storage URLs when files are stored in S3.',
          ],
        },
        {
          title: 'Sharing and public links',
          body: [
            'When you create a share link, anyone with the link may view the shared resume according to the permissions, expiration, download setting, and usage limit you configure.',
            'Share-link access may be audited with event type, success or failure, IP address, user agent, timestamp, and related resume information.',
          ],
        },
        {
          title: 'Retention and deletion',
          body: [
            'You may deactivate or delete your account from the profile area. Deactivation disables account access while data is retained for possible reactivation.',
            'Account deletion removes your owned resumes and related files where possible, deletes related AI artifacts, and anonymizes historical comments you made on resumes owned by other users to preserve discussion integrity.',
          ],
        },
        {
          title: 'Your choices',
          body: [
            'You can avoid uploading sensitive information that is not needed for resume review, revoke share links, delete resumes, update profile data, deactivate your account, or request account deletion.',
            'For privacy requests, contact feedback@hmpedro.com.',
          ],
        },
      ],
    },
    pt: {
      eyebrow: 'Privacidade',
      title: 'Politica de Privacidade',
      intro: 'Esta politica explica como o Resume Feedback trata dados pessoais quando voce cria uma conta, carrega CVs, solicita feedback de IA, gere comentarios ou partilha links de revisao.',
      updated: `Ultima atualizacao: ${updatedAt}`,
      sections: [
        {
          title: 'Dados que recolhemos',
          body: [
            'Dados de conta, como email, hash da palavra-passe, estado de login, identificadores do login com Google, papel, data de criacao e ultimo login.',
            'Dados de perfil, como nome completo, telefone, bio e imagem de perfil quando voce decide fornece-los.',
            'Dados de CV, como PDFs carregados, nomes de ficheiro, tamanho, tipo de conteudo, checksums, texto extraido para analise, historico de versoes, comentarios e configuracoes de links de partilha.',
            'Dados tecnicos e de seguranca, como endereco IP, user-agent, eventos de auditoria de acesso, dados de sessao JWT, preferencia de idioma e preferencias de CVs fixados.',
          ],
        },
        {
          title: 'Como usamos os dados',
          body: [
            'Usamos os dados para autenticacao, upload e pre-visualizacao de CVs, historico de versoes, feedback de IA, comparacao de progresso, comentarios, partilha controlada, gestao de conta, seguranca, prevencao de abuso, depuracao e suporte.',
            'Quando voce carrega um CV, o sistema pode extrair texto do PDF e enviar trechos relevantes a um provedor de IA para gerar feedback e analise de progresso entre versoes.',
          ],
        },
        {
          title: 'Fornecedores de servico',
          body: [
            'A plataforma pode usar fornecedores de infraestrutura e servicos, como hospedagem, bases de dados, AWS S3 para armazenamento de ficheiros, Google Identity Services para login com Google e provedores de IA como OpenAI ou Google Gemini.',
            'Pre-visualizacoes ou downloads de CVs partilhados podem usar URLs temporarias de armazenamento quando os ficheiros estao no S3.',
          ],
        },
        {
          title: 'Partilha e links publicos',
          body: [
            'Quando voce cria um link de partilha, qualquer pessoa com o link pode visualizar o CV partilhado de acordo com as permissoes, expiracao, configuracao de download e limite de usos definidos por voce.',
            'O acesso por link pode ser auditado com tipo de evento, sucesso ou falha, endereco IP, user-agent, timestamp e informacoes relacionadas ao CV.',
          ],
        },
        {
          title: 'Retencao e eliminacao',
          body: [
            'Voce pode desativar ou eliminar a conta na area de perfil. A desativacao bloqueia o acesso enquanto os dados sao mantidos para possivel reativacao.',
            'A eliminacao da conta remove os CVs de sua propriedade e ficheiros relacionados quando possivel, elimina artefatos de IA relacionados e anonimiza comentarios historicos feitos por voce em CVs de outros usuarios para preservar a integridade da discussao.',
          ],
        },
        {
          title: 'Suas escolhas',
          body: [
            'Voce pode evitar carregar informacoes sensiveis que nao sejam necessarias para a revisao do CV, revogar links de partilha, eliminar CVs, atualizar dados de perfil, desativar a conta ou solicitar eliminacao da conta.',
            'Para pedidos de privacidade, contacte feedback@hmpedro.com.',
          ],
        },
      ],
    },
  },
  terms: {
    en: {
      eyebrow: 'Terms',
      title: 'Terms of Service',
      intro: 'These terms describe the rules for using Resume Feedback and the responsibilities that apply when you upload resumes, request AI feedback, and share review links.',
      updated: `Last updated: ${updatedAt}`,
      sections: [
        {
          title: 'Use of the service',
          body: [
            'Resume Feedback is provided to help users organize resume versions, generate AI-assisted feedback, compare progress, and collect comments from reviewers.',
            'You are responsible for the information you upload, the people you share links with, and the comments or content you submit through the service.',
          ],
        },
        {
          title: 'Accounts and access',
          body: [
            'You must provide accurate account information and keep your login credentials secure.',
            'You may create, revoke, expire, or limit share links. Anyone with a valid share link may access the shared resume according to the permissions attached to that link.',
          ],
        },
        {
          title: 'Uploaded content',
          body: [
            'You should only upload resumes or CVs that you have the right to process and share. Do not upload unlawful, harmful, or unrelated documents.',
            'You grant the platform permission to store, process, preview, extract text from, and analyze uploaded files as needed to provide the service.',
          ],
        },
        {
          title: 'AI feedback',
          body: [
            'AI feedback is generated automatically and may be incomplete, inaccurate, or unsuitable for your specific career goals.',
            'The service does not guarantee interviews, employment outcomes, recruiter approval, or professional career advice. You should review all suggestions before relying on them.',
          ],
        },
        {
          title: 'Acceptable use',
          body: [
            'Do not attempt to bypass access controls, abuse public links, scrape the service, overload the API, upload malicious files, impersonate others, or use the platform for unlawful activity.',
            'We may restrict, suspend, or remove access when needed to protect the service, users, or shared content.',
          ],
        },
        {
          title: 'Availability and changes',
          body: [
            'The service may change, become unavailable, or contain defects. Features may be modified or removed as the product evolves.',
            'These terms may be updated as the service changes. Continued use after updates means you accept the revised terms.',
          ],
        },
        {
          title: 'Contact',
          body: [
            'For questions about these terms or privacy requests, contact feedback@hmpedro.com.',
          ],
        },
      ],
    },
    pt: {
      eyebrow: 'Termos',
      title: 'Termos de Servico',
      intro: 'Estes termos descrevem as regras de uso do Resume Feedback e as responsabilidades aplicaveis quando voce carrega CVs, solicita feedback de IA e partilha links de revisao.',
      updated: `Ultima atualizacao: ${updatedAt}`,
      sections: [
        {
          title: 'Uso do servico',
          body: [
            'O Resume Feedback ajuda usuarios a organizar versoes de CV, gerar feedback assistido por IA, comparar progresso e recolher comentarios de revisores.',
            'Voce e responsavel pelas informacoes que carrega, pelas pessoas com quem partilha links e pelos comentarios ou conteudos enviados pelo servico.',
          ],
        },
        {
          title: 'Contas e acesso',
          body: [
            'Voce deve fornecer informacoes corretas da conta e manter suas credenciais de acesso seguras.',
            'Voce pode criar, revogar, expirar ou limitar links de partilha. Qualquer pessoa com um link valido pode acessar o CV partilhado conforme as permissoes desse link.',
          ],
        },
        {
          title: 'Conteudo carregado',
          body: [
            'Carregue apenas CVs que voce tem direito de processar e partilhar. Nao carregue documentos ilegais, nocivos ou sem relacao com CVs.',
            'Voce autoriza a plataforma a armazenar, processar, pre-visualizar, extrair texto e analisar ficheiros carregados conforme necessario para fornecer o servico.',
          ],
        },
        {
          title: 'Feedback de IA',
          body: [
            'O feedback de IA e gerado automaticamente e pode ser incompleto, impreciso ou inadequado para seus objetivos profissionais especificos.',
            'O servico nao garante entrevistas, emprego, aprovacao de recruiters ou aconselhamento profissional. Revise as sugestoes antes de confiar nelas.',
          ],
        },
        {
          title: 'Uso aceitavel',
          body: [
            'Nao tente contornar controles de acesso, abusar de links publicos, fazer scraping, sobrecarregar a API, carregar ficheiros maliciosos, passar-se por outras pessoas ou usar a plataforma para atividade ilegal.',
            'Podemos restringir, suspender ou remover acesso quando necessario para proteger o servico, usuarios ou conteudo partilhado.',
          ],
        },
        {
          title: 'Disponibilidade e mudancas',
          body: [
            'O servico pode mudar, ficar indisponivel ou conter defeitos. Funcionalidades podem ser alteradas ou removidas conforme o produto evolui.',
            'Estes termos podem ser atualizados conforme o servico muda. O uso continuo apos atualizacoes significa aceitacao dos termos revisados.',
          ],
        },
        {
          title: 'Contacto',
          body: [
            'Para perguntas sobre estes termos ou pedidos de privacidade, contacte feedback@hmpedro.com.',
          ],
        },
      ],
    },
  },
};

export default function LegalPage({ type }: LegalPageProps) {
  const { language, setLanguage } = useLanguage();
  const page = content[type][language];
  const nextLanguage = language === 'en' ? 'pt' : 'en';

  return (
    <main className="min-h-screen bg-muted/30">
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">Resume Feedback</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setLanguage(nextLanguage)}>
              {language === 'en' ? 'PT' : 'EN'}
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link to="/auth">{language === 'pt' ? 'Entrar' : 'Sign in'}</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="container max-w-4xl px-4 py-10">
        <div className="mb-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">{page.eyebrow}</p>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">{page.title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">{page.intro}</p>
          <p className="mt-3 text-sm text-muted-foreground">{page.updated}</p>
        </div>

        <Card className="border bg-background shadow-sm">
          <CardContent className="space-y-8 p-6 sm:p-8">
            {page.sections.map((section) => (
              <section key={section.title} className="space-y-3">
                <h2 className="text-xl font-semibold text-foreground">{section.title}</h2>
                <div className="space-y-3 text-sm leading-6 text-muted-foreground">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </CardContent>
        </Card>
      </section>

      <footer className="border-t bg-background px-4 py-5">
        <LegalLinks />
      </footer>
    </main>
  );
}
