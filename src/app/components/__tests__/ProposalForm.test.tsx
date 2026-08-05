import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProposalForm } from '../ProposalForm';

describe('ProposalForm', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: async () => ({ connected: true, configured: true, model: 'test-model', message: 'Groq API connection verified.' }),
    })) as any);
  });

  it('shows the verified live Groq tool connection', async () => {
    render(<ProposalForm onGenerate={vi.fn()} />);
    expect(await screen.findByText(/live tool connected: groq api/i)).toBeInTheDocument();
    expect(screen.getByText(/model: test-model/i)).toBeInTheDocument();
  });

  it('shows validation when the project brief is empty', () => {
    render(<ProposalForm onGenerate={vi.fn()} />);
    fireEvent.change(screen.getByLabelText(/project brief/i), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /generate proposal/i }));
    expect(screen.getByText(/projectBrief: this field is required/i)).toBeInTheDocument();
  });

  it('shows validation when audience and goal are missing', () => {
    render(<ProposalForm onGenerate={vi.fn()} />);
    fireEvent.change(screen.getByLabelText(/target audience/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/main goal/i), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /generate proposal/i }));
    expect(screen.getByText(/targetAudience: this field is required/i)).toBeInTheDocument();
    expect(screen.getByText(/mainGoal: this field is required/i)).toBeInTheDocument();
  });

  it('requires acknowledgement when risky wording is detected', () => {
    const onGenerate = vi.fn();
    render(<ProposalForm onGenerate={onGenerate} />);
    fireEvent.change(screen.getByLabelText(/main goal/i), { target: { value: 'Guarantee 100% growth in 3 months' } });
    fireEvent.click(screen.getByRole('button', { name: /generate proposal/i }));
    expect(screen.getByText(/guarantee or absolute-results claim/i)).toBeInTheDocument();
    expect(onGenerate).not.toHaveBeenCalled();
  });

  it('submits valid form data', async () => {
    const onGenerate = vi.fn();
    render(<ProposalForm onGenerate={onGenerate} />);
    fireEvent.change(screen.getByLabelText(/target audience/i), { target: { value: 'Startup founders' } });
    fireEvent.change(screen.getByLabelText(/main goal/i), { target: { value: 'Increase qualified leads in 3 months' } });
    fireEvent.change(screen.getByLabelText(/project brief/i), { target: { value: 'Create a focused campaign for startup founders with approved deliverables and reporting.' } });
    fireEvent.click(screen.getByRole('button', { name: /generate proposal/i }));
    await waitFor(() => expect(onGenerate).toHaveBeenCalledTimes(1), { timeout: 1200 });
    expect(onGenerate.mock.calls[0][0]).toEqual(expect.objectContaining({ targetAudience: 'Startup founders', mainGoal: 'Increase qualified leads in 3 months' }));
  });
});
