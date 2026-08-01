import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from '../App';

describe('App', () => {
  it('renders the Propel landing page with primary calls to action', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /find the right agency/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /post an opportunity/i })).toHaveAttribute('href', '/account-type');
    expect(screen.getByRole('link', { name: /login/i })).toHaveAttribute('href', '/login');
  });
});
