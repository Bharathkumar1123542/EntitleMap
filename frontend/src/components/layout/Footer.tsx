import React from 'react';

/**
 * Footer — brand signature with gold seam and patina edge.
 * Per DESIGN.md: "The footer can carry the strongest oxidation accent."
 */
export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        background:  'var(--lacquer-deep)',
        borderTop:   '1px solid var(--gold-hairline)',
        position:    'relative',
        overflow:    'hidden',
      }}
    >
      {/* Gold seam top */}
      <div className="gold-seam" aria-hidden="true" />

      {/* Patina edge glow */}
      <div
        aria-hidden="true"
        style={{
          position:   'absolute',
          bottom:     0,
          left:       0,
          right:      0,
          height:     '1px',
          background: 'linear-gradient(90deg, transparent, var(--patina-rule), transparent)',
        }}
      />

      <div
        className="container"
        style={{
          paddingTop:    'var(--space-2xl)',
          paddingBottom: 'var(--space-2xl)',
        }}
      >
        <div
          style={{
            display:             'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr',
            gap:                 'var(--space-xl)',
            marginBottom:        'var(--space-2xl)',
          }}
          className="footer-grid"
        >
          {/* Brand column */}
          <div style={{ gridColumn: '1 / 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--space-sm)' }}>
              <div
                aria-hidden="true"
                style={{
                  width:        '28px',
                  height:       '28px',
                  background:   `linear-gradient(135deg, var(--kinpaku-gold) 50%, var(--kinpaku-deep) 50%)`,
                  borderRadius: 'var(--radius-sm)',
                  flexShrink:   0,
                }}
              />
              <span
                style={{
                  fontFamily:    'var(--font-display)',
                  fontSize:      'var(--type-16)',
                  fontWeight:    400,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color:         'var(--champagne)',
                }}
              >
                EntitleMap
              </span>
            </div>
            <p style={{ fontSize: 'var(--type-13)', color: 'var(--text-faint)', lineHeight: 1.7, maxWidth: '220px' }}>
              Proactively surfacing unclaimed government welfare entitlements for citizens of India.
            </p>
            <p
              style={{
                fontFamily:    'var(--font-mono)',
                fontSize:      'var(--type-10)',
                color:         'var(--text-faint)',
                letterSpacing: '0.15em',
                marginTop:     'var(--space-sm)',
                textTransform: 'uppercase',
              }}
            >
              Hackathon MVP — {currentYear}
            </p>
          </div>

          {/* Links columns */}
          {[
            {
              heading: 'Product',
              links: [
                { label: 'How It Works', href: '#how-it-works' },
                { label: 'Scheme Database', href: '#schemes' },
                { label: 'Live Demo', href: '#demo' },
              ],
            },
            {
              heading: 'Technical',
              links: [
                { label: 'Architecture', href: '#' },
                { label: 'Ingestion Pipeline', href: '#' },
                { label: 'Rules Engine', href: '#' },
                { label: 'GitHub', href: '#' },
              ],
            },
            {
              heading: 'Context',
              links: [
                { label: 'myScheme.gov.in', href: 'https://myscheme.gov.in' },
                { label: 'NSAP Portal', href: 'https://nsap.nic.in' },
                { label: 'PM-KISAN', href: 'https://pmkisan.gov.in' },
                { label: 'PMAY-G', href: 'https://pmayg.nic.in' },
              ],
            },
          ].map((col) => (
            <div key={col.heading}>
              <p
                style={{
                  fontFamily:    'var(--font-mono)',
                  fontSize:      'var(--type-10)',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color:         'var(--text-faint)',
                  marginBottom:  'var(--space-sm)',
                }}
              >
                {col.heading}
              </p>
              <ul role="list" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      style={{
                        fontSize:   'var(--type-14)',
                        color:      'var(--text-muted)',
                        transition: 'color var(--duration-fast) var(--ease)',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--kinpaku-gold)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop:      '1px solid var(--gold-hairline)',
            paddingTop:     'var(--space-md)',
            display:        'flex',
            justifyContent: 'space-between',
            alignItems:     'center',
            flexWrap:       'wrap',
            gap:            'var(--space-sm)',
          }}
        >
          <p style={{ fontSize: 'var(--type-12)', color: 'var(--text-faint)', margin: 0 }}>
            © {currentYear} EntitleMap. Built for the civic-tech hackathon.{' '}
            <span style={{ color: 'var(--text-mute-deep)' }}>
              Eligibility computed from self-declared data — verify with issuing departments.
            </span>
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            {[
              { label: 'Privacy', href: '#' },
              { label: 'Disclaimer', href: '#' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                style={{ fontSize: 'var(--type-12)', color: 'var(--text-faint)' }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 540px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
