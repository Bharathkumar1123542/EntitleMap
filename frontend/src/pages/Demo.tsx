import React from 'react';
import { ChatWindow } from '../components/chat/ChatWindow';
import { Badge } from '../components/ui/Badge';
import { DEMO_CITIZEN_PROFILE } from '../data/mock_schemes';

/**
 * Demo page — full-page conversational demo section.
 * Two-column layout: left panel shows the citizen persona,
 * right panel shows the live chat simulator.
 */
const Demo: React.FC = () => {
  const profileFields = [
    { label: 'Age',         value: `${DEMO_CITIZEN_PROFILE.age} years` },
    { label: 'State',       value: DEMO_CITIZEN_PROFILE.state },
    { label: 'District',    value: DEMO_CITIZEN_PROFILE.district },
    { label: 'Occupation',  value: 'Farmer' },
    { label: 'Income',      value: '< ₹1 lakh/year (BPL)' },
    { label: 'Category',    value: 'SC' },
    { label: 'Disability',  value: '45% (benchmark)' },
    { label: 'Land Owned',  value: `${DEMO_CITIZEN_PROFILE.land_owned_acres} acres` },
    { label: 'Family Size', value: `${DEMO_CITIZEN_PROFILE.family_size} members` },
  ];

  return (
    <section
      id="demo"
      aria-labelledby="demo-heading"
      className="section"
      style={{
        background: 'var(--lacquer-black)',
        position:   'relative',
        overflow:   'hidden',
      }}
    >
      {/* Background accent */}
      <div
        aria-hidden="true"
        style={{
          position:   'absolute',
          top:        '10%',
          right:      '-5%',
          width:      '500px',
          height:     '500px',
          background: 'radial-gradient(ellipse, oklch(70% 0.12 188 / 0.05) 0%, transparent 70%)',
          filter:     'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: 'var(--space-2xl)', maxWidth: '640px' }}>
          <p className="eyebrow" style={{ marginBottom: 'var(--space-xs)' }}>Live Demo</p>
          <h2 id="demo-heading" style={{ marginBottom: 'var(--space-sm)' }}>
            See the "push not pull" moment
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--type-16)' }}>
            Below is a real demonstration of EntitleMap — a scripted citizen profile walks through
            the full conversation flow. Schemes surface{' '}
            <strong>without the citizen asking for any of them by name.</strong>
          </p>
        </div>

        {/* Two-column layout */}
        <div
          style={{
            display:             'grid',
            gridTemplateColumns: '1fr 1.6fr',
            gap:                 'var(--space-xl)',
            alignItems:          'flex-start',
          }}
          className="demo-grid"
        >
          {/* Left: Citizen persona card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            <div
              style={{
                background:   'var(--raised-lacquer)',
                border:       '1px solid var(--gold-hairline-strong)',
                borderRadius: 'var(--radius-md)',
                padding:      'var(--space-md)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', marginBottom: 'var(--space-md)' }}>
                <div
                  style={{
                    width:          '48px',
                    height:         '48px',
                    borderRadius:   '50%',
                    background:     'var(--graphite)',
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    fontSize:       '24px',
                  }}
                  aria-hidden="true"
                >
                  👨‍🌾
                </div>
                <div>
                  <p style={{ fontSize: 'var(--type-16)', fontWeight: 600, color: 'var(--champagne)', lineHeight: 1.2 }}>
                    Demo Citizen
                  </p>
                  <p style={{ fontSize: 'var(--type-12)', color: 'var(--text-muted)' }}>
                    Barmer, Rajasthan
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {profileFields.map((field) => (
                  <div
                    key={field.label}
                    style={{
                      display:        'flex',
                      justifyContent: 'space-between',
                      alignItems:     'baseline',
                      padding:        '5px 0',
                      borderBottom:   '1px solid var(--gold-hairline)',
                    }}
                  >
                    <span style={{ fontSize: 'var(--type-12)', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
                      {field.label}
                    </span>
                    <span style={{ fontSize: 'var(--type-13)', color: 'var(--text-warm)', textAlign: 'right' }}>
                      {field.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Result summary */}
            <div
              style={{
                background:   'oklch(70% 0.12 188 / 0.06)',
                border:       '1px solid var(--patina-rule)',
                borderRadius: 'var(--radius-md)',
                padding:      'var(--space-sm)',
              }}
            >
              <p style={{ fontSize: 'var(--type-12)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--patina-text)', marginBottom: '8px' }}>
                Demo Result
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  { label: '4 schemes matched',              color: 'var(--kinpaku-gold)' },
                  { label: '1 already claiming → filtered', color: 'var(--text-muted)' },
                  { label: '3 new entitlements surfaced',    color: 'var(--verdigris-patina)' },
                  { label: '3 PDFs generated',              color: 'var(--champagne)' },
                ].map((item) => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: item.color, flexShrink: 0 }} aria-hidden="true" />
                    <span style={{ fontSize: 'var(--type-13)', color: item.color }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <p
              style={{
                fontSize:   'var(--type-11)',
                color:      'var(--text-faint)',
                lineHeight: 1.5,
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.02em',
              }}
            >
              ⚠ All data is self-declared and for demo purposes only. Eligibility is based on publicly available scheme rules. Verify with the issuing department before submitting.
            </p>
          </div>

          {/* Right: Chat simulator */}
          <div>
            <ChatWindow />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .demo-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Demo;
