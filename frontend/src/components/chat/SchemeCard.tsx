import React from 'react';
import type { MockScheme } from '../../data/mock_schemes';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface SchemeCardProps {
  scheme: MockScheme;
  isNew?: boolean;
}

/**
 * SchemeCard — displays a matched scheme result inside the chat window.
 * Shows benefit description, amount, eligibility summary, and required docs.
 * "Download PDF" is a demo action that simulates the application package.
 */
export const SchemeCard: React.FC<SchemeCardProps> = ({ scheme, isNew = false }) => {
  const [expanded, setExpanded] = React.useState(false);

  const categoryColorMap: Record<string, string> = {
    pension:       'patina',
    agriculture:   'gold',
    housing:       'gold',
    disability:    'muted',
    income_support: 'gold',
  };

  const badgeVariant = (categoryColorMap[scheme.category] || 'muted') as 'patina' | 'gold' | 'muted';

  return (
    <div
      style={{
        background:   'var(--raised-lacquer)',
        border:       `1px solid ${isNew ? 'var(--gold-hairline-strong)' : 'var(--gold-hairline)'}`,
        borderRadius: 'var(--radius-md)',
        overflow:     'hidden',
        animation:    isNew ? 'fade-in-up 0.4s var(--ease-out) both' : 'none',
        boxShadow:    isNew ? 'var(--shadow-gold)' : 'none',
        transition:   'all var(--duration-base) var(--ease)',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding:       'var(--space-sm)',
          borderBottom:  '1px solid var(--gold-hairline)',
          display:       'flex',
          gap:           'var(--space-xs)',
          alignItems:    'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ flex: 1 }}>
          <Badge variant={badgeVariant} style={{ marginBottom: '6px' }}>
            {scheme.category.replace('_', ' ')}
          </Badge>
          <h4
            style={{
              fontSize:   'var(--type-14)',
              lineHeight: 1.4,
              color:      'var(--champagne)',
            }}
          >
            {scheme.scheme_name}
          </h4>
        </div>
        <div
          style={{
            flexShrink: 0,
            display:    'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width:      '28px',
            height:     '28px',
            borderRadius: '50%',
            background: 'oklch(45% 0.18 145 / 0.15)',
            border:     '1px solid var(--success-border)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2.5 7l3 3 6-6" stroke="var(--success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Benefit amount */}
      <div
        style={{
          padding:    'var(--space-xs) var(--space-sm)',
          background: 'oklch(84% 0.19 80.46 / 0.05)',
          borderBottom: '1px solid var(--gold-hairline)',
        }}
      >
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--type-11)', color: 'var(--text-faint)', letterSpacing: '0.1em' }}>
          BENEFIT
        </span>
        <p style={{ fontSize: 'var(--type-14)', color: 'var(--kinpaku-gold)', fontWeight: 600, marginTop: '2px' }}>
          {scheme.benefit_amount}
        </p>
      </div>

      {/* Eligibility summary */}
      <div style={{ padding: 'var(--space-xs) var(--space-sm)' }}>
        <p style={{ fontSize: 'var(--type-12)', color: 'var(--text-muted)', marginBottom: '6px' }}>
          {scheme.benefit_description}
        </p>

        {/* Eligibility reasons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: 'var(--space-xs)' }}>
          {scheme.eligibility_summary.slice(0, 2).map((rule) => (
            <span
              key={rule}
              style={{
                fontSize:      'var(--type-10)',
                fontFamily:    'var(--font-mono)',
                color:         'var(--patina-text)',
                background:    'oklch(70% 0.12 188 / 0.08)',
                border:        '1px solid var(--patina-rule)',
                borderRadius:  'var(--radius-pill)',
                padding:       '2px 8px',
              }}
            >
              ✓ {rule}
            </span>
          ))}
        </div>

        {/* Expandable docs */}
        {expanded && (
          <div style={{ marginTop: 'var(--space-xs)', animation: 'fade-in-up 0.3s var(--ease-out) both' }}>
            <p style={{ fontSize: 'var(--type-11)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', color: 'var(--text-faint)', marginBottom: '6px', textTransform: 'uppercase' }}>
              Required Documents
            </p>
            <ol style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {scheme.required_documents.map((doc) => (
                <li key={doc} style={{ fontSize: 'var(--type-12)', color: 'var(--text-muted)' }}>
                  {doc}
                </li>
              ))}
            </ol>
            <p style={{ fontSize: 'var(--type-11)', color: 'var(--text-faint)', marginTop: '8px' }}>
              Apply at: <strong style={{ color: 'var(--text-muted)' }}>{scheme.application_authority}</strong>
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div
        style={{
          padding:     'var(--space-xs) var(--space-sm)',
          borderTop:   '1px solid var(--gold-hairline)',
          display:     'flex',
          gap:         '8px',
          alignItems:  'center',
        }}
      >
        <Button
          variant="primary"
          size="sm"
          id={`download-pdf-${scheme.scheme_id}`}
          aria-label={`Download pre-filled PDF for ${scheme.scheme_name}`}
          onClick={() => {
            // Demo: show an alert simulating PDF generation
            alert(`📄 PDF generated for "${scheme.scheme_name}"!\n\nIn production, this downloads a pre-filled application form with your profile data.`);
          }}
          style={{ flex: 1, fontSize: 'var(--type-12)' }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 1v8M4 6l3 3 3-3M2 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Download PDF
        </Button>
        <button
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
          aria-label={expanded ? 'Hide document checklist' : 'Show document checklist'}
          style={{
            background:   'transparent',
            border:       '1px solid var(--gold-hairline)',
            borderRadius: 'var(--radius-xs)',
            color:        'var(--text-muted)',
            fontSize:     'var(--type-12)',
            cursor:       'pointer',
            padding:      '6px 10px',
            transition:   'all var(--duration-fast) var(--ease)',
          }}
        >
          {expanded ? '▲ Less' : '▼ Docs'}
        </button>
      </div>
    </div>
  );
};

export default SchemeCard;
