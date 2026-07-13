import { useState, useRef, useEffect } from 'react';
import { Moon, Sun, Monitor, Sparkles, Trash2, RotateCcw } from 'lucide-react';
import { ExportIcon, ImportIcon } from '@/components/SvgIcons';
import { useI18n } from '@/hooks/useI18n';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SettingsSectionProps {
  onClearCache: () => void;
  onExportHistory: () => void;
  onImportHistory: (file: File) => void;
  onToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export default function SettingsSection({ onClearCache, onExportHistory, onImportHistory, onToast }: SettingsSectionProps) {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');
  const [animations, setAnimations] = useState(true);
  const [defaultSize, setDefaultSize] = useState(512);
  const [defaultQuality, setDefaultQuality] = useState(25);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const items = section.querySelectorAll('.settings-item');
    const ctx = gsap.context(() => {
      gsap.fromTo(items,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            once: true,
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportHistory(file);
      onToast('History imported!', 'success');
    }
    e.target.value = '';
  };

  const handleClearCache = () => {
    if (confirm('Are you sure you want to clear all cached data? This cannot be undone.')) {
      onClearCache();
      onToast('Cache cleared!', 'success');
    }
  };

  const handleReset = () => {
    if (confirm('Reset all settings to defaults?')) {
      setTheme('dark');
      setAnimations(true);
      setDefaultSize(512);
      setDefaultQuality(25);
      onToast('Settings reset!', 'info');
    }
  };

  return (
    <section ref={sectionRef} className="relative z-10 py-16 px-4 md:px-6" id="settings">
      <div className="max-w-[600px] mx-auto">
        <h2 className="text-xl font-semibold text-text-primary mb-6">{t('settings.title')}</h2>

        <div className="flex flex-col gap-4">
          {/* Theme */}
          <div className="settings-item rounded-xl glass p-4 opacity-0">
            <label className="text-sm text-text-secondary mb-3 block">{t('settings.theme')}</label>
            <div className="flex gap-2">
              {[
                { key: 'dark', icon: Moon, label: 'Dark' },
                { key: 'light', icon: Sun, label: 'Light' },
                { key: 'system', icon: Monitor, label: 'System' },
              ].map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => setTheme(key as 'dark' | 'light' | 'system')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                    theme === key
                      ? 'border-sapphire bg-sapphire/10 text-sapphire'
                      : 'border-glass-border text-text-muted hover:text-text-secondary'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Animations */}
          <div className="settings-item rounded-xl glass p-4 flex items-center justify-between opacity-0">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-text-secondary" />
              <span className="text-sm text-text-secondary">{t('settings.animations')}</span>
            </div>
            <button
              onClick={() => setAnimations(!animations)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                animations ? 'bg-sapphire' : 'bg-surface'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                  animations ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Default Size */}
          <div className="settings-item rounded-xl glass p-4 opacity-0">
            <label className="text-sm text-text-secondary mb-2 block">
              {t('settings.defaultSize')}: {defaultSize}px
            </label>
            <input
              type="range"
              min={128}
              max={1024}
              step={64}
              value={defaultSize}
              onChange={(e) => setDefaultSize(Number(e.target.value))}
              className="w-full accent-sapphire"
            />
          </div>

          {/* Default Quality */}
          <div className="settings-item rounded-xl glass p-4 opacity-0">
            <label className="text-sm text-text-secondary mb-2 block">
              {t('settings.defaultQuality')}: {defaultQuality} steps
            </label>
            <input
              type="range"
              min={10}
              max={50}
              step={1}
              value={defaultQuality}
              onChange={(e) => setDefaultQuality(Number(e.target.value))}
              className="w-full accent-sapphire"
            />
          </div>

          {/* Actions */}
          <div className="settings-item rounded-xl glass p-4 opacity-0">
            <label className="text-sm text-text-secondary mb-3 block">Actions</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleClearCache}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-crimson/30 text-crimson hover:bg-crimson/10 transition-colors text-sm"
              >
                <Trash2 className="w-4 h-4" />
                {t('settings.clearCache')}
              </button>

              <button
                onClick={onExportHistory}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-glass-border text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors text-sm"
              >
                <ExportIcon className="text-current" />
                {t('settings.exportHistory')}
              </button>

              <button
                onClick={handleImportClick}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-glass-border text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors text-sm"
              >
                <ImportIcon className="text-current" />
                {t('settings.importHistory')}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />

              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-glass-border text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                {t('settings.reset')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
