import { useState, useEffect, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";

interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
}

export function Dropdown({ value, onChange, options, placeholder }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl outline-none"
        style={{
          background: 'rgba(255, 255, 255, 0.04)',
          border: isOpen ? '1px solid #e8712a' : '1px solid rgba(255, 255, 255, 0.08)',
          color: '#f5f0eb',
          fontFamily: 'DM Sans, Inter, sans-serif',
          transition: 'all 0.3s ease',
          boxShadow: isOpen ? '0 0 0 3px rgba(232, 113, 42, 0.15)' : 'none',
        }}
        onMouseEnter={(e) => {
          if (!isOpen) {
            e.currentTarget.style.borderColor = 'rgba(232, 113, 42, 0.4)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
          }
        }}
      >
        <span>{value || placeholder}</span>
        <ChevronDown
          className="w-4 h-4"
          style={{
            color: '#8a7f78',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
          }}
        />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          className="absolute w-full mt-2"
          style={{
            zIndex: 9999,
            background: 'rgba(8, 6, 4, 0.75)',
            backdropFilter: 'blur(32px)',
            WebkitBackdropFilter: 'blur(32px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '6px',
            boxShadow: '0 16px 48px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
            animation: 'fadeInDown 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleSelect(option)}
              className="w-full flex items-center justify-between text-left"
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                color: value === option ? '#e8712a' : '#8a7f78',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                cursor: 'pointer',
                background: value === option ? 'rgba(232, 113, 42, 0.15)' : 'transparent',
                fontWeight: value === option ? '500' : '400',
                transition: 'all 0.15s ease',
                border: 'none',
              }}
              onMouseEnter={(e) => {
                if (value !== option) {
                  e.currentTarget.style.background = 'rgba(232, 113, 42, 0.1)';
                  e.currentTarget.style.color = '#f5f0eb';
                }
              }}
              onMouseLeave={(e) => {
                if (value !== option) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#8a7f78';
                }
              }}
            >
              <span>{option}</span>
              {value === option && (
                <Check className="w-4 h-4" style={{ color: '#e8712a' }} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
