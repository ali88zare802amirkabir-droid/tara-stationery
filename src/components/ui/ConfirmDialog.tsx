'use client';

import { Modal } from './Overlay';
import { Button } from './Button';
import type { ReactNode } from 'react';

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'danger' | 'primary';
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'تأیید و حذف',
  cancelLabel = 'انصراف',
  tone = 'danger',
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} className="max-w-md">
      <div className="flex flex-col items-start gap-3">
        <h2 className="text-lg font-extrabold text-ink-900">{title}</h2>
        <div className="text-sm leading-relaxed text-ink-500">{description}</div>
        <div className="mt-2 flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={onClose} fullWidth className="sm:w-auto sm:px-6">
            {cancelLabel}
          </Button>
          <Button
            variant={tone === 'danger' ? 'danger' : 'primary'}
            onClick={() => {
              onConfirm();
              onClose();
            }}
            fullWidth
            className="sm:w-auto sm:px-6"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
