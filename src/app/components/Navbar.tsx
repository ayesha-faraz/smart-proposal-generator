import { Link } from 'react-router';
import { ImageWithFallback } from './figma/ImageWithFallback';
import logoImage from '../../assets/brand/propel-logo-transparent.png';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-[12px] border-b border-[rgba(174,195,176,0.2)] z-50">
      <div className="max-w-[1400px] mx-auto px-8 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center transition-transform duration-200 hover:scale-[1.02]" aria-label="Go to Propel homepage">
          <ImageWithFallback
            src={logoImage}
            alt="Propel"
            className="h-10 w-auto"
          />
        </Link>

        <div className="flex items-center gap-8">
          <Link to="/#entrepreneurs" className="text-sm text-[#375534] hover:text-[#0F2A1D] transition-colors">
            For Entrepreneurs
          </Link>
          <Link to="/#agencies" className="text-sm text-[#375534] hover:text-[#0F2A1D] transition-colors">
            For Agencies
          </Link>
          <Link to="/agency/browse" className="text-sm text-[#375534] hover:text-[#0F2A1D] transition-colors">
            Browse
          </Link>
          <Link to="/#how-it-works" className="text-sm text-[#375534] hover:text-[#0F2A1D] transition-colors">
            How it Works
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-5 py-2 text-sm border border-[#375534] text-[#375534] rounded-lg hover:bg-[rgba(55,85,52,0.05)] transition-all"
          >
            Login
          </Link>
          <Link
            to="/account-type"
            className="px-5 py-2 text-sm bg-[#375534] text-[#E3EED4] rounded-lg hover:scale-105 hover:shadow-[0_8px_24px_rgba(55,85,52,0.25)] transition-all duration-200"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
