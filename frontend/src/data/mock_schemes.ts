/**
 * mock_schemes.ts
 * Five demo schemes used in the web chat simulator.
 * Each includes full EligibilityRule-compatible structure so the
 * rules engine can evaluate them deterministically.
 */

export interface MockScheme {
  scheme_id: string;
  scheme_name: string;
  category: string;
  jurisdiction: string;
  benefit_description: string;
  benefit_amount: string;
  eligibility_summary: string[];
  required_documents: string[];
  application_authority: string;
  source_url: string;
}

export const DEMO_SCHEMES: MockScheme[] = [
  {
    scheme_id:            'ignoaps',
    scheme_name:          'Indira Gandhi National Old Age Pension Scheme (IGNOAPS)',
    category:             'pension',
    jurisdiction:         'central',
    benefit_description:  'Monthly pension to destitute elderly persons belonging to Below Poverty Line (BPL) households.',
    benefit_amount:       '₹200–₹500/month (central share) + state top-up',
    eligibility_summary:  ['Age ≥ 60 years', 'BPL household (annual income < ₹1,00,000)', 'Any social category'],
    required_documents:   ['Aadhaar card copy', 'Age proof (Birth cert / school leaving cert)', 'BPL ration card', 'Bank passbook copy', 'Self-declaration form'],
    application_authority: 'District Social Welfare Office / Gram Panchayat',
    source_url:           'https://nsap.nic.in',
  },
  {
    scheme_id:            'pm_kisan',
    scheme_name:          'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    category:             'agriculture',
    jurisdiction:         'central',
    benefit_description:  'Income support of ₹6,000/year in three equal instalments to land-holding farmer families.',
    benefit_amount:       '₹6,000/year (₹2,000 per instalment × 3)',
    eligibility_summary:  ['Owns agricultural land (any size)', 'Occupation: farmer', 'Not a government employee / income-tax payer'],
    required_documents:   ['Aadhaar card', 'Land record / Khasra-Khatauni', 'Bank account details', 'Mobile number linked to Aadhaar'],
    application_authority: 'Common Service Centre (CSC) / Agriculture department',
    source_url:           'https://pmkisan.gov.in',
  },
  {
    scheme_id:            'pmay_gramin',
    scheme_name:          'Pradhan Mantri Awaas Yojana – Gramin (PMAY-G)',
    category:             'housing',
    jurisdiction:         'central',
    benefit_description:  'Financial assistance for construction of a pucca house for rural BPL households.',
    benefit_amount:       '₹1.20–₹1.30 lakh (plains) / ₹1.30–₹1.50 lakh (hilly/difficult areas)',
    eligibility_summary:  ['Rural household', 'BPL / SECC priority list', 'Does not own a pucca house', 'SC/ST or Minority gets priority'],
    required_documents:   ['Aadhaar card', 'BPL certificate', 'SECC survey entry', 'Bank account', 'Caste certificate (for priority)'],
    application_authority: 'Gram Panchayat / Block Development Office',
    source_url:           'https://pmayg.nic.in',
  },
  {
    scheme_id:            'udid_assistance',
    scheme_name:          'Assistance to Disabled Persons (ADIP) — Aids & Appliances',
    category:             'disability',
    jurisdiction:         'central',
    benefit_description:  'Free assistive devices, aids, and appliances to persons with benchmark disabilities.',
    benefit_amount:       'Devices worth up to ₹8,000–₹12,000 (varies by device type)',
    eligibility_summary:  ['Has disability with ≥ 40% benchmark disability', 'Annual family income ≤ ₹2 lakh', 'Certified disability via UDID / Disability certificate'],
    required_documents:   ['Disability certificate (≥40%)', 'Income certificate', 'Aadhaar card', 'Doctor prescription for the device', 'Recent photograph'],
    application_authority: 'District Disability Rehabilitation Centre (DDRC)',
    source_url:           'https://disabilityaffairs.gov.in',
  },
  {
    scheme_id:            'nfsa_pds',
    scheme_name:          'National Food Security Act (NFSA) – Priority Household Ration',
    category:             'income_support',
    jurisdiction:         'central',
    benefit_description:  'Subsidised foodgrains (rice, wheat, millets) for Priority Household (PHH) ration card holders.',
    benefit_amount:       '5 kg per person/month at ₹1–₹3/kg (effectively free since PMGKAY extension)',
    eligibility_summary:  ['Annual income < ₹1,00,000', 'Rural household', 'Not covered by APL ration card'],
    required_documents:   ['Application to local Tehsil/Circle office', 'Aadhaar card', 'Proof of residence', 'Income self-declaration'],
    application_authority: 'Tehsil / Circle Office / Fair Price Shop',
    source_url:           'https://dfpd.gov.in',
  },
];

/** The demo persona — a 62-year-old SC farmer with a disability certificate */
export const DEMO_CITIZEN_PROFILE = {
  age:                   62,
  gender:                'male',
  state:                 'Rajasthan',
  district:              'Barmer',
  is_rural:              true,
  occupation_category:   'farmer',
  annual_income_band:    'below_100000',
  social_category:       'sc',
  has_disability:        true,
  disability_percentage: 45,
  land_owned_acres:      2.5,
  family_size:           4,
  language:              'hi',
};

/** Which schemes this persona is pre-matched to (for the demo) */
export const DEMO_MATCHED_SCHEME_IDS = ['ignoaps', 'pm_kisan', 'pmay_gramin', 'udid_assistance'];

/** One scheme the persona says they are already claiming */
export const DEMO_ALREADY_CLAIMING = ['pm_kisan'];

/** Final unclaimed schemes to show in the output */
export const DEMO_UNCLAIMED_SCHEME_IDS = ['ignoaps', 'pmay_gramin', 'udid_assistance'];
