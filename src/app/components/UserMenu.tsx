import { useState, useEffect, useRef } from "react";
import { clearPropelSession } from "../lib/logout";

interface UserMenuProps {
  userEmail: string;
  onLogout: () => void;
}

export function UserMenu({ userEmail, onLogout }: UserMenuProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  const handleLogout = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setShowDropdown(false);
    clearPropelSession();
    onLogout();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showDropdown]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{
          background: 'rgba(232, 113, 42, 0.15)',
          color: '#e8712a',
          fontFamily: 'Mona Sans, sans-serif',
          fontWeight: '700',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '0.8';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '1';
        }}
      >
        {getInitials(userEmail)}
      </button>

      {/* Dropdown Panel */}
      {showDropdown && (
        <div
          style={{
            position: 'absolute',
            top: '110%',
            right: 0,
            zIndex: 9999,
            background: 'rgba(8, 6, 4, 0.75)',
            backdropFilter: 'blur(32px)',
            WebkitBackdropFilter: 'blur(32px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '6px',
            minWidth: '200px',
            boxShadow: '0 16px 48px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
            animation: 'fadeInDown 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* User Email */}
          <div
            style={{
              padding: '8px 14px',
              color: '#8a7f78',
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              pointerEvents: 'none',
            }}
          >
            {userEmail}
          </div>

          {/* Divider */}
          <div
            style={{
              height: '1px',
              background: 'rgba(255, 255, 255, 0.06)',
              margin: '4px 0',
            }}
          />

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full text-left"
            style={{
              padding: '10px 14px',
              color: '#8a7f78',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              borderRadius: '8px',
              cursor: 'pointer',
              background: 'transparent',
              border: 'none',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#e05c5c';
              e.currentTarget.style.background = 'rgba(224, 92, 92, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#8a7f78';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
