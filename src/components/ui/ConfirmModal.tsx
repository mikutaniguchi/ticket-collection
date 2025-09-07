import { AlertTriangle } from 'lucide-react';

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
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          maxWidth: '400px',
          width: '100%',
          padding: '2rem',
          textAlign: 'center',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {type === 'danger' && (
          <div
            style={{
              color: '#e53e3e',
              marginBottom: '1rem',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <AlertTriangle size={48} />
          </div>
        )}

        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: 'var(--text-dark)',
          }}
        >
          {title}
        </h2>

        <p
          style={{
            color: 'var(--text-light)',
            marginBottom: '2rem',
            lineHeight: '1.5',
          }}
        >
          {message}
        </p>

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: '1px solid var(--border-light)',
              backgroundColor: 'white',
              color: 'var(--text-dark)',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--background-light)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            {cancelText}
          </button>

          <button
            onClick={handleConfirm}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: type === 'danger' ? '1px solid #d1d5db' : 'none',
              backgroundColor:
                type === 'danger' ? '#f3f4f6' : 'var(--primary-color)',
              color: type === 'danger' ? '#374151' : 'white',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                type === 'danger' ? '#e5e7eb' : 'var(--primary-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                type === 'danger' ? '#f3f4f6' : 'var(--primary-color)';
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
