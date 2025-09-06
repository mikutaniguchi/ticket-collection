import { useState } from 'react';
import { User } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

interface AccountSettingsFormProps {
  onSubmit: (displayName: string, photoURL?: string) => Promise<void>;
  onCancel: () => void;
}

export default function AccountSettingsForm({
  onSubmit,
  onCancel,
}: AccountSettingsFormProps) {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!displayName.trim()) {
      setError('表示名を入力してください');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(displayName, undefined);
    } catch {
      setError('更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        padding: '2rem',
      }}
    >
      <h2
        style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem',
          color: 'var(--text-dark)',
        }}
      >
        アカウント設定
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label
          style={{
            fontSize: '0.9rem',
            color: 'var(--text-light)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <User size={16} />
          表示名
        </label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="表示名を入力"
          style={{
            padding: '0.75rem',
            fontSize: '1rem',
            border: '1px solid var(--border-light)',
            borderRadius: '8px',
            transition: 'border-color 0.2s',
            outline: 'none',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--primary-color)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--border-light)';
          }}
        />
      </div>

      {error && (
        <div
          style={{
            padding: '0.75rem',
            backgroundColor: '#fee',
            color: '#c00',
            borderRadius: '6px',
            fontSize: '0.9rem',
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          gap: '1rem',
          marginTop: '1rem',
        }}
      >
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          style={{
            flex: 1,
            padding: '0.75rem',
            fontSize: '1rem',
            backgroundColor: 'white',
            color: 'var(--text-dark)',
            border: '1px solid var(--border-light)',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s',
            opacity: loading ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            if (!loading)
              e.currentTarget.style.backgroundColor = 'var(--background-light)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
          }}
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={loading}
          style={{
            flex: 1,
            padding: '0.75rem',
            fontSize: '1rem',
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s',
            opacity: loading ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            if (!loading)
              e.currentTarget.style.backgroundColor = 'var(--primary-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--primary-color)';
          }}
        >
          {loading ? '更新中...' : '更新'}
        </button>
      </div>
    </form>
  );
}
