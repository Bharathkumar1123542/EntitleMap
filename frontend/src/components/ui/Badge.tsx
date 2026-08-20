import React from 'react';

type BadgeVariant = 'gold' | 'patina' | 'muted' | 'warning' | 'success';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  dot?: boolean;
  style?: React.CSSProperties;
}

const variantMap: Record<BadgeVariant, { bg: string; text: string; dotColor: string; border: string }> = {
  gold: {
    bg:       'oklch(84% 0.19 80.46 / 0.12)',
    text:     'var(--kinpaku-gold)',
    dotColor: 'var(--kinpaku-gold)',
    border:   'var(--gold-hairline-strong)',
  },
  patina: {
    bg:       'oklch(70% 0.12 188 / 0.12)',
    text:     'var(--patina-text)',
    dotColor: 'var(--verdigris-patina)',
    border:   'var(--patina-rule)',
  },
  muted: {
    bg:       'var(--graphite)',
    text:     'var(--text-muted)',
    dotColor: 'var(--text-faint)',
    border:   'var(--gold-hairline)',
  },
  warning: {
    bg:       'oklch(58% 0.15 35 / 0.12)',
    text:     'var(--vermilion-warning)',
    dotColor: 'var(--vermilion-warning)',
    border:   'oklch(58% 0.15 35 / 0.4)',
  },
  success: {
    bg:       'var(--success-soft)',
    text:     'var(--success)',
    dotColor: 'var(--success)',
    border:   'var(--success-border)',
  },
};

/**
 * Badge — status indicator pill.
 * Used for scheme categories, eligibility states, and live indicators.
 */
export const Badge: React.FC<BadgeProps> = ({
  variant = 'muted',
  children,
  dot = false,
  style,
}) => {
  const v = variantMap[variant];

  return (
    <span
      style={{
        display:       'inline-flex',
        alignItems:    'center',
        gap:           '6px',
        padding:       '3px 10px',
        borderRadius:  'var(--radius-pill)',
        background:    v.bg,
        color:         v.text,
        border:        `1px solid ${v.border}`,
        fontSize:      'var(--type-11)',
        fontFamily:    'var(--font-mono)',
        fontWeight:    500,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        whiteSpace:    'nowrap',
        ...style,
      }}
    >
      {dot && (
        <span
          aria-hidden="true"
          style={{
            width:        '6px',
            height:       '6px',
            borderRadius: '50%',
            background:   v.dotColor,
            animation:    'patina-breathe 2s ease-in-out infinite',
            flexShrink:   0,
          }}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
