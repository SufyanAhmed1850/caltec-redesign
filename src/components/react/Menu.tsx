import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

type Props = {
  nav: { label: string; href: string }[];
  services: { name: string; href: string; index: string }[];
  phone: { label: string; href: string };
  email: string;
};

const ease = [0.76, 0, 0.24, 1] as const;

export default function Menu({ nav, services, phone, email }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.menu = open ? 'open' : 'closed';
    if (open) window.lenis?.stop();
    else window.lenis?.start();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const links = [{ label: 'Home', href: '/' }, ...nav, { label: 'Enquiry', href: '/enquiry/' }];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="site-menu"
        aria-label={open ? 'Close menu' : 'Open menu'}
        className="relative z-[3] flex h-11 items-center gap-3 rounded-full border border-white/15 bg-ink/40 pl-4 pr-3 text-[13px] font-medium backdrop-blur-xl transition-colors hover:border-white/40 lg:hidden"
      >
        <span className="relative h-4 overflow-hidden">
          <motion.span className="block" animate={{ y: open ? '-100%' : '0%' }} transition={{ duration: 0.5, ease }}>
            Menu
          </motion.span>
          <motion.span className="absolute left-0 top-full block" animate={{ y: open ? '-100%' : '0%' }} transition={{ duration: 0.5, ease }}>
            Close
          </motion.span>
        </span>
        <span className="relative flex h-5 w-5 flex-col items-center justify-center gap-[5px]">
          <motion.span className="h-px w-4 bg-current" animate={open ? { rotate: 45, y: 3 } : { rotate: 0, y: 0 }} transition={{ duration: 0.5, ease }} />
          <motion.span className="h-px w-4 bg-current" animate={open ? { rotate: -45, y: -3 } : { rotate: 0, y: 0 }} transition={{ duration: 0.5, ease }} />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 z-[1] flex flex-col overflow-y-auto bg-ink"
            initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            transition={{ duration: 0.9, ease }}
          >
            <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
            <div className="wrap relative flex flex-1 flex-col justify-between gap-12 pb-10 pt-28">
              <nav aria-label="Mobile" className="flex flex-col">
                {links.map((l, i) => (
                  <div key={l.href} className="overflow-hidden border-b border-white/10">
                    <motion.a
                      href={l.href}
                      data-label={l.label}
                      onClick={() => setOpen(false)}
                      className="group flex items-baseline justify-between py-3 text-[clamp(2.2rem,9vw,4.5rem)] font-medium leading-none tracking-[-0.04em]"
                      initial={{ y: '110%' }}
                      animate={{ y: '0%' }}
                      exit={{ y: '110%' }}
                      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.25 + i * 0.05 }}
                    >
                      <span className="transition-transform duration-500 group-hover:translate-x-3">{l.label}</span>
                      <span className="font-mono text-xs text-mute">{String(i).padStart(2, '0')}</span>
                    </motion.a>
                  </div>
                ))}
              </nav>

              <motion.div
                className="grid gap-8 sm:grid-cols-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <div>
                  <p className="eyebrow mb-4">Disciplines</p>
                  <ul className="flex flex-wrap gap-2">
                    {services.map((s) => (
                      <li key={s.href}>
                        <a href={s.href} onClick={() => setOpen(false)} className="inline-flex rounded-full border border-white/15 px-3 py-1.5 text-sm hover:bg-paper hover:text-ink">
                          <span className="mr-2 font-mono text-[10px] text-mute">{s.index}</span>
                          {s.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col gap-2 sm:items-end">
                  <p className="eyebrow mb-2">Talk to us</p>
                  <a href={phone.href} className="text-xl">{phone.label}</a>
                  <a href={`mailto:${email}`} className="text-xl text-paper/70">{email}</a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
