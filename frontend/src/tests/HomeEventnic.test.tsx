import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomeEventnic from '../pages/HomeEventnic';
import { describe, it, expect, vi } from 'vitest';

vi.mock('../contexts/EventsContext', () => ({
  useEvents: () => ({ events: [], isLoading: false, error: null, getPublishedEvents: () => [] })
}));

describe('HomeEventnic Component', () => {
  it('renders the home page correctly', () => {
    render(
      <BrowserRouter>
        <HomeEventnic />
      </BrowserRouter>
    );
    // basic check, typically the hero section or navigation
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
