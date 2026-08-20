import React from 'react';

interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  hover?: boolean;
  glow?: 'gold' | 'patina' | 'none';
  padding?: string;
}

/**
 * Card — flat dark panel with hairline border.
 * No default shadow per DESIGN.md "No Default Card Shadow" rule.
 * Hover state adds subtle gold border lift only.
 */
export const Card: React.FC<CardProps> = ({
  children,
  style,
  hover = false,
  glow = 'none',
  padding = 'var(--space-md)',
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const glowMap = {
    gold:   'var(--shadow-gold)',
    patina: 'var(--shadow-glow)',
    none:   'none',
  };

  return (
    <div
      onMouseEnter={() => hover && setIsHovered(true)}
      onMouseLeave={() => hover && setIsHovered(false)}
      style={{
        backgroundColor: 'var(--raised-lacquer)',
        border:          `1px solid ${isHovered && hover ? 'var(--gold-hairline-strong)' : 'var(--gold-hairline)'}`,
        borderRadius:    'var(--radius-sm)',
        padding,
        color:           'var(--text-warm)',
        transition:      'border-color var(--duration-base) var(--ease), box-shadow var(--duration-base) var(--ease)',
        boxShadow:       isHovered && glow !== 'none' ? glowMap[glow] : 'none',
        transform:       isHovered && hover ? 'translateY(-2px)' : 'none',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default Card;
