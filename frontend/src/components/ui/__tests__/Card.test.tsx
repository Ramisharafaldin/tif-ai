import React from 'react';
import { render, screen } from '@testing-library/react';
import { Card } from '../Card';

describe('Card', () => {
  it('renders title and value', () => {
    render(<Card title="Revenue" value="$1,000" />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('$1,000')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(<Card><span>Details</span></Card>);
    expect(screen.getByText('Details')).toBeInTheDocument();
  });

  it('renders with variant accent class', () => {
    const { container } = render(<Card variant="out" title="Low" />);
    expect(container.querySelector('.card-out')).toBeInTheDocument();
  });
});
