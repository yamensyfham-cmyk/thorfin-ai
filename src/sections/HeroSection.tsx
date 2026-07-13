import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Sparkles, X, Shield, SlidersHorizontal, Dices,
  Wand2, Download, Copy, Share2, Maximize2,
  RefreshCw, Heart, Loader2
} from 'lucide-react';
import { DiceIcon } from '@/components/SvgIcons';
import ParticleCanvas from '@/components/ParticleCanvas';
import { useI18n } from '@/hooks/useI18n';
import type { GenerationSettings, GeneratedImage } from '@/types';
import { gsap } from 'gsap';

const RANDOM_PROMPTS = [
  'A cyberpunk cityscape at twilight with neon reflections on wet streets, highly detailed, 8k',
  'An ethereal forest with bioluminescent plants and floating spores, magical atmosphere',
  'A majestic dragon perched on a mountain peak at sunset, fantasy art, cinematic',
  'A futuristic astronaut floating in deep space with colorful nebula in background',
  'A serene Japanese zen garden with cherry blossoms, soft morning light, watercolor style',
  'An abstract oil painting with swirling colors of deep indigo and emerald green',
  'A steampunk mechanical owl with brass gears and glowing sapphire eyes',
  'A crystal cave with underground lake reflecting prismatic light beams',
];

const STYLE_TAGS = ['photorealistic', 'digital', 'anime', 'oil', '3d', 'abstract'];

const ASPECT_RATIOS = [
  { key: '1:1', w: 1, h: 1 },
  { key: '3:4', w: 3, h: 4 },
  { key: '4:3', w: 4, h: 3 },
  { key: '16:9', w: 16, h: 9 },
];

interface HeroSectionProps {
  onGenerate: (image: GeneratedImage) => void;
  onToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export default function HeroSection({ onGenerate, onToast }: HeroSectionProps) {
  const { t } = useI18n();
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [showNegative, setShowNegative] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [progress, setProgress] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  const [settings, setSettings] = useState<GenerationSettings>({
    aspectRatio: '1:1',
    size: 512,
    guidanceScale: 7.5,
    steps: 25,
    seed: Math.floor(Math.random() * 1000000),
    model: 'pollinations',
  });

  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const promptBarRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(headlineRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 })
      .fromTo(subtitleRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.4')
      .fromTo(promptBarRef.current, { opacity: 0, y: 20, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.5 }, '-=0.3');

    if (tagsRef.current) {
      const tags = tagsRef.current.children;
      tl.fromTo(tags, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.04 }, '-=0.2');
    }
  }, []);

  const handleRandomPrompt = useCallback(() => {
    const random = RANDOM_PROMPTS[Math.floor(Math.random() * RANDOM_PROMPTS.length)];
    setPrompt(random);
  }, []);

  const handleTagClick = useCallback((tag: string) => {
    const tagMap: Record<string, string> = {
      photorealistic: t('tags.photorealistic'),
      digital: t('tags.digital'),
      anime: t('tags.anime'),
      oil: t('tags.oil'),
      '3d': t('tags.3d'),
      abstract: t('tags.abstract'),
    };
    const tagText = tagMap[tag] || tag;
    setPrompt(prev => prev ? `${prev}, ${tagText}` : tagText);
  }, [t]);

  const generateImage = useCallback(async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setProgress(0);
    setGeneratedImage(null);

    const progressInterval = setInterval(() => {
      setProgress(p => Math.min(p + Math.random() * 15, 90));
    }, 300);

    try {
      let imageUrl: string;

      if (settings.model === 'pollinations') {
        const aspect = ASPECT_RATIOS.find(a => a.key === settings.aspectRatio);
        const width = settings.size;
        const height = aspect ? Math.round(width * (aspect.h / aspect.w)) : settings.size;
        const encodedPrompt = encodeURIComponent(prompt);
        const seed = settings.seed || Math.floor(Math.random() * 1000000);
        imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true`;
      } else {
        // Hugging Face fallback - use Pollinations as proxy
        const encodedPrompt = encodeURIComponent(prompt);
        imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${settings.size}&height=${settings.size}&seed=${settings.seed}&nologo=true`;
      }

      // Simulate loading time for better UX
      await new Promise(resolve => setTimeout(resolve, 2000));

      clearInterval(progressInterval);
      setProgress(100);

      const newImage: GeneratedImage = {
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        url: imageUrl,
        prompt,
        negativePrompt: negativePrompt || undefined,
        seed: settings.seed,
        aspectRatio: settings.aspectRatio,
        guidanceScale: settings.guidanceScale,
        steps: settings.steps,
        size: settings.size,
        model: settings.model,
        date: new Date().toISOString(),
        favorite: false,
      };

      setGeneratedImage(newImage);
      onGenerate(newImage);
      onToast(t('toast.saved'), 'success');
    } catch {
      onToast(t('toast.error'), 'error');
    } finally {
      clearInterval(progressInterval);
      setIsGenerating(false);
      setProgress(0);
    }
  }, [prompt, negativePrompt, settings, isGenerating, onGenerate, onToast, t]);

  const handleDownload = useCallback(() => {
    if (!generatedImage) return;
    const a = document.createElement('a');
    a.href = generatedImage.url;
    a.download = `thorfin-${generatedImage.id.slice(0, 8)}.png`;
    a.target = '_blank';
    a.click();
    onToast(t('toast.downloaded'), 'success');
  }, [generatedImage, onToast, t]);

  const handleCopyPrompt = useCallback(() => {
    if (!generatedImage) return;
    navigator.clipboard.writeText(generatedImage.prompt);
    onToast(t('toast.copied'), 'success');
  }, [generatedImage, onToast, t]);

  const handleShare = useCallback(async () => {
    if (!generatedImage) return;
    try {
      await navigator.share({
        title: 'Thorfin AI Generated Image',
        text: generatedImage.prompt,
        url: generatedImage.url,
      });
    } catch {
      navigator.clipboard.writeText(generatedImage.url);
      onToast(t('toast.copied'), 'success');
    }
  }, [generatedImage, onToast, t]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
      <ParticleCanvas />

      <div className="relative z-10 w-full max-w-[720px] mx-auto">
        {/* Headline */}
        <h1
          ref={headlineRef}
          className="text-3xl md:text-4xl font-bold text-center text-text-primary mb-3 opacity-0"
        >
          {t('hero.headline').split('AI')[0]}
          <span className="text-sapphire">AI</span>
          {t('hero.headline').split('AI')[1]}
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-base text-center text-text-secondary mb-8 opacity-0"
        >
          {t('hero.subtitle')}
        </p>

        {/* Prompt Bar */}
        <div
          ref={promptBarRef}
          className={`relative rounded-xl glass-lg transition-all duration-300 ${
            isGenerating ? 'generating-pulse' : ''
          } opacity-0`}
        >
          <div className="p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-sapphire mt-1 flex-shrink-0" />
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value.slice(0, 500))}
                onKeyDown={(e) => {
                  if (e.ctrlKey && e.key === 'Enter') {
                    generateImage();
                  }
                }}
                placeholder={t('prompt.placeholder')}
                className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted resize-none outline-none min-h-[60px] text-sm"
                rows={2}
                maxLength={500}
                disabled={isGenerating}
              />
            </div>

            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-text-muted">
                {t('prompt.charLimit', { current: prompt.length, max: 500 })}
              </span>
              <button
                onClick={generateImage}
                disabled={!prompt.trim() || isGenerating}
                className="btn-primary flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-sapphire"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('generating.status')}
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    {t('prompt.generate')}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          {isGenerating && (
            <div className="h-0.5 bg-abyss rounded-b-xl overflow-hidden">
              <div
                className="h-full progress-shimmer rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        {/* Action Row */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <button
            onClick={handleRandomPrompt}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all disabled:opacity-50"
          >
            <Dices className="w-4 h-4" />
            {t('prompt.random')}
          </button>

          <button
            onClick={() => setPrompt('')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all"
          >
            <X className="w-4 h-4" />
            {t('prompt.clear')}
          </button>

          <button
            onClick={() => setShowNegative(!showNegative)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all ${
              showNegative ? 'text-sapphire bg-sapphire/10' : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
            }`}
          >
            <Shield className="w-4 h-4" />
            {t('prompt.negative')}
          </button>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all ${
              showAdvanced ? 'text-sapphire bg-sapphire/10' : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {t('prompt.advanced')}
          </button>
        </div>

        {/* Negative Prompt */}
        {showNegative && (
          <div className="mt-3 rounded-lg glass p-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <textarea
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="Things to exclude from the image..."
              className="w-full bg-transparent text-text-primary placeholder:text-text-muted resize-none outline-none text-sm"
              rows={2}
            />
          </div>
        )}

        {/* Advanced Settings */}
        {showAdvanced && (
          <div className="mt-3 rounded-xl glass p-5 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Aspect Ratio */}
              <div>
                <label className="text-xs text-text-muted mb-2 block">{t('settings.aspectRatio')}</label>
                <div className="flex gap-2">
                  {ASPECT_RATIOS.map(ar => (
                    <button
                      key={ar.key}
                      onClick={() => setSettings(s => ({ ...s, aspectRatio: ar.key }))}
                      className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg border transition-all ${
                        settings.aspectRatio === ar.key
                          ? 'border-sapphire bg-sapphire/10 text-sapphire'
                          : 'border-glass-border text-text-muted hover:text-text-secondary'
                      }`}
                    >
                      <div
                        className="border border-current rounded"
                        style={{
                          width: ar.w > ar.h ? 20 : 14,
                          height: ar.w > ar.h ? 14 : 20,
                        }}
                      />
                      <span className="text-xs">{ar.key}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Size */}
              <div>
                <label className="text-xs text-text-muted mb-2 block">
                  {t('settings.size')}: {settings.size}px
                </label>
                <input
                  type="range"
                  min={128}
                  max={1024}
                  step={64}
                  value={settings.size}
                  onChange={(e) => setSettings(s => ({ ...s, size: Number(e.target.value) }))}
                  className="w-full accent-sapphire"
                />
              </div>

              {/* Guidance Scale */}
              <div>
                <label className="text-xs text-text-muted mb-2 block">
                  {t('settings.guidance')}: {settings.guidanceScale}
                </label>
                <input
                  type="range"
                  min={1}
                  max={20}
                  step={0.5}
                  value={settings.guidanceScale}
                  onChange={(e) => setSettings(s => ({ ...s, guidanceScale: Number(e.target.value) }))}
                  className="w-full accent-sapphire"
                />
              </div>

              {/* Steps */}
              <div>
                <label className="text-xs text-text-muted mb-2 block">
                  {t('settings.steps')}: {settings.steps}
                </label>
                <input
                  type="range"
                  min={10}
                  max={50}
                  step={1}
                  value={settings.steps}
                  onChange={(e) => setSettings(s => ({ ...s, steps: Number(e.target.value) }))}
                  className="w-full accent-sapphire"
                />
              </div>

              {/* Seed */}
              <div>
                <label className="text-xs text-text-muted mb-2 block">{t('settings.seed')}</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={settings.seed}
                    onChange={(e) => setSettings(s => ({ ...s, seed: Number(e.target.value) }))}
                    className="flex-1 bg-surface rounded-lg px-3 py-1.5 text-sm text-text-primary outline-none focus:ring-1 focus:ring-sapphire border border-transparent"
                  />
                  <button
                    onClick={() => setSettings(s => ({ ...s, seed: Math.floor(Math.random() * 1000000) }))}
                    className="p-2 rounded-lg glass hover:bg-white/5 transition-colors"
                  >
                    <DiceIcon className="text-text-secondary" />
                  </button>
                </div>
              </div>

              {/* Model */}
              <div>
                <label className="text-xs text-text-muted mb-2 block">{t('settings.model')}</label>
                <select
                  value={settings.model}
                  onChange={(e) => setSettings(s => ({ ...s, model: e.target.value as 'pollinations' | 'huggingface' }))}
                  className="w-full bg-surface rounded-lg px-3 py-1.5 text-sm text-text-primary outline-none focus:ring-1 focus:ring-sapphire border border-transparent"
                >
                  <option value="pollinations">{t('model.pollinations')}</option>
                  <option value="huggingface">{t('model.huggingface')}</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Quick Tags */}
        <div ref={tagsRef} className="flex flex-wrap gap-2 mt-4 justify-center">
          {STYLE_TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className="px-3.5 py-1.5 rounded-full glass text-xs text-text-muted hover:text-text-secondary hover:bg-white/5 transition-all"
            >
              {t(`tags.${tag}`)}
            </button>
          ))}
        </div>

        {/* Generated Image Result */}
        {generatedImage && !isGenerating && (
          <div className="mt-8 rounded-xl glass-lg overflow-hidden animate-in fade-in zoom-in-95 duration-500">
            <img
              src={generatedImage.url}
              alt={generatedImage.prompt}
              className="w-full h-auto max-h-[500px] object-contain bg-void"
              loading="lazy"
            />
            <div className="p-4 border-t border-separator">
              <p className="text-sm text-text-secondary mb-3 line-clamp-2">{generatedImage.prompt}</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={handleDownload} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all">
                  <Download className="w-3.5 h-3.5" />
                  {t('action.download')}
                </button>
                <button onClick={handleCopyPrompt} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all">
                  <Copy className="w-3.5 h-3.5" />
                  {t('action.copy')}
                </button>
                <button onClick={handleShare} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all">
                  <Share2 className="w-3.5 h-3.5" />
                  {t('action.share')}
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all">
                  <Maximize2 className="w-3.5 h-3.5" />
                  {t('action.fullscreen')}
                </button>
                <button
                  onClick={() => setIsFavorited(!isFavorited)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                    isFavorited ? 'text-crimson' : 'text-text-secondary hover:text-text-primary'
                  } hover:bg-white/5`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-current' : ''}`} />
                  {t('action.favorite')}
                </button>
                <button
                  onClick={generateImage}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {t('action.regenerate')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
