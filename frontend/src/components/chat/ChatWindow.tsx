import React, { useState, useEffect, useRef } from 'react';
import { CONVERSATION_FLOW } from '../../data/conversation_flow';
import type { ConversationStep } from '../../data/conversation_flow';
import { DEMO_SCHEMES, DEMO_UNCLAIMED_SCHEME_IDS } from '../../data/mock_schemes';
import { SchemeCard } from './SchemeCard';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface Message {
  id: string;
  role: 'system' | 'citizen';
  text: string;
  type: string;
  quickReplies?: { id: string; label: string; value: string }[];
  showSchemes?: boolean;
  isTyping?: boolean;
}

/**
 * ChatWindow — the full demo conversation simulator.
 * Replays the conversation_flow.ts script automatically, with
 * quick-reply buttons allowing user interaction at key turns.
 *
 * Accessibility: ARIA live region for new messages, role=log on the thread.
 */
export const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep]         = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [started, setStarted]   = useState(false);
  const [done, setDone]         = useState(false);
  const scrollRef                = useRef<HTMLDivElement>(null);
  const timerRef                 = useRef<ReturnType<typeof setTimeout>>();

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isTyping]);

  // Clean up timer on unmount
  useEffect(() => () => { clearTimeout(timerRef.current); }, []);

  const advanceStep = (currentStep: number) => {
    if (currentStep >= CONVERSATION_FLOW.length) {
      setDone(true);
      return;
    }

    const flow: ConversationStep = CONVERSATION_FLOW[currentStep];
    const delay = flow.delay ?? 600;

    // Show typing indicator for system messages
    if (flow.role === 'system' && flow.isTyping !== false) {
      setIsTyping(true);
    }

    timerRef.current = setTimeout(() => {
      setIsTyping(false);

      const isSchemeResult = flow.showSchemes === true;

      setMessages((prev) => [
        ...prev,
        {
          id:          flow.id,
          role:        flow.role,
          text:        flow.text,
          type:        flow.type,
          quickReplies: flow.quickReplies,
          showSchemes: isSchemeResult,
        },
      ]);

      setStep(currentStep + 1);

      // Auto-advance if no quick replies needed and autoAdvance is true
      if (!flow.quickReplies && flow.autoAdvance !== false) {
        timerRef.current = setTimeout(() => {
          advanceStep(currentStep + 1);
        }, 400);
      }
    }, delay + (flow.isTyping !== false && flow.role === 'system' ? 1000 : 0));
  };

  const handleStart = () => {
    setStarted(true);
    advanceStep(0);
  };

  const handleQuickReply = (reply: { id: string; label: string; value: string }) => {
    // Remove quick replies from last system message
    setMessages((prev) =>
      prev.map((m, i) =>
        i === prev.length - 1 ? { ...m, quickReplies: undefined } : m
      )
    );

    // Add citizen reply
    setMessages((prev) => [
      ...prev,
      {
        id:   reply.id,
        role: 'citizen',
        text: reply.label,
        type: 'message',
      },
    ]);

    // Advance to next step
    setTimeout(() => advanceStep(step + 1), 300);
  };

  const handleReset = () => {
    setMessages([]);
    setStep(0);
    setDone(false);
    setIsTyping(false);
    clearTimeout(timerRef.current);
    setTimeout(() => advanceStep(0), 300);
  };

  const unclaimedSchemes = DEMO_SCHEMES.filter((s) => DEMO_UNCLAIMED_SCHEME_IDS.includes(s.scheme_id));

  return (
    <div
      style={{
        background:   'var(--lacquer-deep)',
        border:       '1px solid var(--gold-hairline-strong)',
        borderRadius: 'var(--radius-2xl)',
        overflow:     'hidden',
        display:      'flex',
        flexDirection: 'column',
        height:       '640px',
        boxShadow:    'var(--shadow-panel)',
      }}
    >
      {/* WhatsApp-style header */}
      <div
        style={{
          display:        'flex',
          alignItems:     'center',
          gap:            'var(--space-sm)',
          padding:        '12px var(--space-sm)',
          background:     'var(--raised-lacquer)',
          borderBottom:   '1px solid var(--gold-hairline)',
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width:          '40px',
            height:         '40px',
            borderRadius:   '50%',
            background:     `linear-gradient(135deg, var(--kinpaku-gold), var(--kinpaku-deep))`,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            flexShrink:     0,
          }}
          aria-hidden="true"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L3 8v10h4v-6h6v6h4V8L10 2z" fill="var(--dark-ink)" strokeWidth="0"/>
          </svg>
        </div>

        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 'var(--type-14)', fontWeight: 600, color: 'var(--champagne)', lineHeight: 1 }}>
            EntitleMap
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
            <span
              style={{
                width:        '6px',
                height:       '6px',
                borderRadius: '50%',
                background:   'var(--verdigris-patina)',
                animation:    'patina-breathe 2s infinite',
                display:      'inline-block',
              }}
              aria-hidden="true"
            />
            <span style={{ fontSize: 'var(--type-12)', color: 'var(--patina-text)' }}>
              {isTyping ? 'typing...' : 'online'}
            </span>
          </div>
        </div>

        <Badge variant="patina">WhatsApp Demo</Badge>

        {started && (
          <button
            onClick={handleReset}
            aria-label="Restart the demo conversation"
            title="Restart"
            style={{
              background:   'transparent',
              border:       'none',
              cursor:       'pointer',
              color:        'var(--text-faint)',
              padding:      '4px',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 8a6 6 0 106-6H4m0 0l2-2M4 2l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>

      {/* Message thread */}
      <div
        role="log"
        aria-label="EntitleMap conversation"
        aria-live="polite"
        aria-atomic="false"
        style={{
          flex:      1,
          overflowY: 'auto',
          padding:   'var(--space-sm)',
          display:   'flex',
          flexDirection: 'column',
          gap:       '8px',
          backgroundImage: `radial-gradient(oklch(84% 0.19 80.46 / 0.02) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      >
        {!started && (
          <div
            style={{
              flex:           1,
              display:        'flex',
              flexDirection:  'column',
              alignItems:     'center',
              justifyContent: 'center',
              gap:            'var(--space-md)',
              textAlign:      'center',
            }}
          >
            <div
              style={{
                width:          '72px',
                height:         '72px',
                borderRadius:   '50%',
                background:     `linear-gradient(135deg, var(--kinpaku-gold), var(--kinpaku-deep))`,
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
              }}
              aria-hidden="true"
            >
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <path d="M18 4L6 14v18h8v-10h8v10h8V14L18 4z" fill="var(--dark-ink)"/>
              </svg>
            </div>
            <div>
              <h3 style={{ fontSize: 'var(--type-18)', marginBottom: '4px' }}>Live Demo</h3>
              <p style={{ fontSize: 'var(--type-14)', color: 'var(--text-muted)', maxWidth: '280px' }}>
                Watch EntitleMap surface unclaimed welfare schemes for a sample citizen
              </p>
            </div>
            <Button
              id="start-demo-btn"
              variant="primary"
              size="md"
              onClick={handleStart}
              aria-label="Start the EntitleMap demo conversation"
            >
              ▶ Start Demo
            </Button>
          </div>
        )}

        {messages.map((msg) => (
          <React.Fragment key={msg.id}>
            <div
              style={{
                display:       'flex',
                justifyContent: msg.role === 'citizen' ? 'flex-end' : 'flex-start',
                animation:     'fade-in-up 0.3s var(--ease-out) both',
              }}
            >
              <div
                style={{
                  maxWidth:     '85%',
                  padding:      '10px 14px',
                  borderRadius: msg.role === 'citizen'
                    ? 'var(--radius-lg) var(--radius-lg) 2px var(--radius-lg)'
                    : 'var(--radius-lg) var(--radius-lg) var(--radius-lg) 2px',
                  background:   msg.role === 'citizen'
                    ? 'oklch(84% 0.19 80.46 / 0.18)'
                    : 'var(--raised-lacquer)',
                  border:       `1px solid ${msg.role === 'citizen' ? 'var(--gold-hairline-strong)' : 'var(--gold-hairline)'}`,
                  fontSize:     'var(--type-13)',
                  color:        'var(--text-warm)',
                  lineHeight:   1.55,
                  whiteSpace:   'pre-line',
                }}
              >
                {msg.type === 'matching' ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>⚡</span>
                    <span>{msg.text.replace('⚡ ', '')}</span>
                  </div>
                ) : (
                  msg.text
                )}
              </div>
            </div>

            {/* Scheme cards after results_intro */}
            {msg.showSchemes && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginLeft: '8px' }}>
                {unclaimedSchemes.map((scheme, i) => (
                  <div
                    key={scheme.scheme_id}
                    style={{ animationDelay: `${i * 200}ms` }}
                  >
                    <SchemeCard scheme={scheme} isNew />
                  </div>
                ))}
              </div>
            )}

            {/* Quick reply buttons */}
            {msg.quickReplies && (
              <div
                role="group"
                aria-label="Reply options"
                style={{
                  display:  'flex',
                  flexWrap: 'wrap',
                  gap:      '6px',
                  padding:  '4px 0',
                }}
              >
                {msg.quickReplies.map((reply) => (
                  <button
                    key={reply.id}
                    id={reply.id}
                    onClick={() => handleQuickReply(reply)}
                    aria-label={`Select: ${reply.label}`}
                    style={{
                      padding:       '7px 14px',
                      background:    'var(--graphite)',
                      border:        '1px solid var(--gold-hairline-strong)',
                      borderRadius:  'var(--radius-pill)',
                      color:         'var(--kinpaku-gold)',
                      fontSize:      'var(--type-13)',
                      cursor:        'pointer',
                      transition:    'all var(--duration-fast) var(--ease)',
                      fontFamily:    'var(--font-body)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'oklch(84% 0.19 80.46 / 0.15)';
                      e.currentTarget.style.borderColor = 'var(--kinpaku-gold)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--graphite)';
                      e.currentTarget.style.borderColor = 'var(--gold-hairline-strong)';
                    }}
                  >
                    {reply.label}
                  </button>
                ))}
              </div>
            )}
          </React.Fragment>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div
            style={{ display: 'flex', justifyContent: 'flex-start' }}
            aria-live="polite"
            aria-label="EntitleMap is typing"
          >
            <div
              style={{
                padding:      '12px 16px',
                background:   'var(--raised-lacquer)',
                border:       '1px solid var(--gold-hairline)',
                borderRadius: 'var(--radius-lg) var(--radius-lg) var(--radius-lg) 2px',
                display:      'flex',
                gap:          '4px',
                alignItems:   'center',
              }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{
                    width:      '7px',
                    height:     '7px',
                    borderRadius: '50%',
                    background: 'var(--kinpaku-gold)',
                    animation:  `patina-breathe 1.2s ease-in-out ${i * 0.2}s infinite`,
                    display:    'block',
                  }}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        )}

        {/* Done state */}
        {done && (
          <div
            style={{
              textAlign:  'center',
              padding:    'var(--space-sm)',
              color:      'var(--text-faint)',
              fontSize:   'var(--type-12)',
              fontFamily: 'var(--font-mono)',
              animation:  'fade-in-up 0.4s var(--ease-out) both',
            }}
          >
            ── Demo complete ──{' '}
            <button
              onClick={handleReset}
              style={{ background: 'none', border: 'none', color: 'var(--kinpaku-gold)', cursor: 'pointer', fontSize: 'inherit', fontFamily: 'inherit' }}
            >
              Restart
            </button>
          </div>
        )}

        <div ref={scrollRef} />
      </div>
    </div>
  );
};

export default ChatWindow;
