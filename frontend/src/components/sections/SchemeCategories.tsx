import React from 'react';
import { Badge } from '../ui/Badge';

const categories = [
  {
    id: 'income',
    label: 'Income Support',
    count: 7,
    color: 'var(--kinpaku-gold)',
    bg: 'oklch(84% 0.19 80.46 / 0.08)',
    border: 'var(--gold-hairline-strong)',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <circle cx="18" cy="18" r="16" stroke="var(--kinpaku-gold)" strokeWidth="1.2"/>
        <path d="M18 10v2m0 12v2m-4-7h8M14 14h4a2 2 0 010 4H16a2 2 0 000 4h4"
          stroke="var(--kinpaku-gold)" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    schemes: ['PM Kisan', 'MGNREGS', 'NFSA Food Subsidy'],
  },
  {
    id: 'pension',
    label: 'Pension & Social Security',
    count: 5,
    color: 'var(--verdigris-patina)',
    bg: 'oklch(70% 0.12 188 / 0.08)',
    border: 'var(--patina-rule)',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <circle cx="18" cy="14" r="6" stroke="var(--verdigris-patina)" strokeWidth="1.2"/>
        <path d="M8 30c0-5.523 4.477-10 10-10s10 4.477 10 10"
          stroke="var(--verdigris-patina)" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M22 26l2 2 4-4" stroke="var(--kinpaku-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    schemes: ['IGNOAPS', 'IGNWPS', 'IGNDPS'],
  },
  {
    id: 'agriculture',
    label: 'Agriculture',
    count: 5,
    color: 'oklch(65% 0.14 135)',
    bg: 'oklch(65% 0.14 135 / 0.08)',
    border: 'oklch(65% 0.14 135 / 0.4)',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <path d="M18 28V16c0-6 8-10 12-6-2 4-6 6-12 8z" stroke="oklch(65% 0.14 135)" strokeWidth="1.2" fill="none"/>
        <path d="M18 28V18c0-6-8-8-12-4 2 4 6 8 12 10z" stroke="oklch(65% 0.14 135)" strokeWidth="1.2" fill="none"/>
        <line x1="18" y1="28" x2="18" y2="32" stroke="oklch(65% 0.14 135)" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    schemes: ['Fasal Bima', 'KCC', 'Soil Health Card'],
  },
  {
    id: 'housing',
    label: 'Housing',
    count: 3,
    color: 'oklch(72% 0.12 55)',
    bg: 'oklch(72% 0.12 55 / 0.08)',
    border: 'oklch(72% 0.12 55 / 0.4)',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <path d="M6 18L18 6l12 12" stroke="oklch(72% 0.12 55)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 15v13h6v-7h6v7h6V15" stroke="oklch(72% 0.12 55)" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
    schemes: ['PMAY-Gramin', 'PMAY-Urban', 'Rajiv Awas'],
  },
  {
    id: 'disability',
    label: 'Disability & Health',
    count: 4,
    color: 'oklch(70% 0.10 300)',
    bg: 'oklch(70% 0.10 300 / 0.08)',
    border: 'oklch(70% 0.10 300 / 0.4)',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <circle cx="18" cy="8" r="3" stroke="oklch(70% 0.10 300)" strokeWidth="1.2"/>
        <path d="M18 12v8l-4 8h10" stroke="oklch(70% 0.10 300)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="24" cy="28" r="4" stroke="oklch(70% 0.10 300)" strokeWidth="1.2"/>
      </svg>
    ),
    schemes: ['UDID Card', 'NHFDC Loan', 'Assistance to Disabled'],
  },
  {
    id: 'education',
    label: 'Education',
    count: 4,
    color: 'oklch(75% 0.08 240)',
    bg: 'oklch(75% 0.08 240 / 0.08)',
    border: 'oklch(75% 0.08 240 / 0.4)',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <path d="M18 8L4 16l14 8 14-8-14-8z" stroke="oklch(75% 0.08 240)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 19.5v7c0 2 4.5 3.5 10 3.5s10-1.5 10-3.5v-7" stroke="oklch(75% 0.08 240)" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
    schemes: ['National Scholarship', 'Pre-Matric SC/ST', 'Eklavya Schools'],
  },
];

/**
 * SchemeCategories — icon grid showing all 6 scheme categories with counts.
 * Hover reveals sample scheme names.
 */
export const SchemeCategories: React.FC = () => {
  const [hovered, setHovered] = React.useState<string | null>(null);

  return (
    <section
      id="schemes"
      aria-labelledby="schemes-heading"
      className="section"
      style={{ background: 'var(--lacquer-deep)' }}
    >
      <div className="container">
        <div style={{ marginBottom: 'var(--space-2xl)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
          <div>
            <p className="eyebrow" style={{ marginBottom: 'var(--space-xs)' }}>Scheme Knowledge Base</p>
            <h2 id="schemes-heading">
              25+ verified schemes across 6 categories
            </h2>
          </div>
          <Badge variant="patina" dot>Live — Updated</Badge>
        </div>

        <div
          style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap:                 'var(--space-sm)',
          }}
        >
          {categories.map((cat) => {
            const isHovered = hovered === cat.id;
            return (
              <div
                key={cat.id}
                role="article"
                aria-label={`${cat.label}: ${cat.count} schemes`}
                onMouseEnter={() => setHovered(cat.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background:    cat.bg,
                  border:        `1px solid ${isHovered ? cat.border : 'var(--gold-hairline)'}`,
                  borderRadius:  'var(--radius-md)',
                  padding:       'var(--space-md)',
                  cursor:        'default',
                  transition:    'all var(--duration-base) var(--ease)',
                  transform:     isHovered ? 'translateY(-3px)' : 'none',
                }}
              >
                {/* Icon + count */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-sm)' }}>
                  {cat.icon}
                  <span
                    style={{
                      fontFamily:  'var(--font-display)',
                      fontSize:    'var(--type-40)',
                      fontWeight:  100,
                      color:       cat.color,
                      lineHeight:  1,
                      opacity:     0.5,
                    }}
                  >
                    {cat.count}
                  </span>
                </div>

                {/* Label */}
                <h3
                  style={{
                    fontSize:     'var(--type-16)',
                    color:        'var(--champagne)',
                    marginBottom: isHovered ? 'var(--space-xs)' : 0,
                    transition:   'margin var(--duration-fast) var(--ease)',
                  }}
                >
                  {cat.label}
                </h3>

                {/* Example schemes on hover */}
                <div
                  style={{
                    overflow:   'hidden',
                    maxHeight:  isHovered ? '80px' : 0,
                    opacity:    isHovered ? 1 : 0,
                    transition: 'all var(--duration-base) var(--ease)',
                  }}
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', paddingTop: '8px' }}>
                    {cat.schemes.map((s) => (
                      <span
                        key={s}
                        style={{
                          fontFamily:    'var(--font-mono)',
                          fontSize:      'var(--type-10)',
                          letterSpacing: '0.05em',
                          color:         'var(--text-muted)',
                          background:    'var(--graphite)',
                          padding:       '2px 8px',
                          borderRadius:  'var(--radius-pill)',
                        }}
                      >
                        {s}
                      </span>
                    ))}
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize:   'var(--type-10)',
                        color:      cat.color,
                        padding:    '2px 8px',
                      }}
                    >
                      +{cat.count - cat.schemes.length} more
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Extensibility note */}
        <div
          style={{
            marginTop:    'var(--space-xl)',
            display:      'flex',
            alignItems:   'center',
            gap:          'var(--space-sm)',
            padding:      'var(--space-sm) var(--space-md)',
            background:   'var(--raised-lacquer)',
            borderRadius: 'var(--radius-md)',
            border:       '1px solid var(--gold-hairline)',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M10 2v4m0 12v-4m8-4h-4M2 10h4m10.24-5.66-2.83 2.83M5.66 15.66l2.83-2.83m0-5.66L5.66 4.34M14.34 15.66l-2.83-2.83"
              stroke="var(--patina-text)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <p style={{ fontSize: 'var(--type-13)', color: 'var(--text-muted)', margin: 0 }}>
            <strong style={{ color: 'var(--patina-text)' }}>Designed to scale:</strong>{' '}
            The ingestion pipeline converts any government scheme PDF into a verified eligibility rule in minutes — with human review before publish. Path to 500+ schemes without re-architecture.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SchemeCategories;
