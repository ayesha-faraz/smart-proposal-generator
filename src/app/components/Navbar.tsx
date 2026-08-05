import { Zap } from "lucide-react";
import { UserMenu } from "./UserMenu";

interface NavbarProps {
  onMyProposalsClick?: () => void;
  onLogoClick?: () => void;
  currentPage?: "form" | "proposals";
  userEmail?: string;
}

export function Navbar({ onMyProposalsClick, onLogoClick, currentPage = "form", userEmail }: NavbarProps) {
  return (
    <nav className="w-full px-6 py-5 flex items-center justify-between fadeInDown">
      <button
        onClick={onLogoClick}
        className="flex items-center gap-2"
        style={{
          cursor: 'pointer',
          userSelect: 'none',
          background: 'transparent',
          border: 'none',
          padding: 0,
        }}
        onMouseEnter={(e) => {
          const textElement = e.currentTarget.querySelector('span');
          const iconElement = e.currentTarget.querySelector('svg');
          if (textElement) {
            (textElement as HTMLElement).style.color = '#e8712a';
          }
          if (iconElement) {
            (iconElement as HTMLElement).style.transform = 'scale(1.1)';
          }
        }}
        onMouseLeave={(e) => {
          const textElement = e.currentTarget.querySelector('span');
          const iconElement = e.currentTarget.querySelector('svg');
          if (textElement) {
            (textElement as HTMLElement).style.color = '#f5f0eb';
          }
          if (iconElement) {
            (iconElement as HTMLElement).style.transform = 'scale(1)';
          }
        }}
      >
        <Zap
          className="w-5 h-5"
          style={{
            color: '#e8712a',
            transition: 'transform 0.2s ease',
          }}
        />
        <span
          className="text-xl"
          style={{
            fontFamily: 'Mona Sans, sans-serif',
            fontWeight: '700',
            color: '#f5f0eb',
            transition: 'color 0.2s ease',
          }}
        >
          Propel
        </span>
      </button>

      <div className="flex items-center gap-6">
        <button
          onClick={onMyProposalsClick}
          style={{
            color: currentPage === "proposals" ? '#f5f0eb' : '#8a7f78',
            fontFamily: 'DM Sans, Inter, sans-serif',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#f5f0eb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = currentPage === "proposals" ? '#f5f0eb' : '#8a7f78';
          }}
        >
          My Proposals
        </button>

        {/* User Menu with Avatar and Dropdown */}
        {userEmail && (
          <UserMenu userEmail={userEmail} />
        )}
      </div>
    </nav>
  );
}
