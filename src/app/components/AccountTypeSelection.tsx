import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Check } from 'lucide-react';
import targetIcon from "../../assets/brand/propel-mark-transparent.png";

interface AccountTypeSelectionProps {
  onSelect: (type: 'entrepreneur' | 'agency') => void;
}

export default function AccountTypeSelection({ onSelect }: AccountTypeSelectionProps) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<'entrepreneur' | 'agency' | null>(null);

  const handleContinue = () => {
    if (selected) {
      onSelect(selected);
      navigate('/profile-setup');
    }
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

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl mb-12"
          style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontStyle: 'italic',
            color: '#0F2A1D',
          }}
        >
          What describes you best?
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Entrepreneur Card */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setSelected('entrepreneur')}
            className="relative p-10 rounded-[20px] backdrop-blur-[20px] transition-all duration-300 text-left group"
            style={{
              backgroundColor: selected === 'entrepreneur' ? 'rgba(55,85,52,0.05)' : 'rgba(255,255,255,0.65)',
              border: selected === 'entrepreneur' ? '2px solid #375534' : '1px solid rgba(174,195,176,0.35)',
              boxShadow: '0 4px 24px rgba(15,42,29,0.06)',
              transform: selected === 'entrepreneur' ? 'translateY(-4px)' : 'translateY(0)',
            }}
            onMouseEnter={(e) => {
              if (selected !== 'entrepreneur') {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'rgba(55,85,52,0.25)';
              }
            }}
            onMouseLeave={(e) => {
              if (selected !== 'entrepreneur') {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(174,195,176,0.35)';
              }
            }}
          >
            {selected === 'entrepreneur' && (
              <div
                className="absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#375534' }}
              >
                <Check size={16} color="#FFFFFF" />
              </div>
            )}

            <div className="flex justify-center mb-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#E3EED4' }}
              >
                <img
                  src={targetIcon}
                  alt="Propel target icon"
                  className="w-10 h-10"
                  style={{ filter: 'brightness(0) saturate(100%) invert(38%) sepia(11%) saturate(1115%) hue-rotate(76deg) brightness(91%) contrast(88%)' }}
                />
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-3" style={{ color: '#0F2A1D' }}>
              Entrepreneur / Startup
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: '#6B9071' }}>
              I'm looking for agencies to help me with my projects. I want to post opportunities and receive proposals.
            </p>
          </motion.button>

          {/* Agency Card */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setSelected('agency')}
            className="relative p-10 rounded-[20px] backdrop-blur-[20px] transition-all duration-300 text-left group"
            style={{
              backgroundColor: selected === 'agency' ? 'rgba(55,85,52,0.05)' : 'rgba(255,255,255,0.65)',
              border: selected === 'agency' ? '2px solid #375534' : '1px solid rgba(174,195,176,0.35)',
              boxShadow: '0 4px 24px rgba(15,42,29,0.06)',
              transform: selected === 'agency' ? 'translateY(-4px)' : 'translateY(0)',
            }}
            onMouseEnter={(e) => {
              if (selected !== 'agency') {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'rgba(55,85,52,0.25)';
              }
            }}
            onMouseLeave={(e) => {
              if (selected !== 'agency') {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(174,195,176,0.35)';
              }
            }}
          >
            {selected === 'agency' && (
              <div
                className="absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#375534' }}
              >
                <Check size={16} color="#FFFFFF" />
              </div>
            )}

            <div className="flex justify-center mb-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#E3EED4' }}
              >
                <img
                  src={targetIcon}
                  alt="Propel target icon"
                  className="w-10 h-10"
                  style={{ filter: 'brightness(0) saturate(100%) invert(38%) sepia(11%) saturate(1115%) hue-rotate(76deg) brightness(91%) contrast(88%)' }}
                />
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-3" style={{ color: '#0F2A1D' }}>
              Service Business / Agency
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: '#6B9071' }}>
              I provide services to clients. I want to browse opportunities and submit AI-generated proposals.
            </p>
          </motion.button>
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: selected ? 1 : 0.5 }}
          onClick={handleContinue}
          disabled={!selected}
          className="px-8 py-3 rounded-full font-medium transition-all duration-200 hover:scale-102 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#375534', color: '#FFFFFF' }}
        >
          Continue
        </motion.button>
      </div>
    </div>
  );
}
