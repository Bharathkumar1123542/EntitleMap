import React, { useEffect, useRef, useState } from 'react';

const steps = [
  {
    id: 1,
    icon: '💬',
    iconSvg: (active: boolean) => (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M4 6a2 2 0 012-2h16a2 2 0 012 2v12a2 2 0 01-2 2H8l-4 4V6z"
          stroke={active ? 'var(--kinpaku-gold)' : 'var(--text-faint)'}
          strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
        <path d="M9 10h10M9 14h6" stroke={active ? 'var(--kinpaku-gold)' : 'var(--text-faint)'}
          strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Message EntitleMap',
    description: 'Scan a QR code at a CSC centre or message the WhatsApp number directly. Choose your language — Hindi, Marathi, Tamil, Telugu, or English.',
    eyebrow: 'Step 01',
  },
  {
    id: 2,
    icon: '📋',
    iconSvg: (active: boolean) => (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="4" y="3" width="20" height="22" rx="2"
          stroke={active ? 'var(--kinpaku-gold)' : 'var(--text-faint)'} strokeWidth="1.5"/>
        <path d="M9 10h10M9 14h8M9 18h5"
          stroke={active ? 'var(--kinpaku-gold)' : 'var(--text-faint)'}
          strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="21" cy="21" r="5" fill={active ? 'var(--verdigris-patina)' : 'var(--graphite)'}/>
        <path d="M19 21l1.5 1.5L23 19"
          stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Build Your Profile',
    description: 'Answer 8–10 plain-language questions — age, location, occupation, income, caste category, disability status. No Aadhaar. No bank details. No government ID.',
    eyebrow: 'Step 02',
  },
  {
    id: 3,
    icon: '⚡',
    iconSvg: (active: boolean) => (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M15 3L5 16h8l-1 9 10-13h-8l1-9z"
          stroke={active ? 'var(--kinpaku-gold)' : 'var(--text-faint)'}
          strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Instant Eligibility Match',
    description: 'Our deterministic rules engine checks your profile against 25+ verified government schemes in milliseconds — no LLM guessing, 100% reproducible results.',
    eyebrow: 'Step 03',
  },
  {
    id: 4,
    icon: '✅',
    iconSvg: (active: boolean) => (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <circle cx="14" cy="14" r="11"
          stroke={active ? 'var(--kinpaku-gold)' : 'var(--text-faint)'} strokeWidth="1.5"/>
        <path d="M9 14l3.5 3.5L19 10"
          stroke={active ? 'var(--kinpaku-gold)' : 'var(--text-faint)'}
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Confirm What You Haven\'t Claimed',
    description: 'For each matched scheme, one quick yes/no: "Are you already receiving this?" Filter out what you already have. Focus on the real gaps.',
    eyebrow: 'Step 04',
  },
  {
    id: 5,
    icon: '📄',
    iconSvg: (active: boolean) => (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M6 4h12l6 6v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z"
          stroke={active ? 'var(--kinpaku-gold)' : 'var(--text-faint)'} strokeWidth="1.5" fill="none"/>
        <path d="M18 4v6h6M10 13h8M10 17h6"
          stroke={active ? 'var(--kinpaku-gold)' : 'var(--text-faint)'}
          strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Receive Your Application Package',
    description: 'Get a plain-language summary of each entitlement, a document checklist, and a pre-filled PDF application — ready to review and submit to the issuing department.',
    eyebrow: 'Step 05',
  },
];

/**
 * HowItWorks — animated vertical step flow with an intersection observer.
 * Each step activates as it enters the viewport.
 */
export const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = stepRefs.current.indexOf(entry.target as HTMLDivElement);
            if (idx !== -1) setActiveStep(idx);
          }
        });
      },
      { threshold: 0.6 }
    );
    stepRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="how-it-works"
      aria-labelledby="hiw-heading"
      className="section"
    >
      <div className="container">
        <div style={{ marginBottom: 'var(--space-2xl)', maxWidth: '540px' }}>
          <p className="eyebrow" style={{ marginBottom: 'var(--space-xs)' }}>How It Works</p>
          <h2 id="hiw-heading" style={{ marginBottom: 'var(--space-sm)' }}>
            Five turns. Your entitlement map.
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--type-16)' }}>
            The entire flow — from a WhatsApp message to a ready-to-submit PDF application —
            takes under 15 seconds once your profile is complete.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2xl)', alignItems: 'flex-start' }}>

          {/* Steps */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0 }}>
            {steps.map((step, i) => {
              const isActive = activeStep >= i;
              const isCurrent = activeStep === i;

              return (
                <div
                  key={step.id}
                  ref={(el) => { stepRefs.current[i] = el; }}
                  style={{
                    display:   'flex',
                    gap:       'var(--space-md)',
                    position:  'relative',
                    paddingBottom: i < steps.length - 1 ? 'var(--space-xl)' : 0,
                  }}
                >
                  {/* Timeline line */}
                  {i < steps.length - 1 && (
                    <div
                      aria-hidden="true"
                      style={{
                        position:  'absolute',
                        left:      '19px',
                        top:       '40px',
                        bottom:    0,
                        width:     '1px',
                        background: isActive
                          ? 'linear-gradient(to bottom, var(--kinpaku-gold), var(--kinpaku-deep))'
                          : 'var(--gold-hairline)',
                        transition: 'background var(--duration-slow) var(--ease)',
                      }}
                    />
                  )}

                  {/* Node */}
                  <div
                    style={{
                      width:          '40px',
                      height:         '40px',
                      borderRadius:   '50%',
                      border:         `1px solid ${isActive ? 'var(--kinpaku-gold)' : 'var(--gold-hairline)'}`,
                      background:     isActive ? 'oklch(84% 0.19 80.46 / 0.12)' : 'var(--raised-lacquer)',
                      display:        'flex',
                      alignItems:     'center',
                      justifyContent: 'center',
                      flexShrink:     0,
                      boxShadow:      isCurrent ? 'var(--shadow-gold)' : 'none',
                      transition:     'all var(--duration-slow) var(--ease)',
                      animation:      isCurrent ? 'gold-pulse 2.5s ease-in-out infinite' : 'none',
                    }}
                  >
                    {step.iconSvg(isActive)}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, paddingTop: '6px' }}>
                    <span
                      style={{
                        fontFamily:    'var(--font-mono)',
                        fontSize:      'var(--type-10)',
                        letterSpacing: '0.2em',
                        color:         isActive ? 'var(--kinpaku-deep)' : 'var(--text-faint)',
                        display:       'block',
                        marginBottom:  '4px',
                        transition:    'color var(--duration-base) var(--ease)',
                      }}
                    >
                      {step.eyebrow}
                    </span>
                    <h3
                      style={{
                        fontSize:     'var(--type-18)',
                        marginBottom: '6px',
                        color:        isActive ? 'var(--champagne)' : 'var(--text-faint)',
                        transition:   'color var(--duration-base) var(--ease)',
                      }}
                    >
                      {step.title}
                    </h3>
                    <p
                      style={{
                        fontSize:   'var(--type-14)',
                        color:      isActive ? 'var(--text-muted)' : 'var(--text-faint)',
                        lineHeight: 1.7,
                        transition: 'color var(--duration-base) var(--ease)',
                      }}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right panel — timing callout */}
          <div
            style={{
              width:    '280px',
              flexShrink: 0,
              position: 'sticky',
              top:      '100px',
            }}
            className="hiw-side-panel"
          >
            <div
              style={{
                background:   'var(--raised-lacquer)',
                border:       '1px solid var(--gold-hairline-strong)',
                borderRadius: 'var(--radius-md)',
                padding:      'var(--space-md)',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize:   'var(--type-10)',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color:      'var(--text-faint)',
                  marginBottom: 'var(--space-xs)',
                }}
              >
                End-to-end latency
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize:   'var(--type-48)',
                  fontWeight: 100,
                  color:      'var(--kinpaku-gold)',
                  lineHeight: 1,
                  marginBottom: '4px',
                }}
              >
                &lt;15s
              </p>
              <p style={{ fontSize: 'var(--type-13)', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                From profile complete to documents delivered on WhatsApp
              </p>

              <div style={{ margin: 'var(--space-md) 0', height: '1px', background: 'var(--gold-hairline)' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                {[
                  { label: 'Conversational turn', value: '<3s' },
                  { label: 'Eligibility match', value: '<100ms' },
                  { label: 'PDF generation', value: '3–5s' },
                ].map((item) => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: 'var(--type-12)', color: 'var(--text-muted)' }}>{item.label}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--type-12)', color: 'var(--patina-text)' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hiw-side-panel { display: none !important; }
        }
      `}</style>
    </section>
  );
};

export default HowItWorks;
