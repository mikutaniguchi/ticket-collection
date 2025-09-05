import { User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.5rem 2rem',
        backgroundColor: '#287475',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div
        style={{
          fontSize: '1.2rem',
          fontWeight: 'bold',
          color: 'white',
          cursor: 'pointer',
        }}
        onClick={() => navigate('/tickets')}
      >
        Ticket Collection
      </div>

      <div ref={dropdownRef} style={{ position: 'relative' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            padding: '0.25rem',
            borderRadius: '50%',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
          onClick={toggleDropdown}
        >
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profile"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
              }}
            />
          ) : (
            <User size={28} color="white" />
          )}
        </div>

        {showDropdown && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '0.5rem',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              zIndex: 1000,
              border: '1px solid var(--border-light)',
              whiteSpace: 'nowrap',
            }}
          >
            <div
              style={{
                padding: '0.75rem 1rem',
                borderBottom: '1px solid var(--border-light)',
                fontSize: '0.9rem',
                color: 'var(--text-light)',
              }}
            >
              {user?.email}
            </div>

            <button
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: 'none',
                background: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.9rem',
                color: 'var(--text-dark)',
                borderBottom: '1px solid var(--border-light)',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  'var(--background-light)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              onClick={() => {
                // TODO: 設定画面へ遷移
                setShowDropdown(false);
              }}
            >
              <Settings size={16} />
              設定
            </button>

            <button
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: 'none',
                background: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.9rem',
                color: 'var(--text-dark)',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  'var(--background-light)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              onClick={handleLogout}
            >
              <LogOut size={16} />
              ログアウト
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
