import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('shows spinner when loading', () => {
    const { container } = render(<Button loading>Loading</Button>);
    expect(container.querySelector('.btn-spinner')).toBeInTheDocument();
  });

  it('is disabled when loading', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByText('Loading').closest('button')).toBeDisabled();
  });

  it('renders with variant classes', () => {
    const { container, rerender } = render(<Button variant="primary">Primary</Button>);
    expect(container.querySelector('.btn-primary')).toBeInTheDocument();
    rerender(<Button variant="danger">Danger</Button>);
    expect(container.querySelector('.btn-danger')).toBeInTheDocument();
  });
});
