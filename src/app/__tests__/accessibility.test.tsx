import { render } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';
import App from '../App';

describe('accessibility smoke audit', () => {
  it('has no axe violations on the landing page', async () => {
    const { container } = render(<App />);
    const results = await axe.run(container);

    expect(results.violations).toEqual([]);
  });
});
