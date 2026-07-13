import { useRef, useEffect } from 'react';
import { Zap, Palette, Sliders } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function FeaturesSection() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards = section.querySelectorAll('.feature-card');
    const ctx = gsap.context(() => {
      gsap.fromTo(cards,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.12,
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

  const features = [
    {
      icon: Zap,
      title: t('feature.fast.title'),
      description: t('feature.fast.desc'),
      iconColor: 'text-sapphire',
    },
    {
      icon: Palette,
      title: t('feature.styles.title'),
      description: t('feature.styles.desc'),
      iconColor: 'text-violet',
    },
    {
      icon: Sliders,
      title: t('feature.control.title'),
      description: t('feature.control.desc'),
      iconColor: 'text-teal',
    },
  ];

  return (
    <section ref={sectionRef} className="relative z-10 py-16 px-4 md:px-6 bg-abyss">
      <div className="max-w-[1000px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="feature-card relative rounded-xl glass p-6 text-center overflow-hidden opacity-0"
              >
                {/* Top accent gradient */}
                <div className="feature-accent absolute top-0 left-0 right-0 h-[2px]" />

                {/* Icon */}
                <div className="w-14 h-14 rounded-full glass flex items-center justify-center mx-auto mb-4">
                  <Icon className={`w-7 h-7 ${feature.iconColor}`} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
