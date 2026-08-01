import { motion } from 'motion/react';
import { Link } from 'react-router';
import { TrendingUp, Plus, ShieldCheck } from 'lucide-react';
import { Sidebar } from './Sidebar';
import targetIcon from "../../assets/brand/propel-mark-transparent.png";

export default function EntrepreneurDashboard() {
  const stats = [
    { label: 'Active Opportunities', value: 3, trend: '+2 this week' },
    { label: 'Proposals Received', value: 12, trend: '+5 this week' },
    { label: 'Shortlisted', value: 4, trend: '+1 this week' },
    { label: 'Accepted', value: 1, trend: 'New!' },
  ];

  const opportunities = [
    {
      id: 1,
      title: 'Social Media Campaign',
      service: 'Marketing',
      budget: '$5-10k',
      proposals: 5,
      status: 'Active',
    },
    {
      id: 2,
      title: 'Website Redesign',
      service: 'Web Design',
      budget: '$15-20k',
      proposals: 8,
      status: 'Active',
    },
  ];

  return (
    <div className="flex min-h-screen relative">
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

      <Sidebar userType="entrepreneur" />

      <div className="flex-1 ml-60 relative z-10 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1
            className="text-3xl"
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontStyle: 'italic',
              color: '#0F2A1D',
            }}
          >
            Good morning, Sarah
          </h1>
          <Link
            to="/entrepreneur/create-opportunity"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all hover:scale-102"
            style={{ backgroundColor: '#375534', color: '#FFFFFF' }}
          >
            <Plus size={18} />
            Post Opportunity
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="p-6 rounded-[20px] backdrop-blur-[20px]"
              style={{
                backgroundColor: 'rgba(255,255,255,0.65)',
                border: '1px solid rgba(174,195,176,0.35)',
                boxShadow: '0 4px 24px rgba(15,42,29,0.06)',
              }}
            >
              <div className="text-4xl font-bold mb-2" style={{ color: '#0F2A1D' }}>
                {stat.value}
              </div>
              <div className="text-sm mb-2" style={{ color: '#6B9071' }}>
                {stat.label}
              </div>
              <div className="flex items-center gap-1 text-xs" style={{ color: '#375534' }}>
                <TrendingUp size={12} />
                {stat.trend}
              </div>
            </motion.div>
          ))}
        </div>

        <Link
          to="/entrepreneur/deal-intelligence"
          className="flex items-center justify-between gap-4 p-6 rounded-[20px] mb-8 transition-all hover:-translate-y-1"
          style={{
            backgroundColor: 'rgba(255,255,255,0.65)',
            border: '1px solid rgba(174,195,176,0.35)',
            boxShadow: '0 4px 24px rgba(15,42,29,0.06)',
          }}
        >
          <div className="flex items-center gap-4">
            <ShieldCheck size={28} style={{ color: '#375534' }} />
            <div>
              <h2 className="font-semibold" style={{ color: '#0F2A1D' }}>AI Deal Intelligence</h2>
              <p className="text-sm" style={{ color: '#6B9071' }}>Build briefs, match agencies, score proposals, and verify trust signals.</p>
            </div>
          </div>
          <span className="px-4 py-2 rounded-full text-sm" style={{ backgroundColor: '#375534', color: '#FFFFFF' }}>Open</span>
        </Link>

        {/* Recent Opportunities */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#0F2A1D' }}>
            Recent Opportunities
          </h2>
          <div className="space-y-4">
            {opportunities.map((opp, idx) => (
              <motion.div
                key={opp.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (idx + 4) * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="p-6 rounded-[20px] backdrop-blur-[20px] transition-all hover:-translate-y-1 hover:shadow-lg cursor-pointer"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.65)',
                  border: '1px solid rgba(174,195,176,0.35)',
                  boxShadow: '0 4px 24px rgba(15,42,29,0.06)',
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2" style={{ color: '#0F2A1D' }}>
                      {opp.title}
                    </h3>
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className="px-3 py-1 text-xs rounded-full"
                        style={{ backgroundColor: 'rgba(174,195,176,0.3)', color: '#375534' }}
                      >
                        {opp.service}
                      </span>
                      <span
                        className="px-3 py-1 text-xs rounded-full"
                        style={{ backgroundColor: 'rgba(55,85,52,0.1)', color: '#375534' }}
                      >
                        {opp.budget}
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1" style={{ color: '#375534' }}>
                      {opp.proposals}
                    </div>
                    <div className="text-xs" style={{ color: '#6B9071' }}>
                      Proposals
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t" style={{ borderColor: 'rgba(174,195,176,0.2)' }}>
                  <span className="text-sm" style={{ color: '#6B9071' }}>
                    Status: {opp.status}
                  </span>
                  <Link
                    to="/entrepreneur/proposals"
                    className="text-sm font-medium hover:underline"
                    style={{ color: '#375534' }}
                  >
                    View Proposals
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Empty state example (if no opportunities) */}
        {opportunities.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 px-6 rounded-[20px] backdrop-blur-[20px]"
            style={{
              backgroundColor: 'rgba(255,255,255,0.65)',
              border: '1px solid rgba(174,195,176,0.35)',
            }}
          >
            <img src={targetIcon} alt="Propel target icon" className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2" style={{ color: '#0F2A1D' }}>
              Post your first opportunity
            </h3>
            <p className="mb-6" style={{ color: '#6B9071' }}>
              Get started by creating an opportunity and receive AI-generated proposals from agencies
            </p>
            <Link
              to="/entrepreneur/create-opportunity"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all hover:scale-102"
              style={{ backgroundColor: '#375534', color: '#FFFFFF' }}
            >
              <Plus size={18} />
              Create Opportunity
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
