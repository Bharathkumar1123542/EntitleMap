/**
 * conversation_flow.ts
 * Scripted turn-by-turn demo conversation for the web chat simulator.
 * Mirrors the exact WhatsApp flow described in project_overview.md §8.
 */

export type MessageRole = 'system' | 'citizen';
export type StepType = 'message' | 'quick_reply' | 'matching' | 'claim_check' | 'scheme_result' | 'complete';

export interface QuickReply {
  id: string;
  label: string;
  value: string;
}

export interface ConversationStep {
  id: string;
  role: MessageRole;
  type: StepType;
  text: string;
  delay?: number;          // ms to wait before showing this message
  quickReplies?: QuickReply[];
  autoAdvance?: boolean;   // advances without user interaction (system turns)
  isTyping?: boolean;      // show typing indicator before this
  schemeIds?: string[];    // for scheme_result steps
  showSchemes?: boolean;   // inject scheme cards after this message
}

export const CONVERSATION_FLOW: ConversationStep[] = [
  // ── Language Select ──
  {
    id:          'greeting',
    role:        'system',
    type:        'message',
    text:        '🇮🇳 *Namaste! Welcome to EntitleMap.*\n\nI can tell you which government welfare schemes you qualify for — and help you apply. What language would you like to use?',
    delay:       500,
    quickReplies: [
      { id: 'lang_hi', label: 'हिंदी', value: 'hi' },
      { id: 'lang_mr', label: 'मराठी', value: 'mr' },
      { id: 'lang_en', label: 'English', value: 'en' },
    ],
  },
  {
    id:    'lang_choice',
    role:  'citizen',
    type:  'message',
    text:  'हिंदी',
    delay: 800,
  },
  {
    id:           'consent',
    role:         'system',
    type:         'message',
    text:         '✅ *Privacy Notice:* I will ask you a few questions to check your eligibility. Your answers are only used for this session and never shared with any third party. Session data is deleted after 7 days.\n\nType "हाँ" or tap below to continue.',
    delay:        600,
    isTyping:     true,
    quickReplies: [
      { id: 'consent_yes', label: 'हाँ, जारी रखें', value: 'yes' },
    ],
  },
  {
    id:    'consent_reply',
    role:  'citizen',
    type:  'message',
    text:  'हाँ, जारी रखें',
    delay: 500,
  },

  // ── Profile Intake ──
  {
    id:       'q_age',
    role:     'system',
    type:     'message',
    text:     '📋 *आपकी आयु क्या है?* (उदाहरण: 45)\n\n_What is your age? (e.g. 45)_',
    delay:    700,
    isTyping: true,
  },
  {
    id:    'a_age',
    role:  'citizen',
    type:  'message',
    text:  '62',
    delay: 600,
  },
  {
    id:           'q_state',
    role:         'system',
    type:         'message',
    text:         '📍 *आप किस राज्य में रहते हैं?*\n\n_Which state do you live in?_',
    delay:        700,
    isTyping:     true,
    quickReplies: [
      { id: 'state_rj', label: 'Rajasthan', value: 'rajasthan' },
      { id: 'state_mh', label: 'Maharashtra', value: 'maharashtra' },
      { id: 'state_up', label: 'Uttar Pradesh', value: 'uttar_pradesh' },
      { id: 'state_other', label: 'Other', value: 'other' },
    ],
  },
  {
    id:    'a_state',
    role:  'citizen',
    type:  'message',
    text:  'Rajasthan',
    delay: 600,
  },
  {
    id:           'q_occupation',
    role:         'system',
    type:         'message',
    text:         '💼 *आपका मुख्य पेशा क्या है?*\n\n_What is your main occupation?_',
    delay:        600,
    isTyping:     true,
    quickReplies: [
      { id: 'occ_farmer',  label: 'किसान / Farmer',         value: 'farmer' },
      { id: 'occ_labor',   label: 'मजदूर / Daily-wage labor', value: 'daily_wage_labor' },
      { id: 'occ_self',    label: 'स्वरोजगार / Self-employed', value: 'self_employed' },
      { id: 'occ_other',   label: 'Other',                   value: 'other' },
    ],
  },
  {
    id:    'a_occupation',
    role:  'citizen',
    type:  'message',
    text:  'किसान / Farmer',
    delay: 600,
  },
  {
    id:           'q_income',
    role:         'system',
    type:         'message',
    text:         '💰 *आपकी परिवार की वार्षिक आय लगभग कितनी है?*\n\n_What is your approximate annual family income?_',
    delay:        600,
    isTyping:     true,
    quickReplies: [
      { id: 'inc_1',  label: '< ₹1 लाख / year',         value: 'below_100000' },
      { id: 'inc_2',  label: '₹1–3 लाख / year',          value: '100000_300000' },
      { id: 'inc_3',  label: '₹3–8 लाख / year',          value: '300000_800000' },
      { id: 'inc_4',  label: '> ₹8 लाख / year',          value: 'above_800000' },
    ],
  },
  {
    id:    'a_income',
    role:  'citizen',
    type:  'message',
    text:  '< ₹1 लाख / year',
    delay: 600,
  },
  {
    id:           'q_category',
    role:         'system',
    type:         'message',
    text:         '📜 *आपकी सामाजिक श्रेणी क्या है?*\n\n_What is your social category?_',
    delay:        600,
    isTyping:     true,
    quickReplies: [
      { id: 'cat_sc',  label: 'SC',      value: 'sc' },
      { id: 'cat_st',  label: 'ST',      value: 'st' },
      { id: 'cat_obc', label: 'OBC',     value: 'obc' },
      { id: 'cat_gen', label: 'General', value: 'general' },
    ],
  },
  {
    id:    'a_category',
    role:  'citizen',
    type:  'message',
    text:  'SC',
    delay: 600,
  },
  {
    id:           'q_disability',
    role:         'system',
    type:         'message',
    text:         '♿ *क्या आपके पास विकलांगता प्रमाण पत्र है?*\n\n_Do you have a disability certificate?_',
    delay:        600,
    isTyping:     true,
    quickReplies: [
      { id: 'dis_yes', label: 'हाँ, 45% / Yes (45%)', value: 'yes_45' },
      { id: 'dis_no',  label: 'नहीं / No',              value: 'no' },
    ],
  },
  {
    id:    'a_disability',
    role:  'citizen',
    type:  'message',
    text:  'हाँ, 45% / Yes (45%)',
    delay: 600,
  },

  // ── Matching (system processing turn) ──
  {
    id:          'matching',
    role:        'system',
    type:        'matching',
    text:        '⚡ *मिलान हो रहा है...*\n\nChecking your profile against 25+ verified government schemes...',
    delay:       800,
    isTyping:    true,
    autoAdvance: true,
  },
  {
    id:       'match_result',
    role:     'system',
    type:     'message',
    text:     '✅ *4 schemes found where you are eligible!*\n\nNow let me check which ones you are already receiving...',
    delay:    2000,
    isTyping: false,
  },

  // ── Claim Confirmation ──
  {
    id:           'claim_check_pm_kisan',
    role:         'system',
    type:         'claim_check',
    text:         '🌾 *PM-KISAN (₹6,000/year farmer support)*\n\nक्या आप यह योजना पहले से ले रहे हैं?\n_Are you already receiving this scheme?_',
    delay:        1200,
    isTyping:     true,
    quickReplies: [
      { id: 'claim_yes', label: 'हाँ / Yes, I receive it', value: 'yes' },
      { id: 'claim_no',  label: 'नहीं / No',                value: 'no' },
    ],
  },
  {
    id:    'a_claim_pm_kisan',
    role:  'citizen',
    type:  'message',
    text:  'हाँ / Yes, I receive it',
    delay: 600,
  },
  {
    id:    'claim_pm_kisan_filtered',
    role:  'system',
    type:  'message',
    text:  '✅ PM-KISAN filtered — you\'re already receiving it. Moving to unclaimed schemes...',
    delay: 600,
  },

  // ── Scheme Results ──
  {
    id:        'results_intro',
    role:       'system',
    type:       'message',
    text:       '🎯 *3 unclaimed schemes found for you:*\n\nआपके लिए 3 योजनाएँ जिन्हें आप अभी तक नहीं ले रहे हैं:',
    delay:      800,
    isTyping:   true,
    schemeIds:  ['ignoaps', 'pmay_gramin', 'udid_assistance'],
    showSchemes: true,
  },
  {
    id:          'complete',
    role:        'system',
    type:        'complete',
    text:        '📦 *Your application package is ready.*\n\nEach PDF includes:\n• Plain-language summary (Hindi)\n• Document checklist\n• Pre-filled application form\n\n_⚠️ Disclaimer: This is based on self-declared information. Please verify with the issuing department before submitting._',
    delay:       1500,
    isTyping:    true,
    autoAdvance: false,
  },
];
