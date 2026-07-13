import { useState, useCallback } from 'react';
import Navigation from '@/components/Navigation';
import { ToastContainer } from '@/components/Toast';
import HeroSection from '@/sections/HeroSection';
import GallerySection from '@/sections/GallerySection';
import FeaturesSection from '@/sections/FeaturesSection';
import SettingsSection from '@/sections/SettingsSection';
import FooterSection from '@/sections/FooterSection';
import { useHistory } from '@/hooks/useHistory';
import { useToast } from '@/hooks/useToast';
import { useI18n } from '@/hooks/useI18n';

export default function Home() {
  const [activeSection, setActiveSection] = useState('create');
  const { images, addImage, deleteImage, toggleFavorite, clearHistory, exportHistory, importHistory } = useHistory();
  const { toasts, addToast, removeToast } = useToast();
  const { isRTL } = useI18n();

  const handleGenerate = useCallback((image: import('@/types').GeneratedImage) => {
    addImage(image);
  }, [addImage]);

  const handleClearCache = useCallback(() => {
    clearHistory();
    localStorage.removeItem('thorfin-settings');
  }, [clearHistory]);

  return (
    <div className="min-h-screen bg-void" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />

      <main>
        {/* Create / Hero */}
        <HeroSection onGenerate={handleGenerate} onToast={addToast} />

        {/* Features */}
        <FeaturesSection />

        {/* Gallery */}
        <GallerySection
          images={images}
          onToggleFavorite={toggleFavorite}
          onDelete={deleteImage}
          onToast={addToast}
        />

        {/* Settings */}
        <SettingsSection
          onClearCache={handleClearCache}
          onExportHistory={exportHistory}
          onImportHistory={importHistory}
          onToast={addToast}
        />
      </main>

      <FooterSection />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
