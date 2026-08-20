import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';

/**
 * Navbar — sticky header with brand lockup and navigation links.
 * Becomes slightly opaque on scroll for legibility.
 * Accessibility: skip link, semantic nav, aria-label on logo link.
 */
export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Problem', href: '#problem' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Schemes', href: '#schemes' },
    { label: 'Live Demo', href: '#demo' },
  ];

  return (
    <>
      {/* Skip link for accessibility */}
      <a
        href="#main"
        style={{
          position:  'absolute',
          left:      '-9999px',
          top:       '16px',
          zIndex:    9999,
          padding:   '8px 16px',
          background: 'var(--kinpaku-gold)',
          color:     'var(--dark-ink)',
          borderRadius: 'var(--radius-sm)',
        }}
        onFocus={(e) => { e.currentTarget.style.left = '16px'; }}
        onBlur={(e)  => { e.currentTarget.style.left = '-9999px'; }}
      >
        Skip to main content
      </a>

      <nav
        aria-label="Main navigation"
        style={{
          position:        'fixed',
          top:             0,
          left:            0,
          right:           0,
          zIndex:          100,
          height:          '64px',
          display:         'flex',
          alignItems:      'center',
          backgroundColor: scrolled
            ? 'oklch(7% 0.006 95 / 0.92)'
            : 'transparent',
          borderBottom:    scrolled ? '1px solid var(--gold-hairline)' : 'none',
          backdropFilter:  scrolled ? 'blur(12px)' : 'none',
          transition:      'all var(--duration-base) var(--ease)',
        }}
      >
        <div
          className="container"
          style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
            width:          '100%',
          }}
        >
          {/* Brand */}
          <a
            href="/"
            aria-label="EntitleMap — Home"
            style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}
          >
            {/* Brand mark — gold diagonal tile */}
            <div
              aria-hidden="true"
              style={{
                width:          '32px',
                height:         '32px',
                background:     `linear-gradient(135deg, var(--kinpaku-gold) 50%, var(--kinpaku-deep) 50%)`,
                borderRadius:   'var(--radius-sm)',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                flexShrink:     0,
              }}
            />
            <span
              style={{
                fontFamily:    'var(--font-display)',
                fontSize:      'var(--type-18)',
                fontWeight:    400,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color:         'var(--champagne)',
              }}
            >
              EntitleMap
            </span>
          </a>

          {/* Desktop nav links */}
          <ul
            role="list"
            style={{
              display:    'flex',
              gap:        'var(--space-lg)',
              listStyle:  'none',
              alignItems: 'center',
            }}
            className="nav-desktop"
          >
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  style={{
                    fontFamily:    'var(--font-body)',
                    fontSize:      'var(--type-14)',
                    color:         'var(--text-muted)',
                    textDecoration: 'none',
                    transition:    'color var(--duration-fast) var(--ease)',
                    letterSpacing: '0.02em',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--champagne)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
                }}
                aria-label="Try the live demo"
              >
                Try Demo
              </Button>
            </li>
          </ul>

          {/* Mobile hamburger */}
          <button
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((o) => !o)}
            style={{
              display:    'none',
              background: 'none',
              border:     'none',
              cursor:     'pointer',
              padding:    '8px',
              color:      'var(--champagne)',
            }}
            className="nav-mobile-toggle"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              {menuOpen ? (
                <path d="M4 4l14 14M18 4L4 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              ) : (
                <>
                  <line x1="3" y1="6"  x2="19" y2="6"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="3" y1="11" x2="19" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="3" y1="16" x2="19" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            id="mobile-menu"
            style={{
              position:        'absolute',
              top:             '64px',
              left:            0,
              right:           0,
              backgroundColor: 'var(--lacquer-deep)',
              borderBottom:    '1px solid var(--gold-hairline)',
              padding:         'var(--space-sm) var(--space-lg)',
              display:         'flex',
              flexDirection:   'column',
              gap:             'var(--space-sm)',
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  color:          'var(--text-warm)',
                  fontSize:       'var(--type-16)',
                  padding:        '8px 0',
                  borderBottom:   '1px solid var(--gold-hairline)',
                  textDecoration: 'none',
                }}
              >
                {link.label}
              </a>
            ))}
            <Button
              variant="primary"
              size="sm"
              style={{ marginTop: 'var(--space-xs)' }}
              onClick={() => {
                setMenuOpen(false);
                document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Try Demo
            </Button>
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-toggle { display: flex !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
