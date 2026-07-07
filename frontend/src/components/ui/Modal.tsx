import React, { useEffect, useRef } from 'react';
import { Button } from './Button';
import './Modal.css';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmDisabled?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  open, onClose, title, children,
  onConfirm, confirmText = 'Save', cancelText = 'Cancel', confirmDisabled,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-overlay" ref={overlayRef} onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">&times;</button>
        </div>
        <div className="modal-body">{children}</div>
        {onConfirm && (
          <div className="modal-actions">
            <Button variant="secondary" onClick={onClose}>{cancelText}</Button>
            <Button onClick={onConfirm} disabled={confirmDisabled}>{confirmText}</Button>
          </div>
        )}
      </div>
    </div>
  );
};
