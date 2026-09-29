import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

export type ProfilePage = { title: string; src: string; thumb: string };

const variants = {
  enter: (dir: number) => ({ rotateY: dir > 0 ? 70 : -70, x: dir > 0 ? '30%' : '-30%', opacity: 0, scale: 0.9 }),
  center: { rotateY: 0, x: '0%', opacity: 1, scale: 1 },
  exit: (dir: number) => ({ rotateY: dir > 0 ? -70 : 70, x: dir > 0 ? '-30%' : '30%', opacity: 0, scale: 0.9 }),
};

export default function ProfileViewer({ pages, pdf }: { pages: ProfilePage[]; pdf: string }) {
  const [[index, dir], setState] = useState<[number, number]>([0, 0]);

  const go = useCallback(
    (to: number) => {
      const clamped = Math.max(0, Math.min(pages.length - 1, to));
      setState(([i]) => [clamped, clamped > i ? 1 : -1]);
    },
    [pages.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(index + 1);
      if (e.key === 'ArrowLeft') go(index - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, go]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -80 || info.velocity.x < -500) go(index + 1);
    else if (info.offset.x > 80 || info.velocity.x > 500) go(index - 1);
  };

  const page = pages[index];

  return (
    <div>
      <div className="relative mx-auto aspect-video w-full max-w-6xl" style={{ perspective: 1800 }}>
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={index}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={onDragEnd}
            data-cursor="Drag"
            className="absolute inset-0 cursor-grab overflow-hidden rounded-2xl border border-white/10 bg-white shadow-[0_40px_120px_-20px_rgba(0,0,0,.8)] active:cursor-grabbing"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <img src={page.src} alt={`Business profile page ${index + 1}: ${page.title}`} className="pointer-events-none h-full w-full object-contain" draggable={false} />
          </motion.div>
        </AnimatePresence>

        <button
          type="button"
          onClick={() => go(index - 1)}
          disabled={index === 0}
          aria-label="Previous page"
          className="absolute left-2 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-ink/70 backdrop-blur transition hover:bg-paper hover:text-ink disabled:opacity-0 md:-left-6 md:h-14 md:w-14"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
        </button>
        <button
          type="button"
          onClick={() => go(index + 1)}
          disabled={index === pages.length - 1}
          aria-label="Next page"
          className="absolute right-2 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-ink/70 backdrop-blur transition hover:bg-paper hover:text-ink disabled:opacity-0 md:-right-6 md:h-14 md:w-14"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </button>
      </div>

      <div className="mx-auto mt-8 flex max-w-6xl flex-wrap items-center justify-between gap-4">
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-sm tabular-nums">
            <span className="text-paper">{String(index + 1).padStart(2, '0')}</span>
            <span className="text-mute"> / {String(pages.length).padStart(2, '0')}</span>
          </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={page.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-lg font-medium"
            >
              {page.title}
            </motion.span>
          </AnimatePresence>
        </div>
        <a href={pdf} target="_blank" rel="noopener" className="btn btn-ghost !py-2.5">
          Download PDF
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M12 4v12M6 10l6 6 6-6M4 20h16" /></svg>
        </a>
      </div>

      <div className="relative mx-auto mt-4 h-px max-w-6xl bg-white/10">
        <motion.div className="absolute inset-y-0 left-0 bg-signal" animate={{ width: `${((index + 1) / pages.length) * 100}%` }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} />
      </div>

      <div className="mx-auto mt-6 flex max-w-6xl gap-3 overflow-x-auto pb-4 [scrollbar-width:thin]">
        {pages.map((p, i) => (
          <button
            key={p.src}
            type="button"
            onClick={() => go(i)}
            aria-label={`Go to page ${i + 1}: ${p.title}`}
            aria-current={i === index}
            className="relative aspect-video w-32 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white md:w-36"
          >
            <img src={p.thumb} alt="" loading="lazy" className={`h-full w-full object-cover transition duration-500 ${i === index ? 'opacity-100' : 'opacity-40 hover:opacity-80'}`} />
            {i === index && <motion.span layoutId="thumb-ring" className="absolute inset-0 rounded-lg ring-2 ring-inset ring-signal" />}
          </button>
        ))}
      </div>
    </div>
  );
}
