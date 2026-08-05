import { test, expect } from '@playwright/test';

test('primary flow generates, checks, approves, and prepares a proposal PDF', async ({ page }) => {
  await page.route('**/api/generate-proposal', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      warnings: [],
      proposal: {
        headline: 'Acme Growth Proposal',
        subtitle: 'A practical growth plan',
        executiveSummary: 'Mocked executive summary for Acme',
        problem: 'Mocked problem',
        opportunity: 'Mocked opportunity',
        solution: 'Mocked solution',
        whyUs: 'Mocked why us',
        close: 'Approve and begin',
        scope: ['Research', 'Design', 'Implementation', 'Handover'],
        investment: [
          { item: 'Strategy', details: 'Planning', cost: 2500 },
          { item: 'Delivery', details: 'Implementation', cost: 7000 },
          { item: 'Handover', details: 'Testing', cost: 2500 },
        ],
      },
    }),
  }));

  await page.addInitScript(() => localStorage.setItem('propel_user', JSON.stringify({
    email: 'tester@example.com',
    name: 'Tester',
    businessName: 'Test Studio',
  })));

  await page.goto('/');
  await page.getByLabel(/target audience/i).fill('Startup founders');
  await page.getByLabel(/main goal/i).fill('Increase qualified leads in 3 months');
  await page.getByLabel(/project brief/i).fill('Create a conversion-focused website proposal with the approved scope, budget, and reporting requirements.');
  await page.getByRole('button', { name: /generate proposal/i }).click();

  await expect(page.getByRole('heading', { name: /acme growth proposal/i })).toBeVisible();
  await expect(page.getByText('Mocked executive summary for Acme')).toBeVisible();
  await expect(page.getByText(/investment equals approved budget/i)).toBeVisible();

  const downloadButton = page.getByRole('button', { name: /download pdf/i });
  await expect(downloadButton).toBeDisabled();
  await page.getByLabel(/approve proposal for pdf/i).check();
  await expect(downloadButton).toBeEnabled();
});
