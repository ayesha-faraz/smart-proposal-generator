import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProposalView, GeneratedProposal } from '../ProposalView';
import type { ProposalFormData } from '../ProposalForm';
import { downloadProposalPdf } from '../../lib/downloadProposalPdf';

vi.mock('../../lib/downloadProposalPdf', () => ({ downloadProposalPdf: vi.fn() }));

const formData: ProposalFormData = { businessName:'Propel Studio',tagline:'Scale responsibly',phone:'+1 555 123 4567',website:'www.propel.test',email:'a@b.com',clientName:'Acme',clientIndustry:'Tech',clientWebsite:'www.acme.test',targetAudience:'Startup founders',currentSituation:'Low qualified lead volume',mainGoal:'Grow qualified leads in 3 months',competitors:'Other agencies',serviceOffering:'Web Design',projectBrief:'Build a better conversion-focused website using the approved scope, budget, and brand requirements.',budget:'10000',currency:'USD',timeline:'3 Months',tone:'Professional',urgency:'Soon',language:'English' };
const proposal: GeneratedProposal = { headline:'Acme Growth Proposal',subtitle:'A plan for responsible growth',executiveSummary:'Executive content for Acme',problem:'Problem content',opportunity:'Opportunity content',solution:'Solution content',whyUs:'Why us content',close:'Approve and begin',scope:['Research','Design','Implementation','Handover'],investment:[{item:'Strategy',details:'Planning',cost:2500},{item:'Delivery',details:'Design and build',cost:6000},{item:'Handover',details:'Testing and documentation',cost:1500}] };
const ok = (p=proposal) => Promise.resolve({ ok:true, json:async()=>({proposal:p,warnings:[]}) });

describe('ProposalView', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('shows the pending state while the AI route is unresolved', () => {
    vi.stubGlobal('fetch', vi.fn(() => new Promise(()=>{})));
    render(<ProposalView formData={formData} onRegenerate={vi.fn()} onBack={vi.fn()} />);
    expect(screen.getByText(/writing your proposal/i)).toBeInTheDocument();
  });

  it('renders all important structured proposal parts and quality checks', async () => {
    vi.stubGlobal('fetch', vi.fn(()=>ok()) as any);
    render(<ProposalView formData={formData} onRegenerate={vi.fn()} onBack={vi.fn()} />);
    expect(await screen.findByRole('heading',{name:/acme growth proposal/i})).toBeInTheDocument();
    expect(screen.getByText('Executive content for Acme')).toBeInTheDocument();
    expect(screen.getByText('Problem content')).toBeInTheDocument();
    expect(screen.getByText('Solution content')).toBeInTheDocument();
    expect(screen.getByText('Research')).toBeInTheDocument();
    expect(screen.getAllByText(/10,000/).length).toBeGreaterThan(0);
    expect(screen.getByText(/investment equals approved budget/i)).toBeInTheDocument();
  });

  it('shows an error and retry control when the route fails', async () => {
    vi.stubGlobal('fetch', vi.fn(async()=>({ok:false,json:async()=>({error:'Groq is unavailable'})})) as any);
    render(<ProposalView formData={formData} onRegenerate={vi.fn()} onBack={vi.fn()} />);
    expect(await screen.findByRole('heading',{name:/proposal generation failed/i})).toBeInTheDocument();
    expect(screen.getByText(/groq is unavailable/i)).toBeInTheDocument();
    expect(screen.getByRole('button',{name:/try again/i})).toBeInTheDocument();
  });

  it('returns to the form when Back to Form is selected', async () => {
    vi.stubGlobal('fetch', vi.fn(()=>ok()) as any);
    const onBack=vi.fn();
    render(<ProposalView formData={formData} onRegenerate={vi.fn()} onBack={onBack} />);
    await screen.findByRole('heading',{name:/acme growth proposal/i});
    fireEvent.click(screen.getByRole('button',{name:/back to form/i}));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('requires explicit approval before PDF download', async () => {
    vi.stubGlobal('fetch', vi.fn(()=>ok()) as any);
    render(<ProposalView formData={formData} onRegenerate={vi.fn()} onBack={vi.fn()} />);
    await screen.findByRole('heading',{name:/acme growth proposal/i});
    const downloadButton = screen.getByRole('button',{name:/download pdf/i});
    expect(downloadButton).toBeDisabled();
    fireEvent.click(screen.getByLabelText(/approve proposal for pdf/i));
    expect(downloadButton).toBeEnabled();
    fireEvent.click(downloadButton);
    expect(downloadProposalPdf).toHaveBeenCalledTimes(1);
  });

  it('regenerates one controlled section without replacing the whole proposal', async () => {
    const fetchMock=vi.fn()
      .mockImplementationOnce(()=>ok())
      .mockImplementationOnce(()=>Promise.resolve({ok:true,json:async()=>({section:'executiveSummary',content:'Rewritten executive summary for Acme'})}));
    vi.stubGlobal('fetch', fetchMock as any);
    render(<ProposalView formData={formData} onRegenerate={vi.fn()} onBack={vi.fn()} />);
    await screen.findByRole('heading',{name:/acme growth proposal/i});
    fireEvent.click(screen.getByRole('button',{name:/regenerate section/i}));
    expect(await screen.findByText('Rewritten executive summary for Acme')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('regenerates the complete proposal when requested', async () => {
    const fetchMock=vi.fn(()=>ok()); vi.stubGlobal('fetch', fetchMock as any);
    const onRegenerate=vi.fn();
    render(<ProposalView formData={formData} onRegenerate={onRegenerate} onBack={vi.fn()} />);
    await screen.findByRole('heading',{name:/acme growth proposal/i});
    fireEvent.click(screen.getByRole('button',{name:/^regenerate$/i}));
    await waitFor(()=>expect(fetchMock).toHaveBeenCalledTimes(2));
    expect(onRegenerate).toHaveBeenCalled();
  });
});
