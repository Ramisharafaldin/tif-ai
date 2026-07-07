import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Select } from '../Select';

describe('Select', () => {
  const options = [{ value: 'a', label: 'Option A' }, { value: 'b', label: 'Option B' }];

  it('renders options', () => {
    render(<Select label="Pick" options={options} />);
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
  });

  it('shows placeholder', () => {
    render(<Select label="Pick" options={options} placeholder="Select..." />);
    expect(screen.getByText('Select...')).toBeInTheDocument();
  });

  it('calls onChange', () => {
    const onChange = jest.fn();
    render(<Select label="Pick" name="pick" options={options} onChange={onChange} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'a' } });
    expect(onChange).toHaveBeenCalled();
  });
});
