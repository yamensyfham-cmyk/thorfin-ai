import { useState, useEffect } from 'react';
import { Sun, Moon, Sparkles, Image, Clock, Settings } from 'lucide-react';
import { LogoMark } from './SvgIcons';
import { useI18n } from '@/hooks/useI18n';

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function Navigation({ activeSection, onSectionChange }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const { t, lang, toggleLanguage } = useI18n();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const navItems = [
    { id: 'create', label: t('nav.create'), icon: Sparkles },
    { id: 'gallery', label: t('nav.gallery'), icon: Image },
    { id: 'history', label: t('nav.history'), icon: Clock },
    { id: 'settings', label: t('nav.settings'), icon: Settings },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] h-[52px] flex items-center justify-between px-4 md:px-6 transition-all duration-300 ${
        scrolled
          ? 'glass border-b border-separator'
          : 'bg-transparent'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <button
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          onSectionChange('create');
        }}
        className="flex items-center gap-2 group"
      >
        <LogoMark size={24} className="text-sapphire" />
        <span className="text-sm font-bold tracking-[0.1em] text-text-primary">
          THORFIN
        </span>
      </button>

      {/* Center Nav */}
      <div className="hidden md:flex items-center gap-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'create') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
                onSectionChange(item.id);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all duration-200 ${
                isActive
                  ? 'text-sapphire'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-sapphire rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-8 h-8 rounded-full glass flex items-center justify-center hover:bg-white/5 transition-colors"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-text-secondary" />
          ) : (
            <Moon className="w-4 h-4 text-text-secondary" />
          )}
        </button>

        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className="px-2 py-1 rounded-full glass text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
          aria-label="Toggle language"
        >
          {lang === 'en' ? 'EN' : 'AR'}
        </button>
      </div>
    </nav>
  );
}
