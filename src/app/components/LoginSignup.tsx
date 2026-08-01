import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff } from 'lucide-react';
import logoImg from "../../assets/brand/propel-logo-transparent.png";

interface LoginSignupProps {
  onLogin: (userType: 'entrepreneur' | 'agency') => void;
}

export default function LoginSignup({ onLogin }: LoginSignupProps) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<'entrepreneur' | 'agency'>('entrepreneur');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(role);
    navigate(role === 'entrepreneur' ? '/entrepreneur/dashboard' : '/agency/dashboard');
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4">
      {/* Background blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-25 blur-[60px]"
          style={{
            background: 'radial-gradient(circle, rgba(174,195,176,1) 0%, transparent 65%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-15 blur-[50px]"
          style={{
            background: 'radial-gradient(circle, rgba(107,144,113,1) 0%, transparent 60%)',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md p-12 rounded-[20px] backdrop-blur-[20px]"
        style={{
          backgroundColor: 'rgba(255,255,255,0.65)',
          border: '1px solid rgba(174,195,176,0.35)',
          boxShadow: '0 4px 24px rgba(15,42,29,0.06), 0 1px 4px rgba(15,42,29,0.04)',
        }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <button type="button" onClick={() => navigate('/')} className="transition-transform duration-200 hover:scale-[1.03]" aria-label="Go to Propel homepage">
            <img src={logoImg} alt="Propel - Global B2B Marketplace logo" className="h-10 w-auto" />
          </button>
        </div>

        {/* Mode toggle */}
        <div className="flex rounded-full p-1 mb-6" style={{ backgroundColor: 'rgba(174,195,176,0.2)' }}>
          <button
            type="button"
            onClick={() => setMode('login')}
            className="flex-1 py-2 text-sm font-medium rounded-full transition-all duration-200"
            style={{
              backgroundColor: mode === 'login' ? '#375534' : 'transparent',
              color: mode === 'login' ? '#FFFFFF' : '#6B9071',
            }}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className="flex-1 py-2 text-sm font-medium rounded-full transition-all duration-200"
            style={{
              backgroundColor: mode === 'signup' ? '#375534' : 'transparent',
              color: mode === 'signup' ? '#FFFFFF' : '#6B9071',
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Role selector */}
        <div className="flex gap-3 mb-6">
          <button
            type="button"
            onClick={() => setRole('entrepreneur')}
            className="flex-1 py-2 text-sm font-medium rounded-full transition-all duration-200"
            style={{
              backgroundColor: role === 'entrepreneur' ? '#375534' : 'transparent',
              color: role === 'entrepreneur' ? '#FFFFFF' : '#6B9071',
              border: '1px solid rgba(174,195,176,0.4)',
            }}
          >
            Entrepreneur
          </button>
          <button
            type="button"
            onClick={() => setRole('agency')}
            className="flex-1 py-2 text-sm font-medium rounded-full transition-all duration-200"
            style={{
              backgroundColor: role === 'agency' ? '#375534' : 'transparent',
              color: role === 'agency' ? '#FFFFFF' : '#6B9071',
              border: '1px solid rgba(174,195,176,0.4)',
            }}
          >
            Agency
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#375534' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none"
              style={{
                backgroundColor: 'rgba(255,255,255,0.8)',
                borderColor: 'rgba(174,195,176,0.4)',
                color: '#0F2A1D',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#6B9071';
                e.target.style.boxShadow = '0 0 0 3px rgba(107,144,113,0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(174,195,176,0.4)';
                e.target.style.boxShadow = 'none';
              }}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#375534' }}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none pr-12"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.8)',
                  borderColor: 'rgba(174,195,176,0.4)',
                  color: '#0F2A1D',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6B9071';
                  e.target.style.boxShadow = '0 0 0 3px rgba(107,144,113,0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(174,195,176,0.4)';
                  e.target.style.boxShadow = 'none';
                }}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                style={{ color: '#6B9071' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-medium transition-all duration-200 hover:scale-102 hover:shadow-lg"
            style={{ backgroundColor: '#375534', color: '#FFFFFF' }}
          >
            {mode === 'login' ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-xs mt-6" style={{ color: '#AEC3B0', fontStyle: 'italic' }}>
          {mode === 'login' ? "Don't have an account? Click Sign Up above." : 'Already have an account? Click Login above.'}
        </p>
      </motion.div>
    </div>
  );
}
