/**
 * LoadingSpinner Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default text', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText('Chargement...')).toBeInTheDocument();
  });

  it('renders with custom text', () => {
    render(<LoadingSpinner text="Loading data..." />);
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('has correct ARIA attributes', () => {
    render(<LoadingSpinner text="Test loading" />);
    const container = screen.getByRole('status');
    expect(container).toHaveAttribute('aria-live', 'polite');
    expect(container).toHaveAttribute('aria-label', 'Test loading');
  });

  it('renders spinner animation', () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('border-blue-600');
  });

  it('has accessible structure', () => {
    render(<LoadingSpinner />);
    const status = screen.getByRole('status');
    expect(status).toHaveClass('min-h-screen');
  });
});
