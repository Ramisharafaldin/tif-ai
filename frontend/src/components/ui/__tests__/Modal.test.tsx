import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from '../Modal';

describe('Modal', () => {
  it('renders when open', () => {
    render(<Modal open title="Test" onClose={jest.fn()}><p>Content</p></Modal>);
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<Modal open={false} title="Test" onClose={jest.fn()}><p>Content</p></Modal>);
    expect(screen.queryByText('Test')).not.toBeInTheDocument();
  });

  it('calls onClose when close button clicked', () => {
    const onClose = jest.fn();
    render(<Modal open title="Test" onClose={onClose}><p>Content</p></Modal>);
    fireEvent.click(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalled();
  });

  it('renders confirm and cancel buttons', () => {
    const onConfirm = jest.fn();
    render(<Modal open title="Test" onClose={jest.fn()} onConfirm={onConfirm} confirmText="Save" cancelText="Cancel" />);
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });
});
