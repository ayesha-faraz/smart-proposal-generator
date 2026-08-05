import { describe, expect, it } from 'vitest';
import { evaluateGeneratedProposal, validateProposalForm } from '../proposalValidation';
import type { ProposalFormData } from '../../components/ProposalForm';

const formData: ProposalFormData = {
  businessName: 'Propel Studio',
  tagline: 'Practical digital growth',
  phone: '+92 300 1234567',
  website: 'www.propel.test',
  email: 'hello@propel.test',
  clientName: 'Acme',
  clientIndustry: 'Technology',
  clientWebsite: 'www.acme.test',
  targetAudience: 'Operations leaders at mid-sized companies',
  currentSituation: 'Manual proposal preparation takes several hours.',
  mainGoal: 'Improve qualified leads during a 3 month engagement',
  competitors: 'None',
  serviceOffering: 'Web Design',
  projectBrief: 'Create a professional portal and proposal workflow using the approved scope and brand details.',
  budget: '10000',
  currency: 'USD',
  timeline: '3 Months',
  tone: 'Professional',
  urgency: 'Soon',
  language: 'English',
};

const proposal = {
  headline: 'Acme Digital Proposal',
  subtitle: 'A practical portal and workflow plan',
  executiveSummary: 'Acme will receive a structured portal aligned with the submitted requirements.',
  problem: 'The current process is slow and inconsistent.',
  opportunity: 'A controlled workflow can reduce repetitive work.',
  solution: 'Propel Studio will design and implement the approved portal workflow.',
  whyUs: 'Propel Studio will work from the supplied scope and review checkpoints.',
  close: 'Approve the proposal to schedule the agreed kickoff.',
  scope: ['Discovery', 'Interface design', 'Portal implementation', 'Handover'],
  investment: [
    { item: 'Discovery', details: 'Requirements and plan', cost: 2000 },
    { item: 'Delivery', details: 'Design and implementation', cost: 6500 },
    { item: 'Handover', details: 'Testing and handover', cost: 1500 },
  ],
};

describe('proposal validation', () => {
  it('flags a selected-timeline conflict', () => {
    const result = validateProposalForm({ ...formData, projectBrief: 'Deliver this approved website project within 2 weeks with the stated scope and quality requirements.' });
    expect(result.isValid).toBe(true);
    expect(result.warnings.some((warning) => warning.id === 'timeline-conflict')).toBe(true);
  });

  it('blocks a generated placeholder', () => {
    const report = evaluateGeneratedProposal({ ...proposal, close: 'TBD' }, formData);
    expect(report.blockingIssues.some((issue) => /placeholder/i.test(issue))).toBe(true);
  });

  it('passes a complete proposal with the correct investment', () => {
    const report = evaluateGeneratedProposal(proposal, formData);
    expect(report.blockingIssues).toEqual([]);
    expect(report.checks.every((check) => check.passed)).toBe(true);
  });
});
