import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../Input';

describe('Input', () => {
  it('renders with label', () => {
    render(<Input label="Name" name="name" />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<Input label="Email" name="email" error="Required" />);
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('calls onChange when typed', () => {
    const onChange = jest.fn();
    render(<Input label="Name" name="name" onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } });
    expect(onChange).toHaveBeenCalled();
  });
});
