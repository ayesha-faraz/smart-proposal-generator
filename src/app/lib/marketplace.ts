import { AppProposal, formDataToProposal } from "./proposals";
import { ProposalFormData } from "../components/ProposalForm";

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  brief: string;
  budget: string;
  timeline: string;
  service: string;
  industry: string;
  targetAudience: string;
  currentSituation: string;
  mainGoal: string;
  competitors?: string;
  website?: string;
  isNew?: boolean;
}

export interface CompanyProfile {
  companyName: string;
  industry: string;
  city: string;
  website: string;
  description: string;
  services: string[];
  teamSize: string;
  pricingStyle: string;
  tagline?: string;
  phone?: string;
  email?: string;
  logo?: string | null;
}

export interface AgencyMatch {
  id: string;
  name: string;
  services: string[];
  verified: boolean;
  location: string;
  matchScore: number;
  deliveryConfidence: number;
  priceFit: number;
  risk: "Low" | "Medium" | "High";
  proof: string;
}

export interface ProposalScore {
  agency: string;
  fit: number;
  quality: number;
  priceFairness: number;
  risk: number;
  deliveryConfidence: number;
  recommendation: string;
}

const PROFILE_KEY = "propel_company_profile";
const PROPOSALS_KEY = "propel_generated_proposals";

export const opportunities: Opportunity[] = [
  {
    id: "1",
    title: "E-commerce Platform Redesign",
    company: "RetailCo",
    location: "Lahore, Pakistan",
    brief:
      "RetailCo wants to modernize its e-commerce experience with a mobile-first redesign, stronger product discovery, faster checkout, and a cleaner visual system that helps customers trust the brand.",
    budget: "PKR 2,000,000 - 3,000,000",
    timeline: "4 months",
    service: "Web Design",
    industry: "Retail",
    targetAudience: "Young urban shoppers in Pakistan who browse and buy primarily through mobile devices",
    currentSituation:
      "The current store looks dated, mobile conversion is weak, and customers often abandon carts before checkout.",
    mainGoal: "Improve mobile conversion, reduce cart abandonment, and make the brand feel premium online",
    competitors: "Daraz brand stores, Outfitters, Sapphire",
    website: "www.retailco.pk",
    isNew: true,
  },
  {
    id: "2",
    title: "Social Media Content Strategy",
    company: "HealthTech Inc",
    location: "Karachi, Pakistan",
    brief:
      "HealthTech Inc needs a content partner to build trust across Instagram, LinkedIn, and short-form video while explaining its healthcare product in a simple, credible way.",
    budget: "PKR 450,000 - 800,000",
    timeline: "3 months",
    service: "Social Media",
    industry: "Healthcare",
    targetAudience: "Clinics, young families, and professionals looking for reliable digital healthcare support",
    currentSituation:
      "Their product is useful, but their content is inconsistent and does not explain the value clearly enough.",
    mainGoal: "Build trust, improve brand understanding, and generate qualified demo requests",
    competitors: "Oladoc, Marham, Sehat Kahani",
    website: "www.healthtech.pk",
    isNew: true,
  },
  {
    id: "3",
    title: "Brand Identity Refresh",
    company: "GreenLeaf Co",
    location: "Islamabad, Pakistan",
    brief:
      "GreenLeaf Co is expanding from a small eco-product brand into retail partnerships and needs a more polished identity without losing its sustainable values.",
    budget: "PKR 700,000 - 1,200,000",
    timeline: "2 months",
    service: "Branding",
    industry: "Sustainability",
    targetAudience: "Retail buyers and conscious consumers who care about quality, origin, and environmental impact",
    currentSituation:
      "The existing brand feels homemade and does not yet communicate enough confidence for larger retail partnerships.",
    mainGoal: "Refresh the brand identity so the company feels credible, scalable, and retail-ready",
    competitors: "Organic Pakistan, The Green Ark, local sustainable product startups",
  },
  {
    id: "4",
    title: "Mobile App Development",
    company: "FintechStart",
    location: "Islamabad, Pakistan",
    brief:
      "FintechStart is building a financial wellness app and needs an experienced product team to design and develop a secure MVP for early users.",
    budget: "PKR 6,000,000 - 9,000,000",
    timeline: "6 months",
    service: "Development",
    industry: "Finance",
    targetAudience: "Young professionals who want simple budgeting, savings goals, and spending visibility",
    currentSituation:
      "They have validated the concept but need a production-quality MVP that can handle real users and investor demos.",
    mainGoal: "Launch a secure MVP, onboard beta users, and prepare the product for seed-stage fundraising",
    competitors: "SadaPay, NayaPay, Abhi",
  },
];

export const agencyMatches: AgencyMatch[] = [
  {
    id: "a1",
    name: "Northstar Digital",
    services: ["Web Design", "Branding", "SEO"],
    verified: true,
    location: "London, UK",
    matchScore: 94,
    deliveryConfidence: 91,
    priceFit: 88,
    risk: "Low",
    proof: "12 verified commerce projects, 96% on-time delivery, 4 repeat clients",
  },
  {
    id: "a2",
    name: "PixelForge Studio",
    services: ["Web Design", "Software Development", "Content Creation"],
    verified: true,
    location: "Dubai, UAE",
    matchScore: 89,
    deliveryConfidence: 86,
    priceFit: 92,
    risk: "Low",
    proof: "Strong mobile UX portfolio and verified checkout optimization results",
  },
  {
    id: "a3",
    name: "GrowthCraft Agency",
    services: ["Social Media Management", "PR", "Copywriting"],
    verified: false,
    location: "Toronto, Canada",
    matchScore: 78,
    deliveryConfidence: 74,
    priceFit: 81,
    risk: "Medium",
    proof: "Good proposal quality, verification pending for portfolio outcomes",
  },
];

export const proposalScores: ProposalScore[] = [
  {
    agency: "Northstar Digital",
    fit: 95,
    quality: 93,
    priceFairness: 88,
    risk: 14,
    deliveryConfidence: 91,
    recommendation: "Best overall fit. Strong brief alignment, credible timeline, and verified commerce experience.",
  },
  {
    agency: "PixelForge Studio",
    fit: 88,
    quality: 90,
    priceFairness: 92,
    risk: 19,
    deliveryConfidence: 86,
    recommendation: "Best value option. Good pricing and execution plan, slightly less category-specific proof.",
  },
  {
    agency: "GrowthCraft Agency",
    fit: 76,
    quality: 82,
    priceFairness: 84,
    risk: 39,
    deliveryConfidence: 74,
    recommendation: "Promising but higher risk because verification and delivery history are incomplete.",
  },
];

export const getOpportunityById = (id?: string) =>
  opportunities.find((opportunity) => opportunity.id === id) ?? opportunities[0];

export const defaultAgencyProfile: CompanyProfile = {
  companyName: "Propel Studio",
  industry: "Marketing",
  city: "Lahore",
  website: "www.propelstudio.pk",
  description:
    "A Pakistan-first growth agency helping startups and SMEs turn strategy, design, and content into measurable business momentum.",
  services: ["Web Design", "Social Media", "Branding", "Content"],
  teamSize: "6-10",
  pricingStyle: "Fixed",
  tagline: "We turn business ambition into client-ready execution.",
  phone: "+92 300 1234567",
  email: "hello@propelstudio.pk",
  logo: null,
};

export const saveCompanyProfile = (profile: CompanyProfile) => {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

export const getCompanyProfile = (): CompanyProfile => {
  const saved = localStorage.getItem(PROFILE_KEY);
  if (!saved) return defaultAgencyProfile;

  try {
    return { ...defaultAgencyProfile, ...JSON.parse(saved) };
  } catch {
    return defaultAgencyProfile;
  }
};

const normalizeTimeline = (timeline: string): ProposalFormData["timeline"] => {
  if (/1|2/.test(timeline)) return "1 Month";
  if (/6/.test(timeline)) return "6 Months";
  return "3 Months";
};

const normalizeService = (service: string) => {
  if (service === "Social Media") return "Social Media Management";
  if (service === "Development") return "Custom";
  return service;
};

const budgetAmount = (budget: string) => {
  const match = budget.replace(/,/g, "").match(/\d+/);
  return match?.[0] ?? "";
};

export const buildProposalFormFromOpportunity = (
  opportunity: Opportunity,
  profile = getCompanyProfile(),
): ProposalFormData => ({
  businessName: profile.companyName,
  tagline: profile.tagline || profile.description,
  phone: profile.phone || "",
  website: profile.website,
  email: profile.email || "",
  logo: profile.logo || null,
  logoFileName: "",
  clientName: opportunity.company,
  clientIndustry: opportunity.industry,
  clientWebsite: opportunity.website || "",
  targetAudience: opportunity.targetAudience,
  currentSituation: opportunity.currentSituation,
  mainGoal: opportunity.mainGoal,
  competitors: opportunity.competitors || "",
  serviceOffering: normalizeService(opportunity.service),
  projectBrief: opportunity.brief,
  budget: budgetAmount(opportunity.budget),
  currency: opportunity.budget.toUpperCase().includes("PKR") ? "PKR" : "USD",
  timeline: normalizeTimeline(opportunity.timeline),
  tone: "Professional",
  urgency: opportunity.isNew ? "Soon" : "Consultative",
  language: "English",
});

export const getLocalProposals = (): AppProposal[] => {
  const saved = localStorage.getItem(PROPOSALS_KEY);
  if (!saved) return [];

  try {
    const parsed = JSON.parse(saved) as Array<Omit<AppProposal, "dateGenerated"> & { dateGenerated: string }>;
    return parsed.map((proposal) => ({
      ...proposal,
      dateGenerated: new Date(proposal.dateGenerated),
    }));
  } catch {
    return [];
  }
};

export const saveLocalProposal = (proposal: AppProposal) => {
  const proposals = [proposal, ...getLocalProposals().filter((item) => item.id !== proposal.id)];
  localStorage.setItem(PROPOSALS_KEY, JSON.stringify(proposals));
};

export const createAndSaveProposal = (formData: ProposalFormData) => {
  const proposal = formDataToProposal(formData);
  saveLocalProposal(proposal);
  return proposal;
};

export const getLocalProposalById = (id?: string) =>
  getLocalProposals().find((proposal) => proposal.id === id);
