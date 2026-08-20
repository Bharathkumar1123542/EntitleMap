import React from 'react';
import { Card } from '../ui/Card';

const problems = [
  {
    id: 'discovery',
    number: '01',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="14" stroke="var(--kinpaku-gold)" strokeWidth="1.2"/>
        <path d="M16 8v8l5 3" stroke="var(--kinpaku-gold)" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="16" cy="16" r="2" fill="var(--kinpaku-gold)"/>
      </svg>
    ),
    title: 'Discovery Failure',
    body: 'Scheme information is scattered across hundreds of government PDFs, portals, and notices — each with different formats. Citizens don\'t know what they don\'t know.',
    accent: 'gold',
  },
  {
    id: 'interpretation',
    number: '02',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect x="4" y="6" width="24" height="20" rx="2" stroke="var(--verdigris-patina)" strokeWidth="1.2"/>
        <path d="M9 12h14M9 16h10M9 20h6" stroke="var(--verdigris-patina)" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="25" cy="7" r="4" fill="var(--vermilion-warning)" opacity="0.9"/>
        <path d="M25 5v2m0 2h.01" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Interpretation Failure',
    body: 'Eligibility criteria are written in bureaucratic and legal language — income slabs, caste categories, land thresholds — that ordinary citizens cannot map onto their own lives.',
    accent: 'patina',
  },
  {
    id: 'pull',
    number: '03',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M16 4v16M8 12l8 8 8-8" stroke="var(--champagne)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="6" y="24" width="20" height="4" rx="1" fill="var(--graphite-2)"/>
      </svg>
    ),
    title: 'Pull-Only Tooling',
    body: 'Every existing portal, chatbot, or RTI tool requires citizens to already know what to ask. None of them work the other way — starting from the citizen and proactively surfacing entitlements.',
    accent: 'muted',
  },
];

/**
 * Problem — three-column bento tiles explaining the structural gap.
 * Uses a numbered eyebrow per tile for clarity.
 */
export const Problem: React.FC = () => {
  return (
    <section
      id="problem"
      aria-labelledby="problem-heading"
      className="section"
      style={{ background: 'var(--lacquer-deep)' }}
    >
      <div className="container">
        {/* Section header */}
        <div style={{ marginBottom: 'var(--space-2xl)', maxWidth: '640px' }}>
          <p className="eyebrow" style={{ marginBottom: 'var(--space-xs)' }}>
            The Problem
          </p>
          <h2 id="problem-heading" style={{ marginBottom: 'var(--space-sm)' }}>
            A structural, invisible gap
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--type-18)' }}>
            Citizens in India are entitled to a wide range of welfare schemes — but a large
            share of eligible citizens never claim them. Three compounding failures cause this gap.
          </p>
        </div>

        {/* Bento grid */}
        <div
          style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap:                 'var(--space-sm)',
          }}
        >
          {problems.map((p, i) => (
            <Card
              key={p.id}
              hover
              glow={p.accent === 'gold' ? 'gold' : p.accent === 'patina' ? 'patina' : 'none'}
              style={{
                animationDelay: `${i * 100}ms`,
              }}
            >
              {/* Tile number */}
              <span
                style={{
                  fontFamily:    'var(--font-mono)',
                  fontSize:      'var(--type-10)',
                  letterSpacing: '0.2em',
                  color:         p.accent === 'gold' ? 'var(--kinpaku-deep)' : 'var(--text-faint)',
                  display:       'block',
                  marginBottom:  'var(--space-md)',
                }}
              >
                {p.number}
              </span>

              {/* Icon */}
              <div style={{ marginBottom: 'var(--space-sm)' }}>
                {p.icon}
              </div>

              {/* Title */}
              <h3
                style={{
                  fontSize:     'var(--type-20)',
                  marginBottom: 'var(--space-xs)',
                  color:        p.accent === 'gold' ? 'var(--kinpaku-gold)' : 'var(--champagne)',
                }}
              >
                {p.title}
              </h3>

              {/* Body */}
              <p style={{ fontSize: 'var(--type-14)', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                {p.body}
              </p>
            </Card>
          ))}
        </div>

        {/* Callout quote */}
        <div
          style={{
            marginTop:    'var(--space-2xl)',
            padding:      'var(--space-md) var(--space-lg)',
            borderLeft:   '3px solid var(--kinpaku-gold)',
            background:   'oklch(84% 0.19 80.46 / 0.04)',
            borderRadius: '0 var(--radius-md) var(--radius-md) 0',
          }}
        >
          <p
            style={{
              fontSize:    'var(--type-20)',
              fontWeight:  300,
              color:       'var(--champagne)',
              fontStyle:   'italic',
              lineHeight:  1.5,
              maxWidth:    'none',
            }}
          >
            "The result is a structural, invisible gap between entitlement and claim —{' '}
            <strong style={{ fontStyle: 'normal' }}>citizens don't know what they don't know.</strong>"
          </p>
        </div>
      </div>
    </section>
  );
};

export default Problem;
