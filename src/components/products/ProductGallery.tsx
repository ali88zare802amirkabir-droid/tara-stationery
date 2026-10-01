'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Expand, X, ZoomIn } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { toPersianDigits } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';

export function ProductGallery({ product }: { product: Product }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });

  const active = product.images[activeIndex] ?? product.images[0];
  const outOfStock = product.stock <= 0;

  const onMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setZoomOrigin({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        className="group relative aspect-square overflow-hidden rounded-3xl border border-line bg-canvas-soft"
        onMouseMove={onMove}
        onMouseLeave={() => setZoomOrigin({ x: 50, y: 50 })}
      >
        <motion.div
          key={active.src}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 transition-transform duration-500 ease-spring group-hover:scale-110"
          style={{ transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%` }}
        >
          <Image
            src={active.src}
            alt={active.alt}
            fill
            priority
            sizes="(min-width: 1024px) 44vw, 92vw"
            className="object-cover"
          />
        </motion.div>

        {outOfStock ? (
          <div className="absolute inset-0 grid place-items-center bg-surface/70 backdrop-blur-[1px]">
            <Badge tone="neutral" className="px-4 py-2 text-sm">
              موقتاً ناموجود
            </Badge>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => setZoomOpen(true)}
          aria-label="بزرگ‌نمایی تصویر"
          className="absolute bottom-3 end-3 inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/92 px-3.5 py-2 text-2xs font-bold text-ink-700 shadow-soft backdrop-blur transition-colors hover:bg-surface"
        >
          <ZoomIn className="h-3.5 w-3.5" aria-hidden />
          بزرگ‌نمایی
        </button>

        <span className="pointer-events-none absolute start-3 top-3 rounded-full border border-line bg-surface/88 px-2.5 py-1 text-2xs font-bold text-ink-500 backdrop-blur">
          نمای {toPersianDigits(activeIndex + 1)} از {toPersianDigits(product.images.length)}
        </span>
      </div>

      <ul className="grid grid-cols-3 gap-2.5">
        {product.images.map((image, index) => (
          <li key={image.src}>
            <button
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`نمایش تصویر ${index + 1}`}
              aria-current={index === activeIndex}
              className={cn(
                'relative block aspect-square w-full overflow-hidden rounded-2xl border-2 bg-canvas-soft transition-all duration-200',
                index === activeIndex
                  ? 'border-brand-500 shadow-soft'
                  : 'border-transparent hover:border-brand-200',
              )}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 14vw, 30vw"
                className="object-cover"
              />
            </button>
          </li>
        ))}
      </ul>

      <ZoomLightbox
        open={zoomOpen}
        onClose={() => setZoomOpen(false)}
        src={active.src}
        alt={active.alt}
        title={product.name}
      />
    </div>
  );
}

function ZoomLightbox({
  open,
  onClose,
  src,
  alt,
  title,
}: {
  open: boolean;
  onClose: () => void;
  src: string;
  alt: string;
  title: string;
}) {
  useLockBodyScroll(open);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[95] grid place-items-center bg-ink-900/80 p-4 backdrop-blur-sm">
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-label="بستن بزرگ‌نمایی"
            className="absolute inset-0 cursor-zoom-out"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-3xl"
          >
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-white/15">
              <Image src={src} alt={alt} fill sizes="90vw" className="object-cover" />
            </div>
            <div className="mt-4 flex items-center justify-between gap-3 text-white">
              <p className="text-xs font-bold">{title}</p>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3.5 py-2 text-2xs font-bold backdrop-blur transition-colors hover:bg-white/20"
              >
                <X className="h-3.5 w-3.5" aria-hidden />
                بستن
              </button>
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-2xs text-white/50">
              <Expand className="h-3 w-3" aria-hidden />
              برای بستن، روی تصویر یا دکمه بستن کلیک کنید.
            </p>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
