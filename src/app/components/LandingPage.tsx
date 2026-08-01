import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Briefcase, Users, FileText, Rocket } from 'lucide-react';

const BrandMark = ({ className = '' }: { className?: string }) => (
  <span
    aria-hidden="true"
    className={`inline-flex items-center justify-center rounded-full font-bold ${className}`}
    style={{ backgroundColor: '#E3EED4', color: '#375534' }}
  >
    P
  </span>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
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

      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-[12px] border-b"
        style={{ borderColor: 'rgba(174,195,176,0.2)' }}
      >
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex transition-transform duration-200 hover:scale-[1.03]" aria-label="Go to Propel homepage">
            <span className="inline-flex items-center gap-2">
              <BrandMark className="w-8 h-8 text-sm" />
              <span className="font-semibold text-lg" style={{ color: '#0F2A1D' }}>Propel</span>
            </span>
          </Link>

          <div className="flex items-center gap-8">
            <a href="#entrepreneurs" className="text-sm hover:opacity-70 transition-opacity" style={{ color: '#375534' }}>
              For Entrepreneurs
            </a>
            <a href="#agencies" className="text-sm hover:opacity-70 transition-opacity" style={{ color: '#375534' }}>
              For Agencies
            </a>
            <Link to="/agency/browse" className="text-sm hover:opacity-70 transition-opacity" style={{ color: '#375534' }}>
              Browse
            </Link>
            <a href="#how-it-works" className="text-sm hover:opacity-70 transition-opacity" style={{ color: '#375534' }}>
              How it Works
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-5 py-2 text-sm rounded-full border transition-all hover:scale-105"
              style={{ borderColor: '#375534', color: '#375534' }}
            >
              Login
            </Link>
            <Link
              to="/account-type"
              className="px-5 py-2 text-sm rounded-full transition-all hover:scale-102 hover:shadow-lg"
              style={{ backgroundColor: '#375534', color: '#E3EED4' }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="inline-block px-4 py-2 rounded-full mb-6 text-sm"
                style={{
                  backgroundColor: 'rgba(174,195,176,0.3)',
                  border: '1px solid rgba(107,144,113,0.3)',
                  color: '#375534',
                }}
              >
                AI-Powered B2B Marketplace
              </div>

              <h1
                className="text-[64px] leading-tight mb-6"
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontStyle: 'italic',
                  color: '#0F2A1D',
                  lineHeight: 1.1,
                }}
              >
                Find the right agency. Close the deal faster.
              </h1>

              <p className="text-lg mb-8" style={{ color: '#6B9071' }}>
                Post your opportunity. Receive AI-crafted proposals. Build something great.
              </p>

              <div className="flex items-center gap-4">
                <Link
                  to="/account-type"
                  className="px-6 py-3 rounded-full font-medium transition-all duration-200 hover:scale-102 hover:shadow-lg"
                  style={{ backgroundColor: '#375534', color: '#FFFFFF' }}
                >
                  Post an Opportunity
                </Link>
                <Link
                  to="/account-type"
                  className="px-6 py-3 rounded-full font-medium border transition-all duration-200 hover:scale-102"
                  style={{ borderColor: '#375534', color: '#375534' }}
                >
                  Join as an Agency
                </Link>
              </div>
            </motion.div>

            {/* Right side - Floating cards */}
            <div className="relative h-[500px] hidden lg:block">
              <motion.div
                initial={{ opacity: 0, y: 40, rotate: -3 }}
                animate={{ opacity: 1, y: 0, rotate: -3 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-12 left-0 p-6 rounded-[20px] backdrop-blur-[20px] shadow-lg w-80"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.65)',
                  border: '1px solid rgba(174,195,176,0.35)',
                  boxShadow: '0 4px 24px rgba(15,42,29,0.06), 0 1px 4px rgba(15,42,29,0.04)',
                  animation: 'float 4s ease-in-out infinite',
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="font-semibold" style={{ color: '#0F2A1D' }}>
                    Social Media Campaign
                  </div>
                  <span className="px-3 py-1 text-xs rounded-full" style={{ backgroundColor: 'rgba(55,85,52,0.1)', color: '#375534' }}>
                    $5-10k
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 text-xs rounded-full" style={{ backgroundColor: 'rgba(174,195,176,0.3)', color: '#375534' }}>
                    Marketing
                  </span>
                  <span className="text-xs" style={{ color: '#6B9071' }}>
                    3 months
                  </span>
                </div>
                <p className="text-sm" style={{ color: '#6B9071' }}>
                  Looking for a creative agency to boost our brand presence...
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40, rotate: 2 }}
                animate={{ opacity: 1, y: 0, rotate: 2 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-64 right-0 p-6 rounded-[20px] backdrop-blur-[20px] shadow-lg w-80"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.65)',
                  border: '1px solid rgba(174,195,176,0.35)',
                  boxShadow: '0 4px 24px rgba(15,42,29,0.06), 0 1px 4px rgba(15,42,29,0.04)',
                  animation: 'float 4s ease-in-out infinite 2s',
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E3EED4' }}>
                    <motion.span
                      aria-hidden="true"
                      className="font-bold text-sm"
                      style={{ color: '#375534' }}
                      animate={{ rotate: [0, 8, 0] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      P
                    </motion.span>
                  </div>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: '#0F2A1D' }}>
                      Creative Studio Pro
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: 'rgba(55,85,52,0.1)', color: '#375534' }}>
                      Shortlisted
                    </span>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span style={{ color: '#6B9071' }}>Match Score</span>
                    <span style={{ color: '#375534' }}>94%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(174,195,176,0.2)' }}>
                    <div className="h-full rounded-full" style={{ backgroundColor: '#375534', width: '94%' }} />
                  </div>
                </div>
                <p className="text-sm" style={{ color: '#6B9071' }}>
                  Budget: $8,500 | 12 weeks delivery
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="relative z-10 py-20 px-8" style={{ backgroundColor: '#0F2A1D' }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="sr-only">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { num: '01', icon: Briefcase, title: 'Post a Brief', desc: 'Share your project needs and requirements' },
              { num: '02', icon: Users, title: 'Agencies Respond', desc: 'AI generates tailored proposals from agencies' },
              { num: '03', icon: FileText, title: 'Compare Proposals', desc: 'Review and shortlist the best matches' },
              { num: '04', icon: Rocket, title: 'Start Project', desc: 'Accept and begin your collaboration' },
            ].map((step, idx) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative text-center"
              >
                <div className="flex justify-center mb-4">
                  <motion.span
                    aria-hidden="true"
                    className="inline-flex w-8 h-8 items-center justify-center rounded-full font-bold"
                    style={{ backgroundColor: 'rgba(174,195,176,0.18)', color: '#AEC3B0' }}
                    animate={{ scale: [1, 1.08, 1], rotate: [0, 5, 0] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.15 }}
                  >
                    {step.num}
                  </motion.span>
                </div>
                <div
                  className="text-6xl mb-4"
                  style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    color: 'rgba(174,195,176,0.2)',
                  }}
                >
                  {step.num}
                </div>
                <h3 className="font-bold text-lg mb-2" style={{ color: '#FFFFFF' }}>
                  {step.title}
                </h3>
                <p className="text-sm" style={{ color: '#AEC3B0' }}>
                  {step.desc}
                </p>
                {idx < 3 && (
                  <div
                    className="absolute top-1/2 -right-4 w-8 h-px hidden md:block"
                    style={{ borderTop: '1px dashed rgba(174,195,176,0.3)' }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* For Entrepreneurs */}
      <section id="entrepreneurs" className="relative z-10 py-20 px-8" style={{ backgroundColor: '#E3EED4' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-[42px] mb-6" style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', color: '#0F2A1D' }}>
              For Entrepreneurs
            </h2>
            <p className="text-lg" style={{ color: '#375534' }}>
              Find the perfect agency partner for your next project.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { title: 'AI-Powered Matching', desc: 'Get proposals from agencies that truly fit your needs' },
              { title: 'Save Time', desc: 'No more hours spent researching and reaching out to agencies' },
              { title: 'Compare Easily', desc: 'Side-by-side comparison of proposals and pricing' },
            ].map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="p-6 rounded-[20px] backdrop-blur-[20px]"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.65)',
                  border: '1px solid rgba(174,195,176,0.35)',
                }}
              >
                <h3 className="font-semibold mb-2" style={{ color: '#0F2A1D' }}>
                  {benefit.title}
                </h3>
                <p className="text-sm" style={{ color: '#6B9071' }}>
                  {benefit.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* For Agencies */}
      <section id="agencies" className="relative z-10 py-20 px-8" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4 order-2 lg:order-1">
            {[
              { title: 'AI-Generated Proposals', desc: 'Create professional proposals in minutes, not hours' },
              { title: 'Quality Leads', desc: 'Connect with entrepreneurs who are ready to hire' },
              { title: 'Showcase Your Work', desc: 'Build a portfolio that attracts the right clients' },
            ].map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="p-6 rounded-[20px] backdrop-blur-[20px]"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.65)',
                  border: '1px solid rgba(174,195,176,0.35)',
                }}
              >
                <h3 className="font-semibold mb-2" style={{ color: '#0F2A1D' }}>
                  {benefit.title}
                </h3>
                <p className="text-sm" style={{ color: '#6B9071' }}>
                  {benefit.desc}
                </p>
              </motion.div>
            ))}
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-[42px] mb-6" style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', color: '#0F2A1D' }}>
              For Service Businesses
            </h2>
            <p className="text-lg" style={{ color: '#375534' }}>
              Win more clients with AI-powered proposal generation.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-8" style={{ backgroundColor: '#0F2A1D' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <Link to="/" className="inline-flex transition-transform duration-200 hover:scale-[1.03]" aria-label="Go to Propel homepage">
              <BrandMark className="w-6 h-6 text-xs mb-4 md:mb-0" />
            </Link>
            <div className="flex items-center gap-8 mb-4 md:mb-0">
              <a href="#entrepreneurs" className="text-sm hover:opacity-70 transition-opacity" style={{ color: '#AEC3B0' }}>
                For Entrepreneurs
              </a>
              <a href="#agencies" className="text-sm hover:opacity-70 transition-opacity" style={{ color: '#AEC3B0' }}>
                For Agencies
              </a>
              <Link to="/agency/browse" className="text-sm hover:opacity-70 transition-opacity" style={{ color: '#AEC3B0' }}>
                Browse
              </Link>
            </div>
            <p className="text-sm" style={{ color: '#AEC3B0' }}>
              Build something great together
            </p>
          </div>
          <div className="pt-8" style={{ borderTop: '1px solid rgba(174,195,176,0.1)' }}>
            <p className="text-center text-sm" style={{ color: '#6B9071' }}>
              © 2026 Propel. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(var(--rotation)); }
          50% { transform: translateY(-8px) rotate(var(--rotation)); }
        }
      `}</style>
    </div>
  );
}
