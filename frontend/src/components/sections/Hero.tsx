import React, { useEffect, useRef } from 'react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

/**
 * Hero — the first-viewport statement.
 * Gold diagonal kinpaku seams, animated circuit traces, strong typographic hierarchy.
 * The "push not pull" framing is the key message.
 */
export const Hero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* Lightweight canvas animation: subtle gold circuit traces */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    type Particle = { x: number; y: number; vx: number; vy: number; alpha: number; radius: number };
    const particles: Particle[] = Array.from({ length: 40 }, () => ({
      x:      Math.random() * canvas.width,
      y:      Math.random() * canvas.height,
      vx:     (Math.random() - 0.5) * 0.3,
      vy:     (Math.random() - 0.5) * 0.3,
      alpha:  Math.random() * 0.25 + 0.05,
      radius: Math.random() * 1.5 + 0.5,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections (circuit traces)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            const alpha = (1 - dist / 160) * 0.08;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `oklch(84% 0.19 80.46 / ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `oklch(84% 0.19 80.46 / ${p.alpha})`;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section
      id="hero"
      aria-labelledby="hero-headline"
      style={{
        position:   'relative',
        minHeight:  '100vh',
        display:    'flex',
        alignItems: 'center',
        overflow:   'hidden',
        paddingTop: '64px', /* navbar height */
      }}
    >
      {/* Canvas background */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset:    0,
          width:    '100%',
          height:   '100%',
          pointerEvents: 'none',
        }}
      />

      {/* Gold kinpaku seam — diagonal accent */}
      <div
        aria-hidden="true"
        style={{
          position:    'absolute',
          top:         0,
          right:       0,
          width:       '45%',
          height:      '100%',
          background:  `linear-gradient(135deg,
            transparent 40%,
            oklch(84% 0.19 80.46 / 0.04) 50%,
            oklch(84% 0.19 80.46 / 0.08) 52%,
            oklch(84% 0.19 80.46 / 0.03) 54%,
            transparent 65%
          )`,
          pointerEvents: 'none',
        }}
      />

      {/* Radial glow behind headline */}
      <div
        aria-hidden="true"
        style={{
          position:  'absolute',
          top:       '20%',
          left:      '5%',
          width:     '600px',
          height:    '400px',
          background: 'radial-gradient(ellipse, oklch(84% 0.19 80.46 / 0.06) 0%, transparent 70%)',
          filter:    'blur(40px)',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <div style={{ maxWidth: '860px' }}>

          {/* Eyebrow badge */}
          <div style={{ marginBottom: 'var(--space-md)', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <Badge variant="patina" dot>
              AI for Civic Empowerment
            </Badge>
            <Badge variant="gold">
              Hackathon MVP
            </Badge>
          </div>

          {/* Main headline */}
          <h1
            id="hero-headline"
            style={{ marginBottom: 'var(--space-md)', lineHeight: 1.0 }}
          >
            What are{' '}
            <span
              style={{
                background: `linear-gradient(135deg, var(--kinpaku-gold), var(--kinpaku-pale))`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor:  'transparent',
                backgroundClip:       'text',
              }}
            >
              you owed?
            </span>
          </h1>

          {/* Sub-headline */}
          <p
            style={{
              fontSize:     'var(--type-20)',
              lineHeight:   1.6,
              color:        'var(--text-muted)',
              marginBottom: 'var(--space-xl)',
              maxWidth:     '640px',
              fontWeight:   300,
            }}
          >
            Millions of Indians are eligible for government welfare schemes they have{' '}
            <strong>never claimed</strong>. EntitleMap flips the model:{' '}
            <em style={{ color: 'var(--champagne)', fontStyle: 'normal' }}>
              we find what you're owed — you don't have to ask.
            </em>
          </p>

          {/* CTA row */}
          <div
            style={{
              display:   'flex',
              gap:       'var(--space-sm)',
              flexWrap:  'wrap',
              alignItems: 'center',
              marginBottom: 'var(--space-2xl)',
            }}
          >
            <Button
              variant="primary"
              size="lg"
              id="hero-cta-demo"
              onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
              aria-label="Try the live conversational demo"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M6 9l4.5-3v6L6 9z" fill="currentColor"/>
              </svg>
              Try Live Demo
            </Button>
            <Button
              variant="secondary"
              size="lg"
              id="hero-cta-learn"
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              aria-label="Learn how EntitleMap works"
            >
              How It Works
            </Button>
          </div>

          {/* Stats strip */}
          <div
            style={{
              display:       'flex',
              gap:           'var(--space-xl)',
              flexWrap:      'wrap',
              paddingTop:    'var(--space-md)',
              borderTop:     '1px solid var(--gold-hairline)',
            }}
          >
            {[
              { value: '25+',    label: 'Verified Schemes' },
              { value: '<15s',   label: 'Profile to Results' },
              { value: '100%',   label: 'Deterministic Matching' },
              { label: '5 Languages', value: '🇮🇳', noGold: true },
            ].map((stat) => (
              <div key={stat.label} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span
                  style={{
                    fontFamily:  'var(--font-display)',
                    fontSize:    'var(--type-32)',
                    fontWeight:  300,
                    color:       stat.noGold ? 'var(--champagne)' : 'var(--kinpaku-gold)',
                    lineHeight:  1,
                  }}
                >
                  {stat.value}
                </span>
                <span
                  style={{
                    fontFamily:    'var(--font-mono)',
                    fontSize:      'var(--type-11)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color:         'var(--text-muted)',
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gold seam */}
      <div
        aria-hidden="true"
        className="gold-seam"
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}
      />
    </section>
  );
};

export default Hero;
