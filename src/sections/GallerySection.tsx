import { useState, useMemo } from 'react';
import { Search, Heart, Download, Pencil, Trash2, Grid3X3, List } from 'lucide-react';
import { EmptyStateIcon } from '@/components/SvgIcons';
import { useI18n } from '@/hooks/useI18n';
import type { GeneratedImage } from '@/types';

interface GallerySectionProps {
  images: GeneratedImage[];
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

type SortMode = 'newest' | 'oldest' | 'favorites';

export default function GallerySection({ images, onToggleFavorite, onDelete, onToast }: GallerySectionProps) {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredImages = useMemo(() => {
    let result = [...images];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(img => img.prompt.toLowerCase().includes(q));
    }

    switch (sortMode) {
      case 'newest':
        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'favorites':
        result = result.filter(img => img.favorite);
        break;
    }

    return result;
  }, [images, searchQuery, sortMode]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDownload = (img: GeneratedImage) => {
    const a = document.createElement('a');
    a.href = img.url;
    a.download = `thorfin-${img.id.slice(0, 8)}.png`;
    a.target = '_blank';
    a.click();
    onToast(t('toast.downloaded'), 'success');
  };

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    onToast(t('toast.copied'), 'success');
  };

  return (
    <section className="relative z-10 py-16 px-4 md:px-6" id="gallery">
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h2 className="text-xl font-semibold text-text-primary">{t('gallery.title')}</h2>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('gallery.search')}
                className="pl-9 pr-4 py-2 rounded-lg glass text-sm text-text-primary placeholder:text-text-muted outline-none focus:ring-1 focus:ring-sapphire w-[200px]"
              />
            </div>

            {/* Sort */}
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              className="px-3 py-2 rounded-lg glass text-sm text-text-secondary outline-none focus:ring-1 focus:ring-sapphire bg-transparent"
            >
              <option value="newest">{t('gallery.sort.newest')}</option>
              <option value="oldest">{t('gallery.sort.oldest')}</option>
              <option value="favorites">{t('gallery.sort.favorites')}</option>
            </select>

            {/* View Toggle */}
            <div className="flex rounded-lg glass overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${viewMode === 'grid' ? 'text-sapphire bg-sapphire/10' : 'text-text-muted hover:text-text-secondary'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${viewMode === 'list' ? 'text-sapphire bg-sapphire/10' : 'text-text-muted hover:text-text-secondary'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredImages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <EmptyStateIcon size={120} className="text-text-muted mb-4" />
            <p className="text-text-secondary text-sm">{t('gallery.empty')}</p>
          </div>
        ) : viewMode === 'grid' ? (
          /* Masonry Grid */
          <div className="masonry-grid">
            {filteredImages.map((img) => (
              <div
                key={img.id}
                className="masonry-item gallery-card rounded-xl glass overflow-hidden group"
              >
                <div className="overflow-hidden">
                  <img
                    src={img.url}
                    alt={img.prompt}
                    className="gallery-image w-full h-auto"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/hero-placeholder.jpg';
                    }}
                  />
                </div>
                <div className="p-3">
                  <p className="text-xs text-text-secondary line-clamp-2 mb-1">{img.prompt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-text-muted">{formatDate(img.date)}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onToggleFavorite(img.id)}
                        className={`p-1.5 rounded-md transition-colors ${
                          img.favorite ? 'text-crimson' : 'text-text-muted hover:text-text-secondary'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${img.favorite ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => handleDownload(img)}
                        className="p-1.5 rounded-md text-text-muted hover:text-text-secondary transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleCopyPrompt(img.prompt)}
                        className="p-1.5 rounded-md text-text-muted hover:text-text-secondary transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(img.id)}
                        className="p-1.5 rounded-md text-text-muted hover:text-crimson transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="flex flex-col gap-3">
            {filteredImages.map((img) => (
              <div
                key={img.id}
                className="flex gap-4 p-3 rounded-xl glass hover:bg-white/[0.03] transition-colors group"
              >
                <img
                  src={img.url}
                  alt={img.prompt}
                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/hero-placeholder.jpg';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-secondary line-clamp-2 mb-1">{img.prompt}</p>
                  <span className="text-xs text-text-muted">{formatDate(img.date)}</span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => onToggleFavorite(img.id)}
                    className={`p-1.5 rounded-md transition-colors ${
                      img.favorite ? 'text-crimson' : 'text-text-muted hover:text-text-secondary'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${img.favorite ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => handleDownload(img)}
                    className="p-1.5 rounded-md text-text-muted hover:text-text-secondary transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(img.id)}
                    className="p-1.5 rounded-md text-text-muted hover:text-crimson transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
