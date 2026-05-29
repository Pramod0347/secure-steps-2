export type Country = 'usa' | 'uk' | 'australia' | 'europe' | 'new-zealand'
export type EuropeCountry = 'germany' | 'france' | 'netherlands' | 'spain' | 'italy'

export interface ChecklistGroup {
  title: string
  items: string[]
}

export interface VisaFramework {
  name: string
  flag: string
  visaFee: string
  process: string[]
  checklist: ChecklistGroup[]
}

export interface EuropeVisaFramework {
  name: string
  visaFee: string
  process: string[]
  checklist: ChecklistGroup[]
}

export const visaFrameworkData: Record<Exclude<Country, 'europe'>, VisaFramework> = {
  usa: {
    name: 'United States',
    flag: '🇺🇸',
    visaFee: 'MRV: $185 + SEVIS I-901: $350',
    process: [
      'Secure SEVIS Form I-20 from a SEVP-approved institution.',
      'Pay SEVIS I-901 fee ($350) and save receipt.',
      'Complete DS-160 and print barcode confirmation page.',
      'Pay MRV visa fee ($185) through scheduling portal.',
      'Book VAC/OFC biometrics and consular interview slots.',
      'Attend VAC/OFC biometrics at least one day before interview.',
      'Attend consular interview focused on student intent and financial stability.',
    ],
    checklist: [
      {
        title: 'Immigration Forms',
        items: ['Valid passport', 'Printed DS-160 confirmation', 'Visa appointment confirmation'],
      },
      {
        title: 'Institutional Receipts',
        items: ['Original signed Form I-20', 'SEVIS fee receipt'],
      },
      {
        title: 'Academic Records',
        items: [
          '10th/12th/Bachelor transcripts and certificates',
          'GRE/GMAT/SAT and IELTS/TOEFL/Duolingo scores',
        ],
      },
      {
        title: 'Financial Proofs',
        items: [
          '1 year Cost of Attendance evidence',
          'Bank statements/FDs/loan sanction letters + sponsor affidavit',
        ],
      },
    ],
  },
  uk: {
    name: 'United Kingdom',
    flag: '🇬🇧',
    visaFee: 'Visa: £490 + IHS: £776/year',
    process: [
      'Obtain CAS (14-digit Confirmation of Acceptance for Studies).',
      'Maintain funds untouched for 28 consecutive days.',
      'Submit GOV.UK application and pay visa + IHS charges.',
      'Book VFS Global biometrics appointment.',
      'Upload supporting documents to VFS portal.',
      'Attend biometrics and credibility interview if requested.',
    ],
    checklist: [
      {
        title: 'Immigration Details',
        items: ['Valid passport', 'Official CAS statement'],
      },
      {
        title: 'Medical & Security',
        items: ['TB certificate from UKVI-approved clinic', 'ATAS clearance for eligible STEM programs'],
      },
      {
        title: 'Academic Background',
        items: ['Certificates/transcripts listed as offer evidence in CAS'],
      },
      {
        title: 'Maintenance Funds',
        items: [
          'Tuition balance + living cost evidence',
          'London: £1,334/month; Outside London: £1,023/month (up to 9 months)',
          'Funds must be held for 28 days',
        ],
      },
    ],
  },
  australia: {
    name: 'Australia',
    flag: '🇦🇺',
    visaFee: 'Student Visa (Subclass 500): AUD $1,600',
    process: [
      'Obtain eCoE after tuition deposit and Genuine Student vetting.',
      'Purchase OSHC for full visa duration.',
      'Create ImmiAccount and complete online application.',
      'Pay base visa fee and submit application.',
      'Generate HAP ID and complete medical checkups.',
      'Attend biometrics at VFS/AVAC when instructed.',
    ],
    checklist: [
      {
        title: 'Core Enrolment',
        items: ['Valid passport', 'Official eCoE', 'OSHC policy certificate'],
      },
      {
        title: 'Genuine Student (GS)',
        items: ['GS documentary proof', 'Responses covering study path, career value, and home ties'],
      },
      {
        title: 'Financial Capacity',
        items: [
          'Travel funds: AUD $2,000',
          '12 months tuition + living funds (AUD $29,710/year)',
          'Bank savings or education loan evidence',
        ],
      },
      {
        title: 'Academics & Gaps',
        items: ['Transcripts/degrees + IELTS/PTE', 'Work proofs (payslips/tax returns) for gap clarification'],
      },
    ],
  },
  'new-zealand': {
    name: 'New Zealand',
    flag: '🇳🇿',
    visaFee: 'Fee-Paying Student Visa (INZ portal rates)',
    process: [
      'Secure unconditional Offer of Place and tuition invoice.',
      'Create profile and start visa form on INZ portal.',
      'Upload full dossier and pay visa + levy fees.',
      'Complete panel medicals and chest X-ray via eMedical.',
      'Receive Approval in Principle (AIP).',
      'Pay full first-year tuition and upload official receipt to INZ.',
      'Receive electronic Fee-Paying Student Visa (eVisa) after verification.',
    ],
    checklist: [
      {
        title: 'Offer & Clearances',
        items: ['Valid passport', 'NZQA Offer of Place', 'eMedical confirmation', 'PCC for age 17+'],
      },
      {
        title: 'Financial Maintenance',
        items: [
          'NZD $20,000/year for living expenses',
          'NZD $1,500 outward travel funds',
          'Education loan or 6 months verified bank statements',
        ],
      },
      {
        title: 'Academic & Intent',
        items: ['Transcripts/degrees + IELTS/PTE', 'SOP showing genuine temporary entry intent'],
      },
    ],
  },
}

export const europeFrameworkData: Record<EuropeCountry, EuropeVisaFramework> = {
  germany: {
    name: 'Germany',
    visaFee: 'National Visa (Type D) via Embassy/VFS',
    process: [
      'Secure admission letter or university application confirmation.',
      'Open blocked account and deposit €11,904 (provider examples: Fintiba, Expatrio, Coracle).',
      'Arrange incoming/travel health insurance.',
      'Book National Visa (Type D) appointment via VFS/Embassy.',
      'Attend interview, submit documents, and complete biometrics.',
    ],
    checklist: [
      {
        title: 'Identity & Admission',
        items: ['Valid passport', 'National Visa forms', 'University admission letter'],
      },
      {
        title: 'Financial Guarantee',
        items: ['Blocked account confirmation (€11,904 / €992 monthly)', 'Or sponsorship (Verpflichtungserklärung)'],
      },
      {
        title: 'Academic Progression',
        items: ['Transcripts/degrees', 'Language proof (IELTS or German CEFR)'],
      },
    ],
  },
  france: {
    name: 'France',
    visaFee: 'Long-Stay Student Visa via Campus France + VFS',
    process: [
      "Create Etudes en France profile and pass Campus France interview.",
      'Complete France-Visas long-stay form and print receipt.',
      'Book VFS appointment at regional center.',
      'Submit physical documents, pay fees, and provide biometrics.',
    ],
    checklist: [
      {
        title: 'Identity & Portal Records',
        items: ['Valid passport', 'France-Visas receipt', 'Campus France attestation'],
      },
      {
        title: 'Institutional Admission',
        items: ['Official enrollment/acceptance certificate via Etudes en France'],
      },
      {
        title: 'Financial Sufficiency',
        items: ['Minimum €615/month (€7,380/year) via bank or loan evidence'],
      },
      {
        title: 'Accommodation Proof',
        items: ['Housing proof for first 3 months (hotel/lease/host certificate)'],
      },
    ],
  },
  netherlands: {
    name: 'Netherlands',
    visaFee: 'University-Sponsored MVV/VVR via IND',
    process: [
      'University initiates MVV and VVR application with IND.',
      'Pay institutional invoice (full first-year tuition + living costs at €1,218/month).',
      'Wait for IND decision (typically 2-4 weeks).',
      'Book VFS appointment for MVV sticker after approval.',
      'Collect sticker, travel, and collect VVR card on arrival.',
    ],
    checklist: [
      {
        title: 'Identity & Forms',
        items: ['Valid passport', 'Antecedents Certificate', 'MVV issue forms'],
      },
      {
        title: 'Sponsorship Documents',
        items: ['IND notification confirming university sponsorship status'],
      },
      {
        title: 'Academic Records',
        items: ['Apostilled transcripts/degrees', 'IELTS/PTE score sheets'],
      },
      {
        title: 'Financial Sufficiency',
        items: ['University confirmation of received/verified funds (€14,616/year living + tuition)'],
      },
    ],
  },
  spain: {
    name: 'Spain',
    visaFee: 'National Student Visa via BLS/Consulate',
    process: [
      'Secure acceptance from authorized educational center.',
      'Apostille documents, PCC, and obtain medical certificate.',
      'Book BLS International appointment.',
      'Submit documents, pay fee, and attend screening interview.',
      'Collect visa and apply for TIE within 30 days of arrival.',
    ],
    checklist: [
      {
        title: 'Identity & Enrolment',
        items: ['National visa form', 'Recent photos', 'Valid passport', 'Carta de Admisión'],
      },
      {
        title: 'Legalized Clearances',
        items: ['Apostilled PCC (last 5 years)', 'Medical certificate per IHR 2005'],
      },
      {
        title: 'Health Insurance',
        items: ['Spain-authorized insurer with zero co-pay and zero deductible'],
      },
      {
        title: 'Financial Maintenance',
        items: ['100% IPREM: at least €600/month (€7,200/year) via bank/sponsor/loan'],
      },
    ],
  },
  italy: {
    name: 'Italy',
    visaFee: 'National Visa (Type D) via Universitaly + VFS',
    process: [
      'Submit pre-enrollment on Universitaly portal.',
      'Obtain DOV or CIMEA comparability statement.',
      'Book VFS slot after embassy-forwarded validation.',
      'Submit dossier, pay visa fee, and complete biometrics.',
      'Apply for Permesso di Soggiorno within 8 days of arrival.',
    ],
    checklist: [
      {
        title: 'Identity & Pre-Enrollment',
        items: ['Type D visa form', 'Valid passport', 'Universitaly summary application'],
      },
      {
        title: 'Academic & Legal Status',
        items: ['Validated transcripts/degrees', 'DOV or CIMEA', 'Course-matched language certificates'],
      },
      {
        title: 'Financial Sufficiency',
        items: ['Minimum €6,000/year (about €460-€500/month) via bank/scholarship evidence'],
      },
      {
        title: 'Insurance',
        items: ['Medical insurance for urgent care and hospitalization for full stay'],
      },
    ],
  },
}

export const countrySelector: { value: Country; name: string; flag: string }[] = [
  { value: 'usa', name: 'United States', flag: '🇺🇸' },
  { value: 'uk', name: 'United Kingdom', flag: '🇬🇧' },
  { value: 'australia', name: 'Australia', flag: '🇦🇺' },
  { value: 'europe', name: 'Europe', flag: '🇪🇺' },
  { value: 'new-zealand', name: 'New Zealand', flag: '🇳🇿' },
]

export const europeSelector: { value: EuropeCountry; name: string }[] = [
  { value: 'germany', name: 'Germany' },
  { value: 'france', name: 'France' },
  { value: 'netherlands', name: 'Netherlands' },
  { value: 'spain', name: 'Spain' },
  { value: 'italy', name: 'Italy' },
]
