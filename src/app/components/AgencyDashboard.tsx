import { motion } from 'motion/react';
import { Link } from 'react-router';
import { TrendingUp, ArrowRight, ShieldCheck } from 'lucide-react';
import { Sidebar } from './Sidebar';
import targetIcon from "../../assets/brand/propel-mark-transparent.png";

export default function AgencyDashboard() {
  const stats = [
    { label: 'Opportunities Viewed', value: 24, trend: '+8 this week' },
    { label: 'Proposals Sent', value: 12, trend: '+3 this week' },
    { label: 'Shortlisted', value: 5, trend: '+2 this week' },
    { label: 'Accepted', value: 2, trend: 'New!' },
  ];

  const recommended = [
    {
      id: 1,
      title: 'E-commerce Website Development',
      company: 'TechStart Inc',
      budget: '$15-20k',
      service: 'Development',
      timeline: '3 months',
    },
    {
      id: 2,
      title: 'Brand Identity Design',
      company: 'GreenLeaf Co',
      budget: '$8-12k',
      service: 'Branding',
      timeline: '2 months',
    },
  ];

  const myProposals = [
    { client: 'TechStart Inc', service: 'Web Design', budget: '$18k', status: 'Shortlisted', date: '2 days ago' },
    { client: 'GreenLeaf Co', service: 'Branding', budget: '$10k', status: 'Sent', date: '5 days ago' },
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

      <Sidebar userType="agency" />

      <div className="flex-1 ml-60 relative z-10 p-8">
        {/* Header */}
        <h1
          className="text-3xl mb-8"
          style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontStyle: 'italic',
            color: '#0F2A1D',
          }}
        >
          Good morning, Alex
        </h1>

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

        {/* Recommended Opportunities */}
        <Link
          to="/agency/deal-room"
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
              <h2 className="font-semibold" style={{ color: '#0F2A1D' }}>Deal Room & Escrow</h2>
              <p className="text-sm" style={{ color: '#6B9071' }}>Manage milestones, files, approvals, payments, and agency analytics.</p>
            </div>
          </div>
          <span className="px-4 py-2 rounded-full text-sm" style={{ backgroundColor: '#375534', color: '#FFFFFF' }}>Open</span>
        </Link>

        {/* Recommended Opportunities */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold" style={{ color: '#0F2A1D' }}>
              Recommended Opportunities
            </h2>
            <Link to="/agency/browse" className="text-sm font-medium hover:underline" style={{ color: '#375534' }}>
              View all
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {recommended.map((opp, idx) => (
              <motion.div
                key={opp.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (idx + 4) * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex-shrink-0 w-80 p-6 rounded-[20px] backdrop-blur-[20px] transition-all hover:-translate-y-1"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.65)',
                  border: '1px solid rgba(174,195,176,0.35)',
                  boxShadow: '0 4px 24px rgba(15,42,29,0.06)',
                }}
              >
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#0F2A1D' }}>
                  {opp.title}
                </h3>
                <p className="text-sm mb-4" style={{ color: '#6B9071' }}>
                  {opp.company}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span
                    className="px-3 py-1 text-xs rounded-full"
                    style={{ backgroundColor: 'rgba(55,85,52,0.1)', color: '#375534' }}
                  >
                    {opp.budget}
                  </span>
                  <span
                    className="px-3 py-1 text-xs rounded-full"
                    style={{ backgroundColor: 'rgba(174,195,176,0.3)', color: '#375534' }}
                  >
                    {opp.service}
                  </span>
                  <span className="text-xs" style={{ color: '#6B9071' }}>
                    {opp.timeline}
                  </span>
                </div>
                <Link
                  to={`/agency/generate-proposal/${opp.id}`}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full font-medium transition-all hover:scale-102"
                  style={{ backgroundColor: '#375534', color: '#FFFFFF' }}
                >
                  Generate Proposal
                  <ArrowRight size={16} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* My Proposals */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold" style={{ color: '#0F2A1D' }}>
              My Proposals
            </h2>
            <Link to="/agency/proposals" className="text-sm font-medium hover:underline" style={{ color: '#375534' }}>
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {myProposals.map((prop, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (idx + 6) * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-4 p-4 rounded-[20px] backdrop-blur-[20px]"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.65)',
                  border: '1px solid rgba(174,195,176,0.35)',
                }}
              >
                <img src={targetIcon} alt="" className="w-5 h-5" />
                <div className="flex-1">
                  <div className="font-semibold text-sm" style={{ color: '#0F2A1D' }}>
                    {prop.client}
                  </div>
                  <div className="text-xs" style={{ color: '#6B9071' }}>
                    {prop.service}
                  </div>
                </div>
                <div className="font-semibold" style={{ color: '#375534' }}>
                  {prop.budget}
                </div>
                <span
                  className="px-3 py-1 text-xs rounded-full"
                  style={{
                    backgroundColor: prop.status === 'Shortlisted' ? 'rgba(55,85,52,0.1)' : 'rgba(107,144,113,0.1)',
                    color: '#375534',
                  }}
                >
                  {prop.status}
                </span>
                <span className="text-xs" style={{ color: '#6B9071' }}>
                  {prop.date}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
