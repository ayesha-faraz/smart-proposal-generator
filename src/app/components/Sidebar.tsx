import { Link, useLocation } from 'react-router';
import logoImg from '../../assets/brand/propel-logo-transparent.png';
import { LayoutDashboard, Briefcase, FileText, Settings, Search, Sparkles, ShieldCheck } from 'lucide-react';

interface SidebarProps {
  userType: 'entrepreneur' | 'agency';
}

export function Sidebar({ userType }: SidebarProps) {
  const location = useLocation();

  const entrepreneurLinks = [
    { path: '/entrepreneur/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/entrepreneur/create-opportunity', label: 'My Opportunities', icon: Briefcase },
    { path: '/entrepreneur/deal-intelligence', label: 'Deal Intelligence', icon: ShieldCheck },
    { path: '/entrepreneur/proposals', label: 'Proposals', icon: FileText },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  const agencyLinks = [
    { path: '/agency/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/agency/browse', label: 'Browse Opportunities', icon: Search },
    { path: '/agency/generate-proposal/1', label: 'AI Proposal', icon: Sparkles },
    { path: '/agency/proposals', label: 'My Proposals', icon: FileText },
    { path: '/agency/deal-room', label: 'Deal Room', icon: ShieldCheck },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  const links = userType === 'entrepreneur' ? entrepreneurLinks : agencyLinks;

  return (
    <div className="hidden md:flex w-60 bg-[rgba(255,255,255,0.7)] backdrop-blur-[16px] border-r border-[rgba(174,195,176,0.2)] h-[100dvh] fixed left-0 top-0 flex-col z-40">
      <div className="px-6 pt-6 pb-6 mb-3 border-b" style={{ borderColor: 'rgba(174,195,176,0.15)' }}>
        <Link to="/" className="inline-flex transition-transform duration-200 hover:scale-[1.03]" aria-label="Go to Propel homepage">
          <img
            src={logoImg}
            alt="Propel - Global B2B Marketplace logo"
            className="h-[52px] w-auto"
          />
        </Link>
      </div>

      <nav className="flex-1 px-3">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path || location.pathname.startsWith(link.path);

          return (
            <Link
              key={link.path}
              to={link.path}
              className="flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all relative"
              style={{
                backgroundColor: isActive ? 'rgba(55,85,52,0.08)' : 'transparent',
                color: isActive ? '#0F2A1D' : '#6B9071',
              }}
            >
              {isActive && (
                <div
                  className="absolute left-0 top-0 bottom-0 w-1 rounded-r"
                  style={{ backgroundColor: '#375534' }}
                />
              )}
              <Icon className="w-5 h-5" />
              <span className="text-sm">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
