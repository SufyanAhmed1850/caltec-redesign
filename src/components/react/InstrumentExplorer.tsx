import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { useMemo, useState } from 'react';

type Props = { instruments: string[]; service: string };

export default function InstrumentExplorer({ instruments, service }: Props) {
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return term ? instruments.filter((i) => i.toLowerCase().includes(term)) : instruments;
  }, [q, instruments]);

  const toggle = (name: string) => setSelected((s) => (s.includes(name) ? s.filter((x) => x !== name) : [...s, name]));

  const enquiryHref = `/enquiry/?service=${encodeURIComponent(service)}${selected.length ? `&instruments=${encodeURIComponent(selected.join('; '))}` : ''}`;

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <label className="relative block w-full md:max-w-md">
          <span className="sr-only">Search instruments</span>
          <svg className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${instruments.length} instruments…`}
            className="w-full rounded-full border border-white/15 bg-white/[0.03] py-4 pl-12 pr-5 text-[15px] outline-none transition placeholder:text-mute focus:border-paper/60"
          />
        </label>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-mute" aria-live="polite">
          <motion.span key={filtered.length} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="inline-block tabular-nums text-paper">
            {String(filtered.length).padStart(2, '0')}
          </motion.span>{' '}
          / {instruments.length} shown · tap to add to enquiry
        </p>
      </div>

      <LayoutGroup>
        <motion.ul layout className="mt-8 flex flex-wrap gap-2.5">
          <AnimatePresence mode="popLayout">
            {filtered.map((name, i) => {
              const on = selected.includes(name);
              return (
                <motion.li
                  layout
                  key={name}
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0, transition: { delay: Math.min(i * 0.01, 0.3), type: 'spring', stiffness: 380, damping: 28 } }}
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
                >
                  <button
                    type="button"
                    onClick={() => toggle(name)}
                    aria-pressed={on}
                    className={`group flex items-center gap-2 rounded-full border px-4 py-2.5 text-[14px] transition-colors duration-300 ${
                      on ? 'border-signal bg-signal text-white' : 'border-white/12 bg-white/[0.02] text-paper/80 hover:border-white/40 hover:text-paper'
                    }`}
                  >
                    <motion.span
                      className={`grid h-4 w-4 place-items-center rounded-full border ${on ? 'border-white bg-white text-signal' : 'border-white/30'}`}
                      animate={{ rotate: on ? 0 : -90 }}
                    >
                      {on && (
                        <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                          <path d="M4 12.5 9 17.5 20 6.5" />
                        </svg>
                      )}
                    </motion.span>
                    {name}
                  </button>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </motion.ul>
      </LayoutGroup>

      {filtered.length === 0 && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 text-paper/60">
          Not listed? We probably still calibrate it —{' '}
          <a href={enquiryHref} className="underline decoration-signal underline-offset-4">
            ask us about “{q}”
          </a>
          .
        </motion.p>
      )}

      <AnimatePresence>
        {selected.length > 0 && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className="fixed inset-x-4 bottom-4 z-[100] mx-auto flex max-w-xl items-center justify-between gap-4 rounded-full border border-white/15 bg-ink/85 py-2 pl-6 pr-2 shadow-2xl backdrop-blur-xl"
          >
            <p className="text-sm">
              <motion.span key={selected.length} initial={{ scale: 1.6 }} animate={{ scale: 1 }} className="mr-1 inline-block font-mono text-signal">
                {selected.length}
              </motion.span>{' '}
              instrument{selected.length > 1 ? 's' : ''} selected
            </p>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setSelected([])} className="px-3 py-2 text-sm text-mute hover:text-paper">
                Clear
              </button>
              <a href={enquiryHref} data-label="Enquiry" className="btn btn-primary !py-2.5">
                Request quote
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
