/* ─────────────────────────────────────────────────────────────────────────
 * Youth Employment Canada — Job board data & types
 * In a production app these would come from an API / database.
 * ───────────────────────────────────────────────────────────────────────── */

export type EmploymentType =
  | 'Full-time'
  | 'Part-time'
  | 'Contract'
  | 'Casual / Seasonal'
  | 'Volunteer';

export type Category =
  | 'Health & Social Services'
  | 'Education & Training'
  | 'Administration & Office'
  | 'Trades & Construction'
  | 'Technology & IT'
  | 'Natural Resources'
  | 'Arts & Culture'
  | 'Business & Finance'
  | 'Government & Public Service'
  | 'Hospitality & Tourism'
  | 'Restaurant and Food Service';

export interface Job {
  [x: string]: any;
  descriptionHtml: string;
  requirementsHtml: string | undefined;
  startDate?: string;
  positionType?: string;
  experience?: string;
  education?: string;
  travel?: string;
  vacation?: string;
  vacancies?: number | null;
  jobPostingDate?: string;
  nocCode?: string;
  contactName?: string;
  contactType?: string;
  contactCompany?: string;
  id: string;
  jobUniqueId?: string;
  title: string;
  company: string;
  location: string;
  province: string;
  employmentType: EmploymentType;
  category: Category;
  salary: string;
  remote: boolean;
  indigenous: boolean; // Diverse employer
  featured: boolean;
  postedDaysAgo: number;
  closingDate: string;
  description: string;
  responsibilities?: string | string[];
  qualifications?: string | string[];
  preferred?: string | string[];
  benefits?: string | string[];
  requirements?: string;
  applyEmail?: string;
  // Flat backend fields for application methods
  applyByEmail?: boolean;
  applyByMail?: boolean;
  applyByPhone?: boolean;
  applyInPerson?: boolean;
  applicationEmail?: string;
  applicationPhone?: string;
  mailingAddress?: string;
  inPersonAddress?: string;
  inPersonFromTime?: string;
  inPersonToTime?: string;
  apply_by_email?: boolean;
  apply_by_mail?: boolean;
  apply_by_phone?: boolean;
  apply_in_person?: boolean;
  application_email?: string;
  application_phone?: string;
  mailing_address?: string;
  in_person_address?: string;
  in_person_from_time?: string;
  in_person_to_time?: string;
  howToApply?: {
    byEmail: boolean;
    email: string | null;
    byMail: boolean;
    mailingAddress: string | null;
    byPhone: boolean;
    phone: string | null;
    inPerson: boolean;
    inPersonAddress: string | null;
    inPersonFromTime: string | null;
    inPersonToTime: string | null;
  };
  website?: string;
}

export const ALL_CATEGORIES: Category[] = [
  'Health & Social Services',
  'Education & Training',
  'Administration & Office',
  'Trades & Construction',
  'Technology & IT',
  'Natural Resources',
  'Arts & Culture',
  'Business & Finance',
  'Government & Public Service',
  'Hospitality & Tourism',
  'Restaurant and Food Service',
];

export const ALL_PROVINCES = [
  'Alberta',
  'British Columbia',
  'Manitoba',
  'New Brunswick',
  'Newfoundland & Labrador',
  'Northwest Territories',
  'Nova Scotia',
  'Nunavut',
  'Ontario',
  'Prince Edward Island',
  'Québec',
  'Saskatchewan',
  'Yukon',
];

export const ALL_TYPES: EmploymentType[] = [
  'Full-time',
  'Part-time',
  'Contract',
  'Casual / Seasonal',
  'Volunteer',
];

export const JOBS: Job[] = [
  {
    id: 'j001',
    title: 'Community Health Worker',
    company: 'Maskwacis Health Services',
    location: 'Maskwacis',
    province: 'Alberta',
    employmentType: 'Full-time',
    category: 'Health & Social Services',
    salary: '$52,000 – $64,000 / year',
    remote: false,
    indigenous: true,
    featured: true,
    postedDaysAgo: 2,
    closingDate: 'June 15, 2026',
    description: 'Maskwacis Health Services is seeking a compassionate and culturally grounded Community Health Worker to support the health and wellness of our community members. You will work alongside our multidisciplinary team to deliver holistic, culturally safe health programs.',
    responsibilities: [
      'Conduct home visits and wellness checks for community members',
      'Assist clients in navigating health and social services',
      'Facilitate health education workshops and group programs',
      'Maintain accurate client records and program documentation',
      'Collaborate with Elders, knowledge keepers, and health professionals',
    ],
    qualifications: [
      'Certificate or diploma in Community Health, Social Work, or related field',
      'Minimum 2 years experience in a community health or social services role',
      'Strong understanding of Indigenous health and wellness frameworks',
      "Valid Class 5 driver's licence and reliable vehicle",
    ],
    preferred: [
      'Knowledge of Cree language or culture',
      'Experience working within a First Nations community',
      'Mental Health First Aid certification',
    ],
    benefits: [
      'Comprehensive health and dental benefits',
      'RRSP matching program',
      'Cultural leave days',
      'Professional development funding',
    ],
    applyEmail: 'careers@maskwacishealth.ca',
    website: 'https://maskwacishealth.ca',
    descriptionHtml: "",
    requirementsHtml: undefined
  },
  {
    id: 'j002',
    title: 'Indigenous Education Coordinator',
    company: 'Edmonton Public Schools',
    location: 'Edmonton',
    province: 'Alberta',
    employmentType: 'Full-time',
    category: 'Education & Training',
    salary: '$68,000 – $82,000 / year',
    remote: false,
    indigenous: false,
    featured: true,
    postedDaysAgo: 4,
    closingDate: 'June 20, 2026',
    description: 'Edmonton Public Schools is committed to Truth and Reconciliation and is seeking an Indigenous Education Coordinator to lead culturally responsive programming across our school division. This is a meaningful leadership role supporting Indigenous students, families, and staff.',
    responsibilities: [
      'Develop and implement Indigenous education strategies across the division',
      'Support classroom teachers in integrating Indigenous perspectives into curriculum',
      'Build relationships with Indigenous families, Elders, and community organizations',
      'Lead professional development sessions for staff on cultural competency',
      'Track student outcomes and report on program effectiveness',
    ],
    qualifications: [
      "Bachelor's degree in Education, Indigenous Studies, or related field",
      'Minimum 3 years experience in an educational or community role',
      'Deep knowledge of TRC Calls to Action and UNDRIP',
      'Strong facilitation and communication skills',
    ],
    preferred: [
      'Teaching certification in Alberta',
      'Experience with curriculum development',
      'Fluency in an Indigenous language',
    ],
    benefits: [
      'Competitive salary with annual increments',
      'Full benefits package',
      'Pension plan',
      'Generous vacation and personal days',
    ],
    applyEmail: 'hr@epsb.ca',
    website: 'https://www.epsb.ca',
    descriptionHtml: "",
    requirementsHtml: undefined
  },
  {
    id: 'j003',
    title: 'Software Developer',
    company: 'Animikii Indigenous Technology',
    location: 'Victoria',
    province: 'British Columbia',
    employmentType: 'Full-time',
    category: 'Technology & IT',
    salary: '$75,000 – $95,000 / year',
    remote: true,
    indigenous: true,
    featured: true,
    postedDaysAgo: 1,
    closingDate: 'June 30, 2026',
    description: 'Animikii is an Indigenous technology company building digital solutions that empower Indigenous communities. We are looking for a skilled Software Developer to join our growing team and help deliver impactful web and mobile applications for our clients across Turtle Island.',
    responsibilities: [
      'Design, develop, and maintain web applications using React and Node.js',
      'Collaborate with designers, project managers, and Indigenous community clients',
      'Participate in code reviews and contribute to technical documentation',
      'Troubleshoot and resolve software defects and performance issues',
      'Contribute to an inclusive, culturally aware team environment',
    ],
    qualifications: [
      "Bachelor's degree in Computer Science or equivalent experience",
      '3+ years of professional software development experience',
      'Proficiency in React, TypeScript, and Node.js',
      'Experience with REST APIs and relational databases',
    ],
    preferred: [
      'Experience working with Indigenous organizations or communities',
      'Knowledge of accessibility standards (WCAG 2.1)',
      'Familiarity with cloud platforms (AWS or Azure)',
    ],
    benefits: [
      'Remote-first work environment',
      'Flexible hours',
      'Health and wellness benefits',
      'Annual learning and development budget',
      'Meaningful mission-driven work',
    ],
    applyEmail: 'jobs@animikii.com',
    website: 'https://www.animikii.com',
    descriptionHtml: "",
    requirementsHtml: undefined
  },
  {
    id: 'j004',
    title: 'Band Administrator',
    company: 'Peguis First Nation',
    location: 'Peguis',
    province: 'Manitoba',
    employmentType: 'Full-time',
    category: 'Government & Public Service',
    salary: '$70,000 – $85,000 / year',
    remote: false,
    indigenous: true,
    featured: false,
    postedDaysAgo: 7,
    closingDate: 'June 10, 2026',
    description: 'Peguis First Nation is seeking an experienced and organized Band Administrator to oversee the day-to-day administrative operations of the band office. The successful candidate will work closely with Chief and Council to ensure effective governance and service delivery.',
    responsibilities: [
      'Manage band office operations and administrative staff',
      'Prepare reports, correspondence, and council meeting minutes',
      'Oversee budget administration and financial reporting',
      'Liaise with federal and provincial government departments',
      'Ensure compliance with band policies and applicable legislation',
    ],
    qualifications: [
      'Post-secondary degree in Business Administration, Public Administration, or related field',
      'Minimum 5 years of senior administrative experience',
      'Strong financial management and reporting skills',
      'Excellent written and verbal communication skills',
    ],
    preferred: [
      'Experience in First Nations governance or administration',
      'Knowledge of the Indian Act and related legislation',
      'Ojibwe language skills an asset',
    ],
    benefits: [
      'Competitive salary',
      'Health and dental benefits',
      'Housing allowance',
      'Relocation assistance available',
    ],
    applyEmail: 'hr@peguisfirstnation.ca',
    descriptionHtml: "",
    requirementsHtml: undefined
  },
  {
    id: 'j005',
    title: 'Cultural Programs Coordinator',
    company: 'Métis Nation of Ontario',
    location: 'Toronto',
    province: 'Ontario',
    employmentType: 'Full-time',
    category: 'Arts & Culture',
    salary: '$55,000 – $65,000 / year',
    remote: false,
    indigenous: true,
    featured: false,
    postedDaysAgo: 5,
    closingDate: 'June 25, 2026',
    description: 'The Métis Nation of Ontario is looking for a passionate Cultural Programs Coordinator to develop and deliver cultural programming for Métis citizens across the province. This role is central to our mission of preserving and celebrating Métis heritage.',
    responsibilities: [
      'Plan and coordinate cultural events, workshops, and language programs',
      'Develop partnerships with cultural organizations and community groups',
      'Manage program budgets and prepare funding reports',
      'Engage Métis Elders and knowledge holders in program delivery',
      'Promote programs through social media and community outreach',
    ],
    qualifications: [
      'Degree or diploma in Arts Administration, Indigenous Studies, or related field',
      '2+ years experience in program coordination or community development',
      'Strong organizational and project management skills',
      'Demonstrated knowledge of Métis history and culture',
    ],
    preferred: [
      'Michif language knowledge',
      'Experience with grant writing and reporting',
      'Graphic design or social media skills',
    ],
    benefits: [
      'Health and dental benefits',
      'Flexible work arrangements',
      'Professional development opportunities',
      'Meaningful community impact',
    ],
    applyEmail: 'careers@metisnation.org',
    website: 'https://www.metisnation.org',
    descriptionHtml: "",
    requirementsHtml: undefined
  },
  {
    id: 'j006',
    title: 'Environmental Technician',
    company: 'Dene Nation',
    location: 'Yellowknife',
    province: 'Northwest Territories',
    employmentType: 'Full-time',
    category: 'Natural Resources',
    salary: '$58,000 – $72,000 / year',
    remote: false,
    indigenous: true,
    featured: false,
    postedDaysAgo: 10,
    closingDate: 'June 5, 2026',
    description: 'The Dene Nation is seeking an Environmental Technician to support land stewardship and environmental monitoring programs across Denendeh. This role combines scientific fieldwork with Indigenous land knowledge to protect our territories for future generations.',
    responsibilities: [
      'Conduct water, soil, and air quality sampling and analysis',
      'Assist with environmental impact assessments and land use planning',
      'Maintain field equipment and laboratory instruments',
      'Prepare technical reports and present findings to community members',
      'Collaborate with Elders and land users on traditional ecological knowledge',
    ],
    qualifications: [
      'Diploma or degree in Environmental Science, Biology, or related field',
      'Experience with environmental monitoring and data collection',
      'Ability to work in remote field conditions',
      "Valid driver's licence",
    ],
    preferred: [
      'Knowledge of Dene culture and land use practices',
      'Experience with GIS software',
      'Wilderness First Aid certification',
    ],
    benefits: [
      'Northern living allowance',
      'Health and dental benefits',
      'Travel and field allowances',
      'Housing support',
    ],
    applyEmail: 'environment@denenation.com',
    descriptionHtml: "",
    requirementsHtml: undefined
  },
  {
    id: 'j007',
    title: 'Financial Analyst',
    company: 'First Nations Financial Management Board',
    location: 'Vancouver',
    province: 'British Columbia',
    employmentType: 'Full-time',
    category: 'Business & Finance',
    salary: '$72,000 – $88,000 / year',
    remote: true,
    indigenous: false,
    featured: false,
    postedDaysAgo: 3,
    closingDate: 'June 18, 2026',
    description: 'The First Nations Financial Management Board supports First Nations governments in achieving financial management excellence. We are seeking a Financial Analyst to provide advisory services and capacity building support to First Nations clients across Canada.',
    responsibilities: [
      'Analyze financial statements and management reports for First Nations clients',
      'Develop financial management frameworks and policies',
      'Provide training and capacity building to band finance staff',
      'Prepare reports and presentations for senior management and clients',
      'Support the certification and accreditation process for client nations',
    ],
    qualifications: [
      'CPA designation or working toward designation',
      "Bachelor's degree in Accounting, Finance, or Business",
      '3+ years of financial analysis or public sector accounting experience',
      'Strong Excel and financial modelling skills',
    ],
    preferred: [
      'Experience working with Indigenous governments or organizations',
      'Knowledge of First Nations fiscal legislation',
      'Bilingual (English/French)',
    ],
    benefits: [
      'Competitive salary and bonus',
      'Remote work flexibility',
      'Comprehensive benefits',
      'CPA support and study leave',
    ],
    applyEmail: 'hr@fnfmb.com',
    website: 'https://www.fnfmb.com',
    descriptionHtml: "",
    requirementsHtml: undefined
  },
  {
    id: 'j008',
    title: 'Youth Outreach Worker',
    company: 'Inuit Tapiriit Kanatami',
    location: 'Ottawa',
    province: 'Ontario',
    employmentType: 'Part-time',
    category: 'Health & Social Services',
    salary: '$22 – $28 / hour',
    remote: false,
    indigenous: true,
    featured: false,
    postedDaysAgo: 6,
    closingDate: 'June 12, 2026',
    description: 'Inuit Tapiriit Kanatami is the national representational organization for Inuit in Canada. We are seeking a Youth Outreach Worker to engage Inuit youth in Ottawa through cultural programming, mentorship, and wellness activities.',
    responsibilities: [
      'Plan and facilitate youth programs, workshops, and cultural events',
      'Provide one-on-one mentorship and support to Inuit youth',
      'Connect youth with community resources and services',
      'Maintain program records and prepare activity reports',
      'Build relationships with schools, families, and partner organizations',
    ],
    qualifications: [
      'Diploma in Social Work, Child and Youth Care, or related field',
      'Experience working with youth in a community setting',
      'Strong interpersonal and communication skills',
      'Vulnerable Sector Check required',
    ],
    preferred: [
      'Inuktitut language skills',
      'Knowledge of Inuit Nunangat and Inuit culture',
      'Experience with trauma-informed practice',
    ],
    benefits: [
      'Flexible scheduling',
      'Meaningful community work',
      'Professional development support',
    ],
    applyEmail: 'youth@itk.ca',
    website: 'https://www.itk.ca',
    descriptionHtml: "",
    requirementsHtml: undefined
  },
  {
    id: 'j009',
    title: 'Heavy Equipment Operator',
    company: 'Kluane Drilling Ltd.',
    location: 'Whitehorse',
    province: 'Yukon',
    employmentType: 'Casual / Seasonal',
    category: 'Trades & Construction',
    salary: '$35 – $48 / hour',
    remote: false,
    indigenous: false,
    featured: false,
    postedDaysAgo: 8,
    closingDate: 'May 30, 2026',
    description: 'Kluane Drilling is a Yukon-based company with strong ties to First Nations communities. We are seeking experienced Heavy Equipment Operators for seasonal work on resource and infrastructure projects across the territory.',
    responsibilities: [
      'Operate excavators, bulldozers, and other heavy equipment safely',
      'Perform pre-trip inspections and routine equipment maintenance',
      'Follow site safety plans and environmental protection measures',
      'Work collaboratively with site supervisors and crew members',
      'Complete daily work logs and incident reports as required',
    ],
    qualifications: [
      "Valid Class 1 or Class 3 driver's licence",
      'Red Seal or equivalent heavy equipment certification',
      'Minimum 3 years of heavy equipment operation experience',
      'Ability to work in remote locations and varied weather conditions',
    ],
    preferred: [
      'Experience working in northern or remote environments',
      'First Aid Level 1 certification',
      'H2S Alive certification',
    ],
    benefits: [
      'Competitive hourly rate',
      'Camp accommodation provided',
      'Safety bonuses',
      'Opportunity for permanent placement',
    ],
    applyEmail: 'hr@kluanedrilling.ca',
    descriptionHtml: "",
    requirementsHtml: undefined
  },
  {
    id: 'j010',
    title: 'Tourism & Hospitality Coordinator',
    company: 'Haida Gwaii Tourism Association',
    location: 'Haida Gwaii',
    province: 'British Columbia',
    employmentType: 'Full-time',
    category: 'Hospitality & Tourism',
    salary: '$48,000 – $58,000 / year',
    remote: false,
    indigenous: true,
    featured: false,
    postedDaysAgo: 12,
    closingDate: 'June 8, 2026',
    description: 'The Haida Gwaii Tourism Association promotes culturally respectful and sustainable tourism on Haida Gwaii. We are seeking a Tourism & Hospitality Coordinator to support visitor experiences that honour Haida culture, land, and sovereignty.',
    responsibilities: [
      'Coordinate visitor programs, tours, and cultural experiences',
      'Liaise with Haida Nation, tourism operators, and accommodation providers',
      'Develop tourism marketing materials and manage social media presence',
      'Assist with grant applications and tourism funding programs',
      'Ensure all tourism activities align with Haida cultural protocols',
    ],
    qualifications: [
      'Diploma or degree in Tourism, Hospitality, or Business',
      '2+ years experience in tourism coordination or hospitality management',
      'Excellent communication and relationship-building skills',
      "Valid driver's licence",
    ],
    preferred: [
      'Knowledge of Haida culture and protocols',
      'Experience with Indigenous cultural tourism',
      'Photography or content creation skills',
    ],
    benefits: [
      'Unique island lifestyle',
      'Health benefits',
      'Housing assistance',
      'Travel opportunities',
    ],
    applyEmail: 'info@haidagwaiitourism.ca',
    descriptionHtml: "",
    requirementsHtml: undefined
  },
  {
    id: 'j011',
    title: 'Administrative Assistant',
    company: 'Siksika Nation',
    location: 'Siksika',
    province: 'Alberta',
    employmentType: 'Full-time',
    category: 'Administration & Office',
    salary: '$42,000 – $50,000 / year',
    remote: false,
    indigenous: true,
    featured: false,
    postedDaysAgo: 9,
    closingDate: 'June 14, 2026',
    description: 'Siksika Nation is seeking a reliable and organized Administrative Assistant to support the operations of our band office. This is an excellent opportunity for someone who is passionate about serving their community in a professional capacity.',
    responsibilities: [
      'Provide reception and front-desk support to community members and visitors',
      'Manage correspondence, scheduling, and filing systems',
      'Prepare documents, reports, and meeting materials',
      'Process invoices and assist with basic bookkeeping tasks',
      'Support various departments with administrative tasks as needed',
    ],
    qualifications: [
      'Diploma in Office Administration or equivalent experience',
      '1–2 years of administrative or office support experience',
      'Proficiency in Microsoft Office Suite',
      'Strong organizational and time management skills',
    ],
    preferred: [
      'Knowledge of Blackfoot language or culture',
      'Experience in a First Nations band office setting',
      'Familiarity with basic accounting software',
    ],
    benefits: [
      'Health and dental benefits',
      'Paid vacation',
      'Community-focused work environment',
    ],
    applyEmail: 'hr@siksikanation.com',
    descriptionHtml: "",
    requirementsHtml: undefined
  },
  {
    id: 'j012',
    title: 'Data Analyst — Indigenous Health Research',
    company: 'First Nations Health Authority',
    location: 'Vancouver',
    province: 'British Columbia',
    employmentType: 'Contract',
    category: 'Technology & IT',
    salary: '$40 – $55 / hour',
    remote: true,
    indigenous: true,
    featured: false,
    postedDaysAgo: 2,
    closingDate: 'June 22, 2026',
    description: 'The First Nations Health Authority is seeking a Data Analyst to support Indigenous health research and population health reporting. This contract role will contribute to data sovereignty initiatives and help translate complex health data into actionable insights for First Nations communities in BC.',
    responsibilities: [
      'Analyze health data sets and produce statistical reports',
      'Build dashboards and data visualizations for internal and community use',
      'Support data governance and Indigenous data sovereignty frameworks',
      'Collaborate with health researchers, epidemiologists, and community liaisons',
      'Ensure data privacy and security standards are maintained',
    ],
    qualifications: [
      'Degree in Statistics, Data Science, Public Health, or related field',
      '3+ years of data analysis experience',
      'Proficiency in R, Python, or SQL',
      'Experience with data visualization tools (Tableau, Power BI)',
    ],
    preferred: [
      'Knowledge of Indigenous health determinants and OCAP® principles',
      'Experience in a health research or public health setting',
      'Familiarity with BC First Nations health data',
    ],
    benefits: [
      'Competitive contract rate',
      'Remote work',
      'Meaningful public health impact',
      'Potential for contract extension',
    ],
    applyEmail: 'research@fnha.ca',
    website: 'https://www.fnha.ca',
    descriptionHtml: "",
    requirementsHtml: undefined
  },
];

/* ── Utility helpers ──────────────────────────────────────────────────── */

export function getJobById(id: string): Job | undefined {
  return JOBS.find((j) => j.id === id);
}

export function postedLabel(daysAgo: number): string {
  if (daysAgo === 0) return 'Today';
  if (daysAgo === 1) return 'Yesterday';
  if (daysAgo < 7) return `${daysAgo} days ago`;
  if (daysAgo < 14) return '1 week ago';
  return `${Math.floor(daysAgo / 7)} weeks ago`;
}

export interface JobFilters {
  query: string;
  location: string;
  province: string;
  category: string;
  type: string;
  remote: boolean;
  indigenous: boolean;
}

export function filterJobs(jobs: Job[], filters: JobFilters): Job[] {
  const q = filters.query.toLowerCase().trim();
  const loc = filters.location.toLowerCase().trim();
  return jobs.filter((job) => {
    if (
      q &&
      !job.title.toLowerCase().includes(q) &&
      !job.company.toLowerCase().includes(q) &&
      !job.category.toLowerCase().includes(q) &&
      !String(job.description ?? '').toLowerCase().includes(q) &&
      !String(job.requirements ?? '').toLowerCase().includes(q)
    ) {
      return false;
    }
    if (
      loc &&
      !job.location.toLowerCase().includes(loc) &&
      !job.province.toLowerCase().includes(loc)
    ) {
      return false;
    }
    if (filters.province && job.province !== filters.province) return false;
    if (filters.category && job.category !== filters.category) return false;
    if (filters.type && job.employmentType !== filters.type) return false;
    if (filters.remote && !job.remote) return false;
    if (filters.indigenous && !job.indigenous) return false;
    return true;
  });
}
