import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  fullWidth?: boolean;
  as?: 'button' | 'a';
  href?: string;
}

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: '8px 20px', fontSize: '0.875rem', minHeight: '36px' },
  md: { padding: '12px 32px', fontSize: '1rem',    minHeight: '48px' },
  lg: { padding: '16px 48px', fontSize: '1rem',    minHeight: '58px' },
};

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: 'var(--kinpaku-gold)',
    color:           'var(--dark-ink)',
    border:          '1px solid var(--kinpaku-gold)',
    fontWeight:      600,
  },
  secondary: {
    backgroundColor: 'transparent',
    color:           'var(--kinpaku-gold)',
    border:          '1px solid var(--gold-hairline-strong)',
    fontWeight:      500,
  },
  ghost: {
    backgroundColor: 'transparent',
    color:           'var(--text-warm)',
    border:          '1px solid var(--gold-hairline)',
    fontWeight:      400,
  },
};

/**
 * Button — Neo Kinpaku primary UI primitive.
 * Accessibility: focusVisible ring via global CSS :focus-visible.
 * Security: No dangerouslySetInnerHTML, no XSS vectors.
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  fullWidth = false,
  style,
  ...rest
}) => {
  const baseStyle: React.CSSProperties = {
    display:        'inline-flex',
    alignItems:     'center',
    justifyContent: 'center',
    gap:            '8px',
    borderRadius:   'var(--radius-xs)',
    fontFamily:     'var(--font-body)',
    letterSpacing:  '0.01em',
    cursor:         'pointer',
    transition:     'all var(--duration-base) var(--ease)',
    textDecoration: 'none',
    userSelect:     'none',
    width:          fullWidth ? '100%' : undefined,
    position:       'relative',
    overflow:       'hidden',
    ...sizeStyles[size],
    ...variantStyles[variant],
    ...style,
  };

  return (
    <button
      style={baseStyle}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        if (variant === 'primary') {
          el.style.backgroundColor = 'var(--kinpaku-pale)';
          el.style.transform = 'translateY(-1px)';
          el.style.boxShadow = 'var(--shadow-cta)';
        } else if (variant === 'secondary') {
          el.style.backgroundColor = 'oklch(84% 0.19 80.46 / 0.07)';
          el.style.transform = 'translateY(-1px)';
        } else {
          el.style.borderColor = 'var(--gold-hairline-strong)';
          el.style.color = 'var(--kinpaku-gold)';
        }
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.backgroundColor = variantStyles[variant].backgroundColor as string;
        el.style.transform = '';
        el.style.boxShadow = '';
        if (variant === 'secondary') {
          el.style.backgroundColor = 'transparent';
        }
        if (variant === 'ghost') {
          el.style.borderColor = 'var(--gold-hairline)';
          el.style.color = 'var(--text-warm)';
        }
      }}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
