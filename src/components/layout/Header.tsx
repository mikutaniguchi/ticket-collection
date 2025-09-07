import { LogOut, Settings, Ticket } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import AccountSettingsModal from '../features/account/AccountSettingsModal';
import './Header.css';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
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
    <header className="header">
      <div className="header-logo" onClick={() => navigate('/tickets')}>
        <Ticket size={24} color="var(--primary-color)" />
        Ticket Collection
      </div>

      <div ref={dropdownRef} style={{ position: 'relative' }}>
        <div className="account-button" onClick={toggleDropdown}>
          {user?.displayName || user?.email?.split('@')[0] || 'ユーザー'}
        </div>

        {showDropdown && (
          <div className="dropdown-menu">
            <div className="dropdown-email">{user?.email}</div>

            <button
              className="dropdown-button dropdown-button-settings"
              onClick={() => {
                setShowSettingsModal(true);
                setShowDropdown(false);
              }}
            >
              <Settings size={16} />
              設定
            </button>

            <button className="dropdown-button" onClick={handleLogout}>
              <LogOut size={16} />
              ログアウト
            </button>
          </div>
        )}
      </div>

      <AccountSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
    </header>
  );
}
