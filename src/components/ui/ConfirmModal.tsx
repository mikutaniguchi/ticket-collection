import { AlertTriangle } from 'lucide-react';
import './ConfirmModal.css';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '確認',
  cancelText = 'キャンセル',
  type = 'danger',
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="confirm-modal-overlay" onClick={onClose}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        {type === 'danger' && (
          <div className="confirm-modal-icon">
            <AlertTriangle size={48} />
          </div>
        )}

        <h2 className="confirm-modal-title">{title}</h2>

        <p className="confirm-modal-message">{message}</p>

        <div className="confirm-modal-buttons">
          <button
            onClick={onClose}
            className="confirm-modal-button confirm-modal-button-cancel"
          >
            {cancelText}
          </button>

          <button
            onClick={handleConfirm}
            className={`confirm-modal-button confirm-modal-button-confirm ${type !== 'danger' ? 'primary' : ''}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
