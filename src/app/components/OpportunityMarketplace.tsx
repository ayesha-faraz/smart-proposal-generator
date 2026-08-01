import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Search, Filter } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { opportunities } from '../lib/marketplace';
import targetIcon from "../../assets/brand/propel-mark-transparent.png";

export default function OpportunityMarketplace() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Social Media', 'Web Design', 'Branding', 'Development', 'Content'];

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesFilter = activeFilter === 'All' || opp.service === activeFilter;
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          opp.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl backdrop-blur-[12px] flex items-center gap-3"
          style={{
            backgroundColor: 'rgba(255,255,255,0.6)',
            border: '1px solid rgba(174,195,176,0.35)',
          }}
        >
          <Search size={20} style={{ color: '#6B9071' }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search opportunities..."
            className="flex-1 bg-transparent outline-none"
            style={{ color: '#0F2A1D' }}
          />
          <Filter size={20} style={{ color: '#6B9071' }} />
        </motion.div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all"
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

        {/* Results count */}
        <p className="text-sm mb-6" style={{ color: '#6B9071' }}>
          {filteredOpportunities.length} opportunities found
        </p>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredOpportunities.map((opp, idx) => (
            <motion.div
              key={opp.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative p-6 rounded-[20px] backdrop-blur-[20px] transition-all hover:-translate-y-1"
              style={{
                backgroundColor: 'rgba(255,255,255,0.65)',
                border: opp.isNew ? '1px solid rgba(55,85,52,0.25)' : '1px solid rgba(174,195,176,0.35)',
                boxShadow: '0 4px 24px rgba(15,42,29,0.06)',
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <span
                  className="px-3 py-1 text-xs rounded-full"
                  style={{ backgroundColor: 'rgba(174,195,176,0.3)', color: '#375534' }}
                >
                  {opp.industry}
                </span>
                {opp.isNew && (
                  <span
                    className="px-3 py-1 text-xs rounded-full animate-pulse"
                    style={{ backgroundColor: 'rgba(107,144,113,0.2)', color: '#375534' }}
                  >
                    New
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold mb-2" style={{ color: '#0F2A1D' }}>
                {opp.title}
              </h3>

              <div className="flex items-center gap-2 mb-3 text-sm" style={{ color: '#6B9071' }}>
                <span>{opp.company}</span>
                <span>•</span>
                <span>{opp.location}</span>
              </div>

              <p className="text-sm mb-4 line-clamp-2" style={{ color: '#375534' }}>
                {opp.brief}
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
                  style={{ backgroundColor: 'rgba(174,195,176,0.2)', color: '#375534' }}
                >
                  {opp.timeline}
                </span>
                <span
                  className="px-3 py-1 text-xs rounded-full"
                  style={{ backgroundColor: 'rgba(174,195,176,0.2)', color: '#375534' }}
                >
                  {opp.service}
                </span>
              </div>

              <div className="flex gap-2">
                <Link
                  to={`/agency/opportunity/${opp.id}`}
                  className="flex-1 text-center py-2 rounded-full text-sm font-medium border transition-all hover:scale-102"
                  style={{ borderColor: '#375534', color: '#375534' }}
                >
                  View Brief
                </Link>
                <Link
                  to={`/agency/generate-proposal/${opp.id}`}
                  className="flex-1 text-center py-2 rounded-full text-sm font-medium transition-all hover:scale-102"
                  style={{ backgroundColor: '#375534', color: '#FFFFFF' }}
                >
                  Generate Proposal
                </Link>
              </div>

              <img
                src={targetIcon}
                alt="Propel target icon"
                className="absolute right-4 bottom-4 w-4 h-4 opacity-35"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
