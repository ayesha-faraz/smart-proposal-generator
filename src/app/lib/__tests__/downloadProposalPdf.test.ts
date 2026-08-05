import { describe, expect, it } from 'vitest';
import { jsPDF } from 'jspdf';
import { createProposalPdfDoc, normalizePdfText, splitPdfTextToLines } from '../downloadProposalPdf';

const longText = 'Austin first time homebuyer demand is growing while competitors rely on generic paid social campaigns. The proposal must wrap this paragraph within the printable page width without adding artificial spacing between letters, clipping the sentence, or pushing content past the page margin.';

describe('downloadProposalPdf', () => {
  it('wraps long paragraphs inside the requested width', () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.5);

    const lines = splitPdfTextToLines(doc, longText, 260);

    expect(lines.length).toBeGreaterThan(2);
    expect(lines.every((line) => doc.getTextWidth(line) <= 261)).toBe(true);
    expect(lines.join(' ')).not.toMatch(/A u s t i n/);
  });

  it('breaks long words and URLs before they can overflow the page', () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.5);

    const lines = splitPdfTextToLines(
      doc,
      'Review https://example.com/extremely-long-path-without-natural-breaks-for-a-client-proposal-and-analytics-dashboard before kickoff.',
      180,
    );

    expect(lines.length).toBeGreaterThan(2);
    expect(lines.every((line) => doc.getTextWidth(line) <= 181)).toBe(true);
  });

  it('normalizes text without introducing placeholder content', () => {
    expect(normalizePdfText('Propel\u00a0Studio   proposal')).toBe('Propel Studio proposal');
    expect(normalizePdfText('')).toBe('-');
  });

  it('generates a multipage selectable PDF buffer for long proposals', () => {
    const doc = createProposalPdfDoc({
      filename: 'long proposal test',
      businessName: 'Propel Studio',
      clientName: 'UrbanNest Realty Group With A Very Long Client Name',
      currentDate: 'August 6, 2026',
      headline: 'UrbanNest Realty Group With A Very Long Client Name Growth Proposal',
      subtitle: 'A practical plan for qualified lead generation and consultative follow-up',
      contactLines: ['Propel Studio', 'hello@propelstudio.co', 'https://propel-kappa.vercel.app'],
      sections: Array.from({ length: 12 }, (_, index) => ({
        title: `Section ${index + 1}`,
        body: `${longText} ${longText}`,
      })),
      scope: [
        'Create an audience-specific messaging system with a long wrapped bullet that should align under the text instead of under the bullet mark.',
        'Build landing page content, lead capture forms, reporting checkpoints, and weekly review notes for the client team.',
        'Document all launch assets and handover requirements before the final review.',
        'Review a long URL safely: https://example.com/very/long/client/path/that/should/wrap/inside/the/page/without/clipping',
      ],
      investment: [
        { item: 'Strategy', details: longText, cost: 'USD 3,000' },
        { item: 'Delivery', details: longText, cost: 'USD 7,000' },
        { item: 'Handover', details: longText, cost: 'USD 2,000' },
      ],
      totalInvestment: 'Total Investment: USD 12,000',
      footer: 'Propel Studio - Prepared exclusively for UrbanNest Realty Group. Valid for 14 days from date of issue.',
    });

    const output = doc.output('arraybuffer') as ArrayBuffer;
    const text = doc.output() as string;

    expect(doc.getNumberOfPages()).toBeGreaterThan(1);
    expect(output.byteLength).toBeGreaterThan(10_000);
    expect(text).not.toMatch(/TBD|PLACEHOLDER|Lorem ipsum/i);
  });
});
