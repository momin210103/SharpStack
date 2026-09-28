import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

/* ============================================================
   পরে এখানে বদলে নিন
   ============================================================ */
// ছবি যোগ করতে: ছবিটা `public/` ফোল্ডারে রাখুন (যেমন public/author.jpg)
// তারপর নিচে লিখুন: const AUTHOR_IMAGE = '/author.jpg';
const AUTHOR_IMAGE = '/author.png';

const AUTHOR = {
  name: 'MD. Abdul Momin Sheikh',
  role: 'Software Engineer',
  bio: [
    'Write a short introduction about yourself here: who you are, what you work on, and how many years of experience you have.',
    'Add a second paragraph about why you started SharpStack and what you hope readers will take away from it.',
  ],
  stack: ['C#', 'ASP.NET Core', 'React', 'PostgreSQL'],
};

const LINKS = [
  { label: 'GitHub', href: 'https://github.com/momin210103' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/momin210103' },
  { label: 'Email', href: 'mailto:momincse13@gmail.com' },
];

const TOPICS = [
  { title: 'ASP.NET Core', text: 'Placeholder: short description of what readers will find in this topic.' },
  { title: 'Architecture', text: 'Placeholder: patterns, design decisions, and system design write-ups.' },
  { title: 'Web API', text: 'Placeholder: building, securing, and scaling REST APIs.' },
  { title: 'Database', text: 'Placeholder: PostgreSQL, queries, migrations, and performance.' },
];

const PRINCIPLES = [
  'Real-world examples, not just theory',
  'Code you can copy, run, and adapt',
  'Only what I have actually used in practice',
];

const About = () => {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors">
      <Helmet>
        <title>About | SharpStack</title>
        <meta
          name="description"
          content="About SharpStack: a developer knowledge platform for practical .NET and software engineering insights."
        />
        <link rel="canonical" href="https://sharpstackbd.onrender.com/about" />
      </Helmet>

      {/* HERO */}
      <section className="border-b border-[var(--color-border)]">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="font-mono text-xs font-semibold tracking-widest text-[var(--color-primary)] uppercase mb-4">
            — ABOUT SHARPSTACK
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.1] mb-5 max-w-3xl">
            Practical engineering knowledge, written for developers.
          </h1>
          <p className="font-serif text-lg text-[var(--color-text-muted)] leading-relaxed max-w-2xl">
            Placeholder: one or two sentences about who SharpStack is for and what problem it
            solves for them.
          </p>
        </div>
      </section>

      {/* AUTHOR */}
      <section className="border-b border-[var(--color-border)]">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
            {/* Image slot */}
            <div className="md:col-span-4 lg:col-span-3">
              <div className="aspect-square w-full max-w-[260px] overflow-hidden rounded-[6px] border border-[var(--color-border)] bg-[var(--color-surface-secondary)]">
                {AUTHOR_IMAGE ? (
                  <img
                    src={AUTHOR_IMAGE}
                    alt={AUTHOR.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-secondary)] select-none">
                    <span className="font-serif text-6xl font-semibold text-[var(--color-primary)]">
                      {AUTHOR.name.charAt(0)}
                    </span>
                    <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--color-text-muted)]">
                      // add photo
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="md:col-span-8 lg:col-span-9">
              <div className="font-mono text-[11px] font-semibold tracking-wider text-[var(--color-primary)] uppercase mb-3">
                // THE AUTHOR
              </div>
              <h2 className="font-serif text-3xl font-semibold tracking-tight">{AUTHOR.name}</h2>
              <p className="font-mono text-xs text-[var(--color-text-muted)] mt-1 mb-5">
                {AUTHOR.role}
              </p>

              <div className="space-y-4 font-serif text-base text-[var(--color-text-muted)] leading-relaxed max-w-2xl">
                {AUTHOR.bio.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mt-6">
                {AUTHOR.stack.map((s) => (
                  <span
                    key={s}
                    className="font-mono text-[11px] px-2.5 py-1 rounded-[3px] border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT YOU'LL FIND */}
      <section className="border-b border-[var(--color-border)]">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight mb-8">
            What you'll find here
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TOPICS.map((t) => (
              <div
                key={t.title}
                className="p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[6px] hover:border-[var(--color-primary-muted)] transition-colors"
              >
                <div className="font-mono text-[11px] font-semibold tracking-wider text-[var(--color-primary)] uppercase mb-2">
                  // {t.title}
                </div>
                <p className="font-serif text-sm text-[var(--color-text-muted)] leading-relaxed">
                  {t.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRINCIPLES + BUILT WITH */}
      <section className="border-b border-[var(--color-border)]">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[6px]">
            <div className="font-mono text-[11px] font-semibold tracking-wider text-[var(--color-primary)] uppercase mb-4">
              // HOW I WRITE
            </div>
            <ul className="space-y-3">
              {PRINCIPLES.map((p) => (
                <li key={p} className="flex items-start gap-3 font-serif text-base">
                  <span className="font-mono text-[var(--color-primary)]">✓</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[6px]">
            <div className="font-mono text-[11px] font-semibold tracking-wider text-[var(--color-primary)] uppercase mb-4">
              // BUILT WITH
            </div>
            <dl className="space-y-2.5 font-mono text-xs">
              {[
                ['Frontend', 'React + Vite + Tailwind'],
                ['Backend', 'ASP.NET Core Web API'],
                ['Database', 'PostgreSQL'],
                ['Hosting', 'Render'],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]/50 last:border-0"
                >
                  <dt className="text-[var(--color-text-muted)]">{k}</dt>
                  <dd className="text-[var(--color-text)]">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* CONTACT / CTA */}
      <section>
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="font-mono text-[11px] font-semibold tracking-wider text-[var(--color-primary)] uppercase mb-3">
            // GET IN TOUCH
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight mb-3">
            Questions, feedback, or ideas?
          </h2>
          <p className="font-serif text-base text-[var(--color-text-muted)] mb-6 max-w-xl">
            Placeholder: invite readers to reach out or suggest topics they'd like to see covered.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs font-semibold px-4 py-2.5 rounded-[3px] border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-secondary)] hover:border-[var(--color-primary-muted)] text-[var(--color-text)] transition-colors"
              >
                {l.label}
              </a>
            ))}
            <Link
              to="/"
              className="font-mono text-xs font-semibold px-5 py-2.5 rounded-[3px] bg-[var(--color-primary)] hover:bg-[#7A4BC9] text-white transition-colors"
            >
              Explore Articles →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
