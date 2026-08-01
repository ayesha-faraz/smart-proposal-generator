import { motion } from 'motion/react';
import { Sidebar } from './Sidebar';
import { Fragment, useMemo, useState } from 'react';

export default function ProposalComparison() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProposal, setSelectedProposal] = useState<number | null>(null);
  const [proposals, setProposals] = useState([
    {
      id: 1,
      agency: 'Creative Studio Pro',
      services: 'Web Design, Branding',
      budget: '$25,000',
      timeline: '3 months',
      status: 'Shortlisted',
    },
    {
      id: 2,
      agency: 'Digital Makers',
      services: 'Web Design',
      budget: '$18,500',
      timeline: '2.5 months',
      status: 'Sent',
    },
    {
      id: 3,
      agency: 'Design Co',
      services: 'Web Design, UX',
      budget: '$22,000',
      timeline: '3 months',
      status: 'Shortlisted',
    },
  ]);

  const filteredProposals = useMemo(() => {
    if (activeFilter === 'All') return proposals;
    if (activeFilter === 'Pending') return proposals.filter((proposal) => proposal.status === 'Sent');
    return proposals.filter((proposal) => proposal.status === activeFilter);
  }, [activeFilter, proposals]);

  const updateStatus = (id: number, status: string) => {
    setProposals((current) => current.map((proposal) => (proposal.id === id ? { ...proposal, status } : proposal)));
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Shortlisted':
        return { backgroundColor: 'rgba(227,238,212,1)', color: '#375534', border: '1px solid rgba(55,85,52,0.2)' };
      case 'Sent':
        return { backgroundColor: 'rgba(107,144,113,1)', color: '#FFFFFF' };
      case 'Accepted':
        return { backgroundColor: '#0F2A1D', color: '#E3EED4' };
      default:
        return { backgroundColor: 'rgba(174,195,176,0.2)', color: '#375534' };
    }
  };

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
        <h1
          className="text-3xl mb-6"
          style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontStyle: 'italic',
            color: '#0F2A1D',
          }}
        >
          Compare Proposals
        </h1>

        {/* Filter chips */}
        <div className="flex gap-2 mb-6">
          {['All', 'Shortlisted', 'Pending', 'Accepted'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                backgroundColor: activeFilter === filter ? '#375534' : 'rgba(255,255,255,0.6)',
                color: activeFilter === filter ? '#FFFFFF' : '#375534',
                border: '1px solid rgba(174,195,176,0.4)',
              }}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-[20px] backdrop-blur-[20px]"
            style={{
              backgroundColor: 'rgba(255,255,255,0.65)',
              border: '1px solid rgba(174,195,176,0.35)',
            }}
          >
            <div className="text-2xl font-bold mb-1" style={{ color: '#0F2A1D' }}>
              12
            </div>
            <div className="text-sm" style={{ color: '#6B9071' }}>
              Total Received
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
            className="p-4 rounded-[20px] backdrop-blur-[20px]"
            style={{
              backgroundColor: 'rgba(255,255,255,0.65)',
              border: '1px solid rgba(174,195,176,0.35)',
            }}
          >
            <div className="text-2xl font-bold mb-1" style={{ color: '#0F2A1D' }}>
              4
            </div>
            <div className="text-sm" style={{ color: '#6B9071' }}>
              Shortlisted
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="p-4 rounded-[20px] backdrop-blur-[20px]"
            style={{
              backgroundColor: 'rgba(255,255,255,0.65)',
              border: '1px solid rgba(174,195,176,0.35)',
            }}
          >
            <div className="text-2xl font-bold mb-1" style={{ color: '#0F2A1D' }}>
              3
            </div>
            <div className="text-sm" style={{ color: '#6B9071' }}>
              Pending Review
            </div>
          </motion.div>
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-[20px] backdrop-blur-[20px] overflow-hidden"
          style={{
            backgroundColor: 'rgba(255,255,255,0.65)',
            border: '1px solid rgba(174,195,176,0.35)',
          }}
        >
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(174,195,176,0.2)' }}>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#375534' }}>
                  Agency
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#375534' }}>
                  Services
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#375534' }}>
                  Budget
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#375534' }}>
                  Timeline
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#375534' }}>
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#375534' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProposals.map((proposal, idx) => (
                <Fragment key={proposal.id}>
                <motion.tr
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (idx + 3) * 0.06 }}
                  className="transition-colors hover:bg-white/40"
                  style={{ borderBottom: '1px solid rgba(174,195,176,0.1)' }}
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold" style={{ color: '#0F2A1D' }}>
                      {proposal.agency}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: '#6B9071' }}>
                    {proposal.services}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold" style={{ color: '#375534' }}>
                      {proposal.budget}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: '#6B9071' }}>
                    {proposal.timeline}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="px-3 py-1 text-xs rounded-full font-medium inline-block"
                      style={getStatusStyle(proposal.status)}
                    >
                      {proposal.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedProposal((current) => (current === proposal.id ? null : proposal.id))}
                        className="text-sm hover:underline"
                        style={{ color: '#375534' }}
                      >
                        {selectedProposal === proposal.id ? 'Hide' : 'View'}
                      </button>
                      <button onClick={() => updateStatus(proposal.id, 'Shortlisted')} className="px-3 py-1 text-xs rounded-full border transition-all hover:scale-102" style={{ borderColor: '#375534', color: '#375534' }}>
                        Shortlist
                      </button>
                      <button onClick={() => updateStatus(proposal.id, 'Accepted')} className="px-3 py-1 text-xs rounded-full transition-all hover:scale-102" style={{ backgroundColor: '#375534', color: '#FFFFFF' }}>
                        Accept
                      </button>
                    </div>
                  </td>
                </motion.tr>
                {selectedProposal === proposal.id && (
                  <tr>
                    <td colSpan={6} className="px-6 py-4" style={{ backgroundColor: 'rgba(227,238,212,0.35)', color: '#375534' }}>
                      {proposal.agency} proposes {proposal.services} for {proposal.budget}, delivered in {proposal.timeline}.
                    </td>
                  </tr>
                )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </div>
  );
}
