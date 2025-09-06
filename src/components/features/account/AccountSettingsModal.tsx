import { X } from 'lucide-react';
import AccountSettingsForm from './AccountSettingsForm';
import { updateProfile } from 'firebase/auth';
import { auth } from '../../../config/firebase';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccountSettingsModal({
  isOpen,
  onClose,
}: AccountSettingsModalProps) {
  if (!isOpen) return null;

  const handleSubmit = async (displayName: string, photoURL?: string) => {
    if (!auth.currentUser) throw new Error('ユーザーが見つかりません');

    await updateProfile(auth.currentUser, {
      displayName,
      photoURL,
    });

    onClose();
    window.location.reload();
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
          position: 'relative',
          backgroundColor: 'white',
          borderRadius: '12px',
          maxWidth: '500px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s',
            zIndex: 10,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--background-light)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <X size={20} color="var(--text-dark)" />
        </button>

        <AccountSettingsForm onSubmit={handleSubmit} onCancel={onClose} />
      </div>
    </div>
  );
}
