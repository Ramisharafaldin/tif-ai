import React from 'react';
import { render, screen } from '@testing-library/react';
import { Badge } from '../Badge';

describe('Badge', () => {
  it('renders text', () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders with variant classes', () => {
    const { container, rerender } = render(<Badge variant="danger">Danger</Badge>);
    expect(container.querySelector('.badge-danger')).toBeInTheDocument();
    rerender(<Badge variant="success">OK</Badge>);
    expect(container.querySelector('.badge-success')).toBeInTheDocument();
  });

  it('renders dot indicator', () => {
    const { container } = render(<Badge dot>Live</Badge>);
    expect(container.querySelector('.badge-dot-indicator')).toBeInTheDocument();
  });
});
