import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef, useState, type PointerEvent } from 'react';

export type Cert = { code: string; year: string; area: string; title: string; thumb: string; full: string };

function TiltCard({ cert, onOpen, index }: { cert: Cert; onOpen: () => void; index: number }) {
  const ref = useRef<HTMLButtonElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [10, -10]), { stiffness: 180, damping: 18 });
  const ry = useSpring(useTransform(mx, [0, 1], [-12, 12]), { stiffness: 180, damping: 18 });
  const glareX = useTransform(mx, [0, 1], ['0%', '100%']);
  const glareY = useTransform(my, [0, 1], ['0%', '100%']);
  const glare = useTransform([glareX, glareY], ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,.35), transparent 55%)`);

  const onMove = (e: PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: index * 0.12 }}
      style={{ perspective: 1200 }}
    >
      <motion.button
        ref={ref}
        type="button"
        data-cursor="Inspect"
        onClick={onOpen}
        onPointerMove={onMove}
        onPointerLeave={reset}
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        className="group relative block w-full rounded-3xl border border-white/10 bg-ink-3/80 p-5 text-left"
        aria-label={`View ${cert.code} certificate`}
      >
        <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-mute" style={{ transform: 'translateZ(30px)' }}>
          <span>{cert.area}</span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 12.5 9 17.5 20 6.5" /></svg>
            Certified
          </span>
        </div>
        <motion.div layoutId={`cert-${cert.code}`} className="relative mt-5 aspect-[3/4] overflow-hidden rounded-xl bg-white" style={{ transform: 'translateZ(50px)' }}>
          <img src={cert.thumb} alt={`${cert.code} certificate issued to CALTEC`} loading="lazy" className="h-full w-full object-cover object-top" />
          <motion.div className="pointer-events-none absolute inset-0 mix-blend-overlay" style={{ background: glare }} />
        </motion.div>
        <div className="mt-6 flex items-end justify-between" style={{ transform: 'translateZ(40px)' }}>
          <div>
            <p className="text-3xl font-medium tracking-[-0.03em]">{cert.code}</p>
            <p className="mt-1 text-sm text-paper/60">{cert.title}</p>
          </div>
          <span className="font-mono text-xs text-mute">:{cert.year}</span>
        </div>
      </motion.button>
    </motion.div>
  );
}

export default function CertGallery({ certs }: { certs: Cert[] }) {
  const [open, setOpen] = useState<Cert | null>(null);

  useEffect(() => {
    if (open) window.lenis?.stop();
    else window.lenis?.start();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <div className="grid gap-6 md:grid-cols-3">
        {certs.map((c, i) => (
          <TiltCard key={c.code} cert={c} index={i} onOpen={() => setOpen(c)} />
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[130] flex items-center justify-center p-4 md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={`${open.code} certificate`}
          >
            <motion.button
              type="button"
              aria-label="Close"
              className="absolute inset-0 bg-ink/90 backdrop-blur-md"
              onClick={() => setOpen(null)}
            />
            <motion.div layoutId={`cert-${open.code}`} className="relative z-10 h-full max-h-[90vh] overflow-hidden rounded-xl bg-white shadow-2xl" style={{ aspectRatio: '1275 / 1650' }}>
              <img src={open.full} alt={`${open.code} certificate issued to CALTEC`} className="h-full w-full object-contain" />
            </motion.div>
            <motion.div
              className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/15 bg-ink/80 py-2 pl-5 pr-2 backdrop-blur"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-sm">{open.code} · {open.title}</span>
              <button type="button" onClick={() => setOpen(null)} className="rounded-full bg-paper px-4 py-1.5 text-sm text-ink">
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
