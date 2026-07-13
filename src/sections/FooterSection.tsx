import { Github, Twitter, MessageCircle } from 'lucide-react';
import { LogoMark } from '@/components/SvgIcons';
import { useI18n } from '@/hooks/useI18n';

export default function FooterSection() {
  const { t } = useI18n();

  return (
    <footer className="relative z-10 border-t border-separator bg-abyss">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-10">
        {/* Top Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          {/* Logo + Tagline */}
          <div className="flex items-center gap-3">
            <LogoMark size={24} className="text-sapphire" />
            <div>
              <span className="text-sm font-bold tracking-[0.1em] text-text-primary">THORFIN</span>
              <p className="text-xs text-text-muted mt-0.5">{t('footer.tagline')}</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full glass flex items-center justify-center text-text-muted hover:text-text-secondary hover:bg-white/5 transition-all"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full glass flex items-center justify-center text-text-muted hover:text-text-secondary hover:bg-white/5 transition-all"
              aria-label="Twitter"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full glass flex items-center justify-center text-text-muted hover:text-text-secondary hover:bg-white/5 transition-all"
              aria-label="Discord"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-separator">
          <p className="text-xs text-text-muted">
            &copy; {t('footer.copyright')}
          </p>
          <div className="flex items-center gap-4">
            <button className="text-xs text-text-muted hover:text-text-secondary transition-colors">
              {t('footer.privacy')}
            </button>
            <button className="text-xs text-text-muted hover:text-text-secondary transition-colors">
              {t('footer.terms')}
            </button>
            <button className="text-xs text-text-muted hover:text-text-secondary transition-colors">
              {t('footer.contact')}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
