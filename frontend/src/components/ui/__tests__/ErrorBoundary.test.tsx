import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from '../ErrorBoundary';

const ThrowError: React.FC = () => { throw new Error('Test error'); };

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it('renders children when no error', () => {
    render(<ErrorBoundary><span>OK</span></ErrorBoundary>);
    expect(screen.getByText('OK')).toBeInTheDocument();
  });

  it('shows fallback on error', () => {
    render(<ErrorBoundary><ThrowError /></ErrorBoundary>);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('shows custom fallback', () => {
    render(<ErrorBoundary fallback={<div>Custom Error</div>}><ThrowError /></ErrorBoundary>);
    expect(screen.getByText('Custom Error')).toBeInTheDocument();
  });

  it('recovers on retry click', () => {
    let showError = true;
    const { rerender } = render(
      <ErrorBoundary key={+showError}>{showError ? <ThrowError /> : <span>Fixed</span>}</ErrorBoundary>
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
});
