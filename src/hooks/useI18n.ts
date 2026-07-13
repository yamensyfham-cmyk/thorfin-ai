import { useState, useCallback } from 'react';
import type { Language } from '@/types';

const translations: Record<string, Record<Language, string>> = {
  'app.title': {
    en: 'Thorfin Free Image Generator',
    ar: 'ثورفين مولد الصور المجاني'
  },
  'app.tagline': {
    en: 'Create beautiful AI images for free.',
    ar: 'أنشئ صوراً جميلة بالذكاء الاصطناعي مجاناً.'
  },
  'nav.create': {
    en: 'Create',
    ar: 'إنشاء'
  },
  'nav.gallery': {
    en: 'Gallery',
    ar: 'المعرض'
  },
  'nav.history': {
    en: 'History',
    ar: 'التاريخ'
  },
  'nav.settings': {
    en: 'Settings',
    ar: 'الإعدادات'
  },
  'hero.headline': {
    en: 'Create Stunning AI Images',
    ar: 'أنشئ صوراً مذهلة بالذكاء الاصطناعي'
  },
  'hero.subtitle': {
    en: 'Transform your ideas into visual masterpieces in seconds. No login required.',
    ar: 'حول أفكارك إلى تحف فنية في ثوانٍ. لا يتطلب تسجيل الدخول.'
  },
  'prompt.placeholder': {
    en: 'Describe the image you want to create...',
    ar: 'صِف الصورة التي تريد إنشاءها...'
  },
  'prompt.generate': {
    en: 'Generate',
    ar: 'إنشاء'
  },
  'prompt.random': {
    en: 'Random Prompt',
    ar: 'موجه عشوائي'
  },
  'prompt.clear': {
    en: 'Clear',
    ar: 'مسح'
  },
  'prompt.negative': {
    en: 'Negative Prompt',
    ar: 'الموجه السلبي'
  },
  'prompt.advanced': {
    en: 'Advanced Settings',
    ar: 'إعدادات متقدمة'
  },
  'prompt.charLimit': {
    en: '{current} / {max}',
    ar: '{current} / {max}'
  },
  'settings.aspectRatio': {
    en: 'Aspect Ratio',
    ar: 'نسبة العرض'
  },
  'settings.size': {
    en: 'Image Size',
    ar: 'حجم الصورة'
  },
  'settings.guidance': {
    en: 'Guidance Scale',
    ar: 'مقياس الإرشاد'
  },
  'settings.steps': {
    en: 'Steps',
    ar: 'الخطوات'
  },
  'settings.seed': {
    en: 'Seed',
    ar: 'البذرة'
  },
  'settings.model': {
    en: 'Model',
    ar: 'النموذج'
  },
  'settings.randomize': {
    en: 'Randomize',
    ar: 'عشوائي'
  },
  'tags.photorealistic': {
    en: 'Photorealistic',
    ar: 'واقعي'
  },
  'tags.digital': {
    en: 'Digital Art',
    ar: 'فن رقمي'
  },
  'tags.anime': {
    en: 'Anime',
    ar: 'أنمي'
  },
  'tags.oil': {
    en: 'Oil Painting',
    ar: 'زيتي'
  },
  'tags.3d': {
    en: '3D Render',
    ar: 'ثلاثي الأبعاد'
  },
  'tags.abstract': {
    en: 'Abstract',
    ar: 'تجريدي'
  },
  'gallery.title': {
    en: 'Your Gallery',
    ar: 'معرضك'
  },
  'gallery.search': {
    en: 'Search history...',
    ar: 'البحث في التاريخ...'
  },
  'gallery.sort.newest': {
    en: 'Newest',
    ar: 'الأحدث'
  },
  'gallery.sort.oldest': {
    en: 'Oldest',
    ar: 'الأقدم'
  },
  'gallery.sort.favorites': {
    en: 'Favorites',
    ar: 'المفضلة'
  },
  'gallery.empty': {
    en: 'No images yet. Start creating!',
    ar: 'لا توجد صور بعد. ابدأ الإنشاء!'
  },
  'feature.fast.title': {
    en: 'Lightning Fast',
    ar: 'سريع البرق'
  },
  'feature.fast.desc': {
    en: 'Generate stunning images in under 5 seconds with optimized inference.',
    ar: 'أنشئ صوراً مذهلة في أقل من 5 ثوانٍ باستخدام استدلال مُحسّن.'
  },
  'feature.styles.title': {
    en: 'Infinite Styles',
    ar: 'أنماط لانهائية'
  },
  'feature.styles.desc': {
    en: 'From photorealistic portraits to abstract art — any style you can imagine.',
    ar: 'من الصور الواقعية إلى الفن التجريدي — أي أسلوب يمكنك تخيله.'
  },
  'feature.control.title': {
    en: 'Full Control',
    ar: 'تحكم كامل'
  },
  'feature.control.desc': {
    en: 'Fine-tune every parameter. Aspect ratio, guidance, steps, seed — total precision.',
    ar: 'ضبط دقيق لكل معامل. نسبة العرض، الإرشاد، الخطوات، البذرة — دقة تامة.'
  },
  'action.download': {
    en: 'Download',
    ar: 'تحميل'
  },
  'action.copy': {
    en: 'Copy Prompt',
    ar: 'نسخ الموجه'
  },
  'action.share': {
    en: 'Share',
    ar: 'مشاركة'
  },
  'action.fullscreen': {
    en: 'Fullscreen',
    ar: 'ملء الشاشة'
  },
  'action.edit': {
    en: 'Edit',
    ar: 'تعديل'
  },
  'action.regenerate': {
    en: 'Regenerate',
    ar: 'إعادة إنشاء'
  },
  'action.favorite': {
    en: 'Favorite',
    ar: 'مفضلة'
  },
  'action.delete': {
    en: 'Delete',
    ar: 'حذف'
  },
  'action.cancel': {
    en: 'Cancel',
    ar: 'إلغاء'
  },
  'action.save': {
    en: 'Save',
    ar: 'حفظ'
  },
  'editor.title': {
    en: 'Image Editor',
    ar: 'محرر الصور'
  },
  'editor.crop': {
    en: 'Crop',
    ar: 'قص'
  },
  'editor.rotate': {
    en: 'Rotate',
    ar: 'تدوير'
  },
  'editor.flip': {
    en: 'Flip',
    ar: 'انعكاس'
  },
  'editor.resize': {
    en: 'Resize',
    ar: 'تغيير الحجم'
  },
  'editor.draw': {
    en: 'Draw',
    ar: 'رسم'
  },
  'editor.text': {
    en: 'Text',
    ar: 'نص'
  },
  'editor.filters': {
    en: 'Filters',
    ar: 'فلاتر'
  },
  'editor.brightness': {
    en: 'Brightness',
    ar: 'السطوع'
  },
  'editor.contrast': {
    en: 'Contrast',
    ar: 'التباين'
  },
  'editor.saturation': {
    en: 'Saturation',
    ar: 'التشبع'
  },
  'editor.blur': {
    en: 'Blur',
    ar: 'ضبابية'
  },
  'editor.undo': {
    en: 'Undo',
    ar: 'تراجع'
  },
  'editor.redo': {
    en: 'Redo',
    ar: 'إعادة'
  },
  'editor.reset': {
    en: 'Reset',
    ar: 'إعادة ضبط'
  },
  'editor.export': {
    en: 'Export',
    ar: 'تصدير'
  },
  'settings.title': {
    en: 'Settings',
    ar: 'الإعدادات'
  },
  'settings.theme': {
    en: 'Theme',
    ar: 'المظهر'
  },
  'settings.animations': {
    en: 'Animations',
    ar: 'الرسوم المتحركة'
  },
  'settings.defaultSize': {
    en: 'Default Image Size',
    ar: 'حجم الصورة الافتراضي'
  },
  'settings.defaultQuality': {
    en: 'Default Quality',
    ar: 'الجودة الافتراضية'
  },
  'settings.clearCache': {
    en: 'Clear Cache',
    ar: 'مسح ذاكرة التخزين'
  },
  'settings.exportHistory': {
    en: 'Export History',
    ar: 'تصدير التاريخ'
  },
  'settings.importHistory': {
    en: 'Import History',
    ar: 'استيراد التاريخ'
  },
  'settings.reset': {
    en: 'Reset Settings',
    ar: 'إعادة ضبط الإعدادات'
  },
  'footer.tagline': {
    en: 'Free AI Image Generator — No login required.',
    ar: 'مولد صور مجاني بالذكاء الاصطناعي — لا يتطلب تسجيل الدخول.'
  },
  'footer.copyright': {
    en: '2025 Thorfin. All rights reserved.',
    ar: '2025 ثورفين. جميع الحقوق محفوظة.'
  },
  'footer.privacy': {
    en: 'Privacy',
    ar: 'الخصوصية'
  },
  'footer.terms': {
    en: 'Terms',
    ar: 'الشروط'
  },
  'footer.contact': {
    en: 'Contact',
    ar: 'اتصل بنا'
  },
  'toast.copied': {
    en: 'Copied to clipboard!',
    ar: 'تم النسخ إلى الحافظة!'
  },
  'toast.downloaded': {
    en: 'Image downloaded!',
    ar: 'تم تحميل الصورة!'
  },
  'toast.saved': {
    en: 'Saved to gallery!',
    ar: 'تم الحفظ في المعرض!'
  },
  'toast.deleted': {
    en: 'Image deleted!',
    ar: 'تم حذف الصورة!'
  },
  'toast.error': {
    en: 'Something went wrong!',
    ar: 'حدث خطأ ما!'
  },
  'generating.status': {
    en: 'Generating...',
    ar: 'جاري الإنشاء...'
  },
  'model.pollinations': {
    en: 'Pollinations AI',
    ar: 'بولينايشنز AI'
  },
  'model.huggingface': {
    en: 'Hugging Face',
    ar: 'هاجينغ فيس'
  }
};

export function useI18n() {
  const [lang, setLang] = useState<Language>(() => {
    const stored = localStorage.getItem('thorfin-language');
    return (stored as Language) || 'en';
  });

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    const translation = translations[key]?.[lang] || key;
    if (params) {
      return Object.entries(params).reduce(
        (acc, [k, v]) => acc.replace(`{${k}}`, String(v)),
        translation
      );
    }
    return translation;
  }, [lang]);

  const toggleLanguage = useCallback(() => {
    setLang(prev => {
      const next = prev === 'en' ? 'ar' : 'en';
      localStorage.setItem('thorfin-language', next);
      document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = next;
      return next;
    });
  }, []);

  return { t, lang, toggleLanguage, isRTL: lang === 'ar' };
}
