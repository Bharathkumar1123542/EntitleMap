"""
scripts/seed_schemes.py
Creates all 25 scheme JSON files in backend/data/schemes/.
Run once to seed the knowledge base.
Usage: python scripts/seed_schemes.py
"""

import json
import os

SCHEMES_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "schemes")
os.makedirs(SCHEMES_DIR, exist_ok=True)

SCHEMES = [
    # ─── Pension / Social Security ─────────────────────────────────────────
    {
        "scheme_id": "ignwps",
        "scheme_name": "Indira Gandhi National Widow Pension Scheme (IGNWPS)",
        "category": "pension",
        "jurisdiction": "central",
        "predicate": {
            "operator": "AND",
            "conditions": [
                {"field": "gender", "op": "==", "value": "female"},
                {"field": "age", "op": ">=", "value": 40},
                {"field": "annual_income_band", "op": "in", "value": ["below_100000"]},
            ],
        },
        "benefit_description": "Monthly pension for BPL widows aged 40–79.",
        "benefit_amount": "₹300/month (central) + state top-up",
        "required_documents": [
            "Aadhaar card",
            "Husband's death certificate",
            "Age proof",
            "BPL ration card",
            "Bank passbook",
        ],
        "application_authority": "District Social Welfare Office",
        "source_document_url": "https://nsap.nic.in/Guidelines/NSAP_guidelines2014.pdf",
        "last_verified_date": "2024-03-01",
        "status": "PUBLISHED",
    },
    {
        "scheme_id": "igndps",
        "scheme_name": "Indira Gandhi National Disability Pension Scheme (IGNDPS)",
        "category": "pension",
        "jurisdiction": "central",
        "predicate": {
            "operator": "AND",
            "conditions": [
                {"field": "has_disability", "op": "==", "value": True},
                {"field": "disability_percentage", "op": ">=", "value": 80},
                {"field": "age", "op": ">=", "value": 18},
                {"field": "age", "op": "<=", "value": 79},
                {"field": "annual_income_band", "op": "in", "value": ["below_100000"]},
            ],
        },
        "benefit_description": "Monthly pension for severe disability (≥80%) BPL persons aged 18–79.",
        "benefit_amount": "₹300/month (central) + state top-up",
        "required_documents": [
            "Aadhaar card",
            "Disability certificate (≥80%)",
            "Age proof",
            "BPL card",
            "Bank passbook",
        ],
        "application_authority": "District Social Welfare / DDRC",
        "source_document_url": "https://nsap.nic.in/Guidelines/NSAP_guidelines2014.pdf",
        "last_verified_date": "2024-03-01",
        "status": "PUBLISHED",
    },
    # ─── Agriculture ───────────────────────────────────────────────────────
    {
        "scheme_id": "pm_kisan",
        "scheme_name": "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
        "category": "agriculture",
        "jurisdiction": "central",
        "predicate": {
            "operator": "AND",
            "conditions": [
                {"field": "occupation_category", "op": "==", "value": "farmer"},
                {"field": "land_owned_acres", "op": ">", "value": 0},
            ],
        },
        "benefit_description": "₹6,000/year income support for land-holding farmer families.",
        "benefit_amount": "₹6,000/year in 3 instalments",
        "required_documents": [
            "Aadhaar card",
            "Land record / Khasra-Khatauni",
            "Bank account details",
            "Mobile number linked to Aadhaar",
        ],
        "application_authority": "CSC / Agriculture department",
        "source_document_url": "https://pmkisan.gov.in/Documents/RevisedPM-KISANoperationalGuidelines.pdf",
        "last_verified_date": "2024-06-01",
        "status": "PUBLISHED",
    },
    {
        "scheme_id": "fasal_bima",
        "scheme_name": "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
        "category": "agriculture",
        "jurisdiction": "central",
        "predicate": {
            "operator": "AND",
            "conditions": [
                {"field": "occupation_category", "op": "==", "value": "farmer"},
                {"field": "land_owned_acres", "op": ">", "value": 0},
            ],
        },
        "benefit_description": "Crop insurance at minimal premium for loanee and non-loanee farmers.",
        "benefit_amount": "Up to full sum insured on crop loss",
        "required_documents": [
            "Land record",
            "Bank account",
            "Aadhaar",
            "Crop sown declaration",
        ],
        "application_authority": "Nearest bank / CSC / Agriculture office",
        "source_document_url": "https://pmfby.gov.in/pdf/PMFBY_Operational_Guidelines_2023.pdf",
        "last_verified_date": "2024-01-01",
        "status": "PUBLISHED",
    },
    {
        "scheme_id": "kcc",
        "scheme_name": "Kisan Credit Card (KCC)",
        "category": "agriculture",
        "jurisdiction": "central",
        "predicate": {
            "operator": "AND",
            "conditions": [
                {"field": "occupation_category", "op": "in", "value": ["farmer", "self_employed"]},
                {"field": "land_owned_acres", "op": ">", "value": 0},
            ],
        },
        "benefit_description": "Short-term credit for crop cultivation, post-harvest needs, and allied activities.",
        "benefit_amount": "Credit limit up to ₹3 lakh at 4% p.a. (with interest subvention)",
        "required_documents": [
            "Aadhaar card",
            "Land ownership documents",
            "Passport size photo",
            "Bank account details",
        ],
        "application_authority": "Nearest commercial / cooperative / RRB bank",
        "source_document_url": "https://www.rbi.org.in/Scripts/BS_CircularIndexDisplay.aspx?Id=12086",
        "last_verified_date": "2024-01-01",
        "status": "PUBLISHED",
    },
    {
        "scheme_id": "soil_health_card",
        "scheme_name": "Soil Health Card Scheme",
        "category": "agriculture",
        "jurisdiction": "central",
        "predicate": {
            "operator": "AND",
            "conditions": [
                {"field": "occupation_category", "op": "==", "value": "farmer"},
                {"field": "land_owned_acres", "op": ">", "value": 0},
            ],
        },
        "benefit_description": "Free soil test report with fertilizer recommendations to improve productivity.",
        "benefit_amount": "Free (no monetary benefit — soil health advisory)",
        "required_documents": ["Land record", "Mobile number"],
        "application_authority": "Agriculture department / Krishi Vigyan Kendra",
        "source_document_url": "https://soilhealth.dac.gov.in/home",
        "last_verified_date": "2024-01-01",
        "status": "PUBLISHED",
    },
    # ─── Housing ───────────────────────────────────────────────────────────
    {
        "scheme_id": "pmay_gramin",
        "scheme_name": "Pradhan Mantri Awaas Yojana – Gramin (PMAY-G)",
        "category": "housing",
        "jurisdiction": "central",
        "predicate": {
            "operator": "AND",
            "conditions": [
                {"field": "is_rural", "op": "==", "value": True},
                {"field": "annual_income_band", "op": "in", "value": ["below_100000", "100000_300000"]},
            ],
        },
        "benefit_description": "Financial assistance to construct a pucca house for rural BPL households.",
        "benefit_amount": "₹1.20–₹1.50 lakh (plains/hilly areas)",
        "required_documents": [
            "Aadhaar card",
            "BPL certificate",
            "SECC survey entry",
            "Bank account",
            "Caste certificate (for priority)",
        ],
        "application_authority": "Gram Panchayat / Block Development Office",
        "source_document_url": "https://pmayg.nic.in/netiay/Uploaded/AwaasGramin.pdf",
        "last_verified_date": "2024-04-01",
        "status": "PUBLISHED",
    },
    {
        "scheme_id": "pmay_urban",
        "scheme_name": "Pradhan Mantri Awaas Yojana – Urban (PMAY-U)",
        "category": "housing",
        "jurisdiction": "central",
        "predicate": {
            "operator": "AND",
            "conditions": [
                {"field": "is_rural", "op": "==", "value": False},
                {"field": "annual_income_band", "op": "in", "value": ["below_100000", "100000_300000"]},
            ],
        },
        "benefit_description": "Credit-linked subsidy and in-situ rehabilitation for urban EWS/LIG households.",
        "benefit_amount": "Up to ₹2.67 lakh interest subsidy (EWS)",
        "required_documents": [
            "Aadhaar card",
            "Income certificate",
            "Property documents",
            "Bank passbook",
        ],
        "application_authority": "Urban Local Body / HUDCO / Banks",
        "source_document_url": "https://pmaymis.gov.in",
        "last_verified_date": "2024-04-01",
        "status": "PUBLISHED",
    },
    # ─── Disability & Health ────────────────────────────────────────────────
    {
        "scheme_id": "adip",
        "scheme_name": "Assistance to Disabled Persons (ADIP) — Aids & Appliances",
        "category": "disability",
        "jurisdiction": "central",
        "predicate": {
            "operator": "AND",
            "conditions": [
                {"field": "has_disability", "op": "==", "value": True},
                {"field": "disability_percentage", "op": ">=", "value": 40},
                {"field": "annual_income_band", "op": "in", "value": ["below_100000", "100000_300000"]},
            ],
        },
        "benefit_description": "Free assistive devices and appliances for persons with benchmark disabilities.",
        "benefit_amount": "Devices worth ₹8,000–₹12,000 depending on type",
        "required_documents": [
            "Disability certificate (≥40%)",
            "Income certificate",
            "Aadhaar card",
            "Doctor prescription for device",
            "Recent photograph",
        ],
        "application_authority": "District Disability Rehabilitation Centre (DDRC)",
        "source_document_url": "https://disabilityaffairs.gov.in/content/page/adip-scheme.php",
        "last_verified_date": "2024-01-01",
        "status": "PUBLISHED",
    },
    {
        "scheme_id": "udid_card",
        "scheme_name": "Unique Disability ID (UDID) Card",
        "category": "disability",
        "jurisdiction": "central",
        "predicate": {
            "operator": "AND",
            "conditions": [
                {"field": "has_disability", "op": "==", "value": True},
                {"field": "disability_percentage", "op": ">=", "value": 40},
            ],
        },
        "benefit_description": "National ID card enabling access to all disability welfare schemes and concessions.",
        "benefit_amount": "Free card (gateway to other scheme benefits)",
        "required_documents": [
            "Disability certificate",
            "Aadhaar card",
            "Photograph",
            "Medical records",
        ],
        "application_authority": "District CMO office / DDRC / Online at swavlambancard.gov.in",
        "source_document_url": "https://swavlambancard.gov.in",
        "last_verified_date": "2024-01-01",
        "status": "PUBLISHED",
    },
    {
        "scheme_id": "nhfdc_loan",
        "scheme_name": "NHFDC Loan Scheme for Persons with Disabilities",
        "category": "disability",
        "jurisdiction": "central",
        "predicate": {
            "operator": "AND",
            "conditions": [
                {"field": "has_disability", "op": "==", "value": True},
                {"field": "disability_percentage", "op": ">=", "value": 40},
                {"field": "age", "op": ">=", "value": 18},
                {"field": "annual_income_band", "op": "in", "value": ["below_100000", "100000_300000", "300000_800000"]},
            ],
        },
        "benefit_description": "Concessional loans for self-employment and education for disabled persons.",
        "benefit_amount": "Loan up to ₹50 lakh at 5% p.a.",
        "required_documents": [
            "UDID / Disability certificate",
            "Income proof",
            "Project report (for business loans)",
            "Aadhaar card",
        ],
        "application_authority": "NHFDC State Channelising Agency",
        "source_document_url": "https://nhfdc.nic.in/loan-scheme",
        "last_verified_date": "2024-01-01",
        "status": "PUBLISHED",
    },
    {
        "scheme_id": "pm_jan_arogya",
        "scheme_name": "PM Jan Arogya Yojana / Ayushman Bharat (PMJAY)",
        "category": "health",
        "jurisdiction": "central",
        "predicate": {
            "operator": "AND",
            "conditions": [
                {"field": "annual_income_band", "op": "in", "value": ["below_100000", "100000_300000"]},
                {"field": "social_category", "op": "in", "value": ["sc", "st", "obc"]},
            ],
        },
        "benefit_description": "Health insurance coverage up to ₹5 lakh/year per family for secondary and tertiary hospitalisation.",
        "benefit_amount": "₹5 lakh/year per family (cashless at empanelled hospitals)",
        "required_documents": [
            "Aadhaar card",
            "Ration card / SECC listing",
            "Family composition document",
        ],
        "application_authority": "Ayushman Mitra at empanelled hospital / CSC",
        "source_document_url": "https://pmjay.gov.in",
        "last_verified_date": "2024-04-01",
        "status": "PUBLISHED",
    },
    # ─── Education ─────────────────────────────────────────────────────────
    {
        "scheme_id": "nsp_pre_matric",
        "scheme_name": "National Scholarship — Pre-Matric (SC/ST/OBC)",
        "category": "education",
        "jurisdiction": "central",
        "predicate": {
            "operator": "AND",
            "conditions": [
                {"field": "age", "op": "<=", "value": 20},
                {"field": "social_category", "op": "in", "value": ["sc", "st", "obc"]},
                {"field": "annual_income_band", "op": "in", "value": ["below_100000", "100000_300000"]},
            ],
        },
        "benefit_description": "Scholarship for SC/ST/OBC students in classes 1–10 to reduce dropout rates.",
        "benefit_amount": "₹1,000–₹3,500/year depending on class and category",
        "required_documents": [
            "Caste certificate",
            "Income certificate",
            "School enrollment certificate",
            "Bank passbook",
            "Aadhaar card",
        ],
        "application_authority": "National Scholarship Portal (scholarships.gov.in)",
        "source_document_url": "https://scholarships.gov.in",
        "last_verified_date": "2024-06-01",
        "status": "PUBLISHED",
    },
    {
        "scheme_id": "nsp_post_matric",
        "scheme_name": "National Scholarship — Post-Matric (SC/ST/OBC)",
        "category": "education",
        "jurisdiction": "central",
        "predicate": {
            "operator": "AND",
            "conditions": [
                {"field": "age", "op": "<=", "value": 30},
                {"field": "social_category", "op": "in", "value": ["sc", "st", "obc"]},
                {"field": "annual_income_band", "op": "in", "value": ["below_100000", "100000_300000"]},
            ],
        },
        "benefit_description": "Scholarship for SC/ST/OBC students in class 11 and above including professional courses.",
        "benefit_amount": "Up to ₹30,000/year (varies by course and category)",
        "required_documents": [
            "Caste certificate",
            "Income certificate",
            "Bonafide certificate from institution",
            "Bank passbook",
            "Aadhaar card",
        ],
        "application_authority": "National Scholarship Portal (scholarships.gov.in)",
        "source_document_url": "https://scholarships.gov.in",
        "last_verified_date": "2024-06-01",
        "status": "PUBLISHED",
    },
    {
        "scheme_id": "mid_day_meal",
        "scheme_name": "PM POSHAN (Mid-Day Meal Scheme)",
        "category": "education",
        "jurisdiction": "central",
        "predicate": {
            "operator": "AND",
            "conditions": [
                {"field": "age", "op": "<=", "value": 14},
                {"field": "annual_income_band", "op": "in", "value": ["below_100000", "100000_300000"]},
            ],
        },
        "benefit_description": "Free nutritious cooked meals to children in government and government-aided schools.",
        "benefit_amount": "Free meal (school enrolment benefit)",
        "required_documents": ["School enrollment (automatic entitlement for enrolled students)"],
        "application_authority": "School headmaster / District Education Officer",
        "source_document_url": "https://pmposhan.education.gov.in",
        "last_verified_date": "2024-01-01",
        "status": "PUBLISHED",
    },
    # ─── Income Support / Welfare ───────────────────────────────────────────
    {
        "scheme_id": "nfsa_pds",
        "scheme_name": "National Food Security Act — Priority Household Ration",
        "category": "income_support",
        "jurisdiction": "central",
        "predicate": {
            "operator": "AND",
            "conditions": [
                {"field": "annual_income_band", "op": "in", "value": ["below_100000"]},
                {"field": "is_rural", "op": "==", "value": True},
            ],
        },
        "benefit_description": "Subsidised foodgrains (5 kg/person/month) at ₹1–3/kg for PHH ration card holders.",
        "benefit_amount": "5 kg/person/month at effectively zero cost (PMGKAY extension)",
        "required_documents": [
            "Application to Tehsil / Circle office",
            "Aadhaar card",
            "Proof of residence",
            "Income self-declaration",
        ],
        "application_authority": "Tehsil / Circle Office / Fair Price Shop",
        "source_document_url": "https://dfpd.gov.in/nfsa.htm",
        "last_verified_date": "2024-01-01",
        "status": "PUBLISHED",
    },
    {
        "scheme_id": "mgnregs",
        "scheme_name": "Mahatma Gandhi NREGS (MGNREGA)",
        "category": "income_support",
        "jurisdiction": "central",
        "predicate": {
            "operator": "AND",
            "conditions": [
                {"field": "is_rural", "op": "==", "value": True},
                {"field": "age", "op": ">=", "value": 18},
                {"field": "occupation_category", "op": "in", "value": ["daily_wage_labor", "unemployed", "farmer", "other"]},
            ],
        },
        "benefit_description": "Guaranteed 100 days of wage employment per year to rural adult members of any household.",
        "benefit_amount": "State-notified minimum wage (₹200–₹360/day depending on state)",
        "required_documents": [
            "Aadhaar card",
            "Job card application to Gram Panchayat",
            "Proof of residence",
            "Bank / post office account",
        ],
        "application_authority": "Gram Panchayat",
        "source_document_url": "https://nrega.nic.in",
        "last_verified_date": "2024-01-01",
        "status": "PUBLISHED",
    },
    {
        "scheme_id": "pm_ujjwala",
        "scheme_name": "PM Ujjwala Yojana (PMUY) — Free LPG Connection",
        "category": "income_support",
        "jurisdiction": "central",
        "predicate": {
            "operator": "AND",
            "conditions": [
                {"field": "gender", "op": "==", "value": "female"},
                {"field": "annual_income_band", "op": "in", "value": ["below_100000"]},
                {"field": "age", "op": ">=", "value": 18},
            ],
        },
        "benefit_description": "Free LPG connection with one cylinder and stove to BPL women.",
        "benefit_amount": "One free LPG connection (cylinder + stove deposit waived)",
        "required_documents": [
            "Aadhaar card",
            "BPL ration card",
            "Bank passbook",
            "Passport size photo",
        ],
        "application_authority": "Nearest LPG dealer / OMC office",
        "source_document_url": "https://pmuy.gov.in",
        "last_verified_date": "2024-01-01",
        "status": "PUBLISHED",
    },
    {
        "scheme_id": "pm_jan_dhan",
        "scheme_name": "Pradhan Mantri Jan Dhan Yojana (PMJDY)",
        "category": "income_support",
        "jurisdiction": "central",
        "predicate": {
            "operator": "AND",
            "conditions": [
                {"field": "annual_income_band", "op": "in", "value": ["below_100000", "100000_300000"]},
                {"field": "age", "op": ">=", "value": 10},
            ],
        },
        "benefit_description": "Zero-balance bank account with RuPay card, ₹2 lakh accident insurance, ₹30,000 life cover.",
        "benefit_amount": "₹2 lakh accident insurance + ₹30,000 life cover (free)",
        "required_documents": ["Aadhaar card", "Passport size photo"],
        "application_authority": "Any bank branch / Business Correspondent / CSC",
        "source_document_url": "https://pmjdy.gov.in",
        "last_verified_date": "2024-01-01",
        "status": "PUBLISHED",
    },
    {
        "scheme_id": "pm_life_insurance",
        "scheme_name": "Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)",
        "category": "income_support",
        "jurisdiction": "central",
        "predicate": {
            "operator": "AND",
            "conditions": [
                {"field": "age", "op": ">=", "value": 18},
                {"field": "age", "op": "<=", "value": 50},
                {"field": "annual_income_band", "op": "in", "value": ["below_100000", "100000_300000"]},
            ],
        },
        "benefit_description": "₹2 lakh term life insurance at ₹436/year premium for any bank account holder.",
        "benefit_amount": "₹2 lakh on death (any cause)",
        "required_documents": ["Bank account with auto-debit mandate", "Aadhaar card"],
        "application_authority": "Bank branch / CSC",
        "source_document_url": "https://financialservices.gov.in/insurance-divisions/Government-Sponsored-Socially-Oriented-Insurance-Schemes/Pradhan-Mantri-Jeevan-Jyoti-Bima-Yojana(PMJJBY)",
        "last_verified_date": "2024-01-01",
        "status": "PUBLISHED",
    },
    {
        "scheme_id": "pm_accident_insurance",
        "scheme_name": "Pradhan Mantri Suraksha Bima Yojana (PMSBY)",
        "category": "income_support",
        "jurisdiction": "central",
        "predicate": {
            "operator": "AND",
            "conditions": [
                {"field": "age", "op": ">=", "value": 18},
                {"field": "age", "op": "<=", "value": 70},
                {"field": "annual_income_band", "op": "in", "value": ["below_100000", "100000_300000"]},
            ],
        },
        "benefit_description": "Accidental death and disability insurance at ₹20/year premium.",
        "benefit_amount": "₹2 lakh on accidental death; ₹1 lakh on partial disability",
        "required_documents": ["Bank account with auto-debit mandate", "Aadhaar card"],
        "application_authority": "Bank branch / CSC",
        "source_document_url": "https://jansuraksha.gov.in/Files/PMSBY/English/Scheme-Details.pdf",
        "last_verified_date": "2024-01-01",
        "status": "PUBLISHED",
    },
    {
        "scheme_id": "sc_st_scholarship_rajasthan",
        "scheme_name": "Rajasthan SC/ST Post-Matric Scholarship",
        "category": "education",
        "jurisdiction": "state:rajasthan",
        "predicate": {
            "operator": "AND",
            "conditions": [
                {"field": "state", "op": "==", "value": "Rajasthan"},
                {"field": "social_category", "op": "in", "value": ["sc", "st"]},
                {"field": "age", "op": "<=", "value": 30},
                {"field": "annual_income_band", "op": "in", "value": ["below_100000", "100000_300000"]},
            ],
        },
        "benefit_description": "State-level scholarship supplementing central scheme for SC/ST students in Rajasthan.",
        "benefit_amount": "₹10,000–₹20,000/year depending on course",
        "required_documents": [
            "Caste certificate (Rajasthan)",
            "Income certificate",
            "Institutional enrollment proof",
            "Aadhaar card",
            "Bank passbook",
        ],
        "application_authority": "Social Justice & Empowerment Department, Rajasthan",
        "source_document_url": "https://sje.rajasthan.gov.in/schemes",
        "last_verified_date": "2024-01-01",
        "status": "PUBLISHED",
    },
    {
        "scheme_id": "rajasthan_bpl_housing",
        "scheme_name": "Mukhyamantri Awas Yojana — Rajasthan (SC/ST BPL)",
        "category": "housing",
        "jurisdiction": "state:rajasthan",
        "predicate": {
            "operator": "AND",
            "conditions": [
                {"field": "state", "op": "==", "value": "Rajasthan"},
                {"field": "social_category", "op": "in", "value": ["sc", "st"]},
                {"field": "annual_income_band", "op": "in", "value": ["below_100000"]},
                {"field": "is_rural", "op": "==", "value": True},
            ],
        },
        "benefit_description": "State housing scheme for SC/ST BPL families in Rajasthan rural areas.",
        "benefit_amount": "₹1.20 lakh (plains) — complements PMAY-G",
        "required_documents": [
            "Caste certificate",
            "BPL certificate",
            "Aadhaar card",
            "Land ownership / site document",
            "Bank passbook",
        ],
        "application_authority": "Gram Panchayat / District Collector Office",
        "source_document_url": "https://rajasthan.gov.in/housing-schemes",
        "last_verified_date": "2024-01-01",
        "status": "PUBLISHED",
    },
    {
        "scheme_id": "pm_matru_vandana",
        "scheme_name": "Pradhan Mantri Matru Vandana Yojana (PMMVY)",
        "category": "income_support",
        "jurisdiction": "central",
        "predicate": {
            "operator": "AND",
            "conditions": [
                {"field": "gender", "op": "==", "value": "female"},
                {"field": "age", "op": ">=", "value": 19},
                {"field": "annual_income_band", "op": "in", "value": ["below_100000", "100000_300000"]},
            ],
        },
        "benefit_description": "Cash benefit of ₹5,000 for pregnant and lactating women for first live birth.",
        "benefit_amount": "₹5,000 in three instalments",
        "required_documents": [
            "Aadhaar card",
            "Bank passbook",
            "MCH (Maternal Child Health) card",
            "Anganwadi registration",
        ],
        "application_authority": "Anganwadi Centre / CDPO office",
        "source_document_url": "https://wcd.nic.in/schemes/pradhan-mantri-matru-vandana-yojana",
        "last_verified_date": "2024-01-01",
        "status": "PUBLISHED",
    },
]

# Add IGNOAPS (already seeded separately but include for completeness)
IGNOAPS = {
    "scheme_id": "ignoaps",
    "scheme_name": "Indira Gandhi National Old Age Pension Scheme (IGNOAPS)",
    "category": "pension",
    "jurisdiction": "central",
    "predicate": {
        "operator": "AND",
        "conditions": [
            {"field": "age", "op": ">=", "value": 60},
            {"field": "annual_income_band", "op": "in", "value": ["below_100000"]},
        ],
    },
    "benefit_description": "Monthly pension to destitute elderly BPL persons.",
    "benefit_amount": "₹200–₹500/month + state top-up",
    "required_documents": [
        "Aadhaar card copy",
        "Age proof",
        "BPL ration card",
        "Bank passbook copy",
        "Self-declaration form",
    ],
    "application_authority": "District Social Welfare Office / Gram Panchayat",
    "source_document_url": "https://nsap.nic.in/Guidelines/NSAP_guidelines2014.pdf",
    "last_verified_date": "2024-03-01",
    "status": "PUBLISHED",
}

all_schemes = [IGNOAPS] + SCHEMES

written = 0
skipped = 0
for scheme in all_schemes:
    path = os.path.join(SCHEMES_DIR, f"{scheme['scheme_id']}.json")
    if os.path.exists(path):
        skipped += 1
        continue
    with open(path, "w", encoding="utf-8") as f:
        json.dump(scheme, f, indent=2, ensure_ascii=False, default=str)
    written += 1

print(f"✅ Seeded {written} scheme(s), skipped {skipped} existing. Total: {len(all_schemes)}")
