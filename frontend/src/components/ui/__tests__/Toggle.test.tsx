import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Toggle, ToggleGroup } from '../Toggle';

describe('Toggle', () => {
  it('renders with label', () => {
    render(<Toggle checked={false} onChange={jest.fn()} label="Dark Mode" />);
    expect(screen.getByText('Dark Mode')).toBeInTheDocument();
  });

  it('calls onChange when clicked', () => {
    const onChange = jest.fn();
    render(<Toggle checked={false} onChange={onChange} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledWith(true);
  });
});

describe('ToggleGroup', () => {
  it('renders options and highlights active', () => {
    render(<ToggleGroup options={[{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }]} value="a" onChange={jest.fn()} />);
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('A').closest('button')).toHaveClass('active');
  });

  it('calls onChange with selected value', () => {
    const onChange = jest.fn();
    render(<ToggleGroup options={[{ value: 'x', label: 'X' }]} value="" onChange={onChange} />);
    fireEvent.click(screen.getByText('X'));
    expect(onChange).toHaveBeenCalledWith('x');
  });
});
