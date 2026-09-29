import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState, type FormEvent, type ReactNode } from 'react';

type Props = { services: string[]; email: string; whatsapp: string };

type Data = {
  services: string[];
  instruments: string;
  location: 'On site' | 'CALTEC workshop' | 'Not sure';
  timing: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  city: string;
  message: string;
};

const steps = ['Scope', 'Logistics', 'Contact', 'Review'];
const ease = [0.16, 1, 0.3, 1] as const;

function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="group block">
      <span className="mb-2 flex justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-mute">
        {label}
        {hint && <span className="normal-case tracking-normal">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

const input =
  'w-full border-b border-white/20 bg-transparent py-3 text-xl outline-none transition-colors placeholder:text-white/25 focus:border-signal md:text-2xl';

export default function EnquiryForm({ services, email, whatsapp }: Props) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [error, setError] = useState('');
  const [sent, setSent] = useState<null | 'email' | 'whatsapp'>(null);
  const [d, setD] = useState<Data>({
    services: [],
    instruments: '',
    location: 'On site',
    timing: 'Within 2 weeks',
    name: '',
    company: '',
    email: '',
    phone: '',
    city: 'Karachi',
    message: '',
  });

  useEffect(() => {
    const p = new URLSearchParams(location.search);
    const svc = p.get('service');
    const inst = p.get('instruments');
    setD((prev) => ({
      ...prev,
      services: svc ? services.filter((s) => s.toLowerCase() === svc.toLowerCase()).concat() : prev.services,
      instruments: inst ? inst.split('; ').join('\n') : prev.instruments,
    }));
  }, [services]);

  const set = <K extends keyof Data>(k: K, v: Data[K]) => setD((p) => ({ ...p, [k]: v }));
  const toggleSvc = (s: string) => set('services', d.services.includes(s) ? d.services.filter((x) => x !== s) : [...d.services, s]);

  const validate = (): string => {
    if (step === 0 && !d.services.length) return 'Choose at least one discipline.';
    if (step === 2) {
      if (!d.name.trim()) return 'Please tell us your name.';
      if (!/^\S+@\S+\.\S+$/.test(d.email) && d.phone.replace(/\D/g, '').length < 7) return 'Add an email address or phone number so we can reply.';
    }
    return '';
  };

  const next = (e?: FormEvent) => {
    e?.preventDefault();
    const err = validate();
    setError(err);
    if (err) return;
    setDir(1);
    setStep((s) => Math.min(steps.length - 1, s + 1));
  };
  const back = () => {
    setError('');
    setDir(-1);
    setStep((s) => Math.max(0, s - 1));
  };

  const summary = [
    `Calibration enquiry — ${d.company || d.name}`,
    '',
    `Disciplines: ${d.services.join(', ')}`,
    d.instruments && `Instruments:\n${d.instruments}`,
    `Where: ${d.location} (${d.city})`,
    `Timing: ${d.timing}`,
    '',
    `Name: ${d.name}`,
    d.company && `Company: ${d.company}`,
    d.email && `Email: ${d.email}`,
    d.phone && `Phone: ${d.phone}`,
    d.message && `\nNotes:\n${d.message}`,
  ]
    .filter((l) => l !== false && l !== undefined && l !== '')
    .join('\n');

  const mailto = `mailto:${email}?subject=${encodeURIComponent(`Calibration enquiry — ${d.company || d.name}`)}&body=${encodeURIComponent(summary)}`;
  const wa = `${whatsapp}?text=${encodeURIComponent(summary)}`;

  return (
    <div className="grid gap-12 lg:grid-cols-12">
      <aside className="lg:col-span-3">
        <ol className="flex gap-2 lg:flex-col lg:gap-0">
          {steps.map((s, i) => (
            <li key={s} className="flex-1 lg:flex-none">
              <button
                type="button"
                onClick={() => i < step && (setDir(-1), setStep(i))}
                disabled={i > step}
                className="flex w-full items-center gap-4 py-2 text-left lg:py-4"
              >
                <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/20 font-mono text-xs">
                  {i < step ? (
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-signal" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 12.5 9 17.5 20 6.5" /></svg>
                  ) : (
                    String(i + 1).padStart(2, '0')
                  )}
                  {i === step && <motion.span layoutId="step-ring" className="absolute inset-0 rounded-full border-2 border-signal" transition={{ duration: 0.6, ease }} />}
                </span>
                <span className={`hidden text-lg transition-colors sm:block ${i === step ? 'text-paper' : 'text-mute'}`}>{s}</span>
              </button>
            </li>
          ))}
        </ol>
      </aside>

      <form onSubmit={next} className="relative lg:col-span-9" noValidate>
        <div className="relative min-h-[460px] overflow-hidden">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              initial={{ opacity: 0, x: dir * 60, filter: 'blur(6px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: dir * -60, filter: 'blur(6px)' }}
              transition={{ duration: 0.6, ease }}
              className="space-y-10"
            >
              {step === 0 && (
                <>
                  <div>
                    <h2 className="text-3xl font-medium tracking-[-0.03em] md:text-5xl">What needs calibrating?</h2>
                    <p className="mt-3 text-paper/60">Select every discipline that applies.</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {services.map((s) => {
                      const on = d.services.includes(s);
                      return (
                        <motion.button
                          type="button"
                          key={s}
                          onClick={() => toggleSvc(s)}
                          whileTap={{ scale: 0.95 }}
                          aria-pressed={on}
                          className={`rounded-full border px-5 py-3 text-[15px] transition-colors ${on ? 'border-signal bg-signal text-white' : 'border-white/15 hover:border-white/50'}`}
                        >
                          {s}
                        </motion.button>
                      );
                    })}
                  </div>
                  <Field label="Instrument list" hint="Optional — one per line">
                    <textarea
                      rows={4}
                      value={d.instruments}
                      onChange={(e) => set('instruments', e.target.value)}
                      placeholder={'e.g. 12 × pressure gauges 0–16 bar\n4 × RTD sensors'}
                      className={`${input} resize-none !text-lg`}
                    />
                  </Field>
                </>
              )}

              {step === 1 && (
                <>
                  <h2 className="text-3xl font-medium tracking-[-0.03em] md:text-5xl">Where and when?</h2>
                  <div>
                    <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-mute">Service location</p>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {(['On site', 'CALTEC workshop', 'Not sure'] as const).map((l) => (
                        <button
                          type="button"
                          key={l}
                          onClick={() => set('location', l)}
                          aria-pressed={d.location === l}
                          className={`relative rounded-2xl border p-5 text-left transition-colors ${d.location === l ? 'border-signal' : 'border-white/15 hover:border-white/40'}`}
                        >
                          {d.location === l && <motion.span layoutId="loc" className="absolute inset-0 rounded-2xl bg-signal/10" />}
                          <span className="relative text-lg">{l}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-8 sm:grid-cols-2">
                    <Field label="City / site">
                      <input className={input} value={d.city} onChange={(e) => set('city', e.target.value)} />
                    </Field>
                    <Field label="Timing">
                      <select className={`${input} bg-ink`} value={d.timing} onChange={(e) => set('timing', e.target.value)}>
                        {['Urgent — this week', 'Within 2 weeks', 'Within a month', 'Planning ahead'].map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                    </Field>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="text-3xl font-medium tracking-[-0.03em] md:text-5xl">How do we reach you?</h2>
                  <div className="grid gap-8 sm:grid-cols-2">
                    <Field label="Your name *">
                      <input className={input} autoComplete="name" value={d.name} onChange={(e) => set('name', e.target.value)} />
                    </Field>
                    <Field label="Company">
                      <input className={input} autoComplete="organization" value={d.company} onChange={(e) => set('company', e.target.value)} />
                    </Field>
                    <Field label="Email">
                      <input className={input} type="email" autoComplete="email" value={d.email} onChange={(e) => set('email', e.target.value)} />
                    </Field>
                    <Field label="Phone">
                      <input className={input} type="tel" autoComplete="tel" value={d.phone} onChange={(e) => set('phone', e.target.value)} />
                    </Field>
                  </div>
                  <Field label="Anything else?">
                    <textarea rows={3} className={`${input} resize-none !text-lg`} value={d.message} onChange={(e) => set('message', e.target.value)} />
                  </Field>
                </>
              )}

              {step === 3 && (
                <>
                  <div>
                    <h2 className="text-3xl font-medium tracking-[-0.03em] md:text-5xl">Ready to send.</h2>
                    <p className="mt-3 text-paper/60">Choose how you’d like to send it — we’ll reply within one working day.</p>
                  </div>
                  <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-2xl border border-white/10 bg-white/[0.03] p-6 font-mono text-[13px] leading-relaxed text-paper/80">{summary}</pre>
                  <div className="flex flex-wrap gap-3">
                    <a href={mailto} onClick={() => setSent('email')} className="btn btn-primary">
                      Send by email
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3 11 11 3M5 3h6v6" stroke="currentColor" strokeWidth="1.5" /></svg>
                    </a>
                    <a href={wa} target="_blank" rel="noopener" onClick={() => setSent('whatsapp')} className="btn btn-ghost">
                      Send on WhatsApp
                    </a>
                  </div>
                  <AnimatePresence>
                    {sent && (
                      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-paper/70">
                        Your {sent === 'email' ? 'email app' : 'WhatsApp'} should now be open with the enquiry filled in — just hit send. Nothing opened? Email{' '}
                        <a className="underline decoration-signal underline-offset-4" href={`mailto:${email}`}>{email}</a>.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {error && (
            <motion.p role="alert" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 text-signal">
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
          <button type="button" onClick={back} className={`text-mute transition hover:text-paper ${step === 0 ? 'invisible' : ''}`}>
            ← Back
          </button>
          {step < steps.length - 1 && (
            <button type="submit" className="btn btn-primary">
              Continue
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" /></svg>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
