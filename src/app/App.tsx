import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { useState } from 'react';

// Import all screens
import LandingPage from './components/LandingPage';
import LoginSignup from './components/LoginSignup';
import AccountTypeSelection from './components/AccountTypeSelection';
import ProfileSetup from './components/ProfileSetup';
import EntrepreneurDashboard from './components/EntrepreneurDashboard';
import CreateOpportunity from './components/CreateOpportunity';
import AgencyDashboard from './components/AgencyDashboard';
import OpportunityMarketplace from './components/OpportunityMarketplace';
import OpportunityDetail from './components/OpportunityDetail';
import AIProposalGenerator from './components/AIProposalGenerator';
import ProposalPreview from './components/ProposalPreview';
import ProposalComparison from './components/ProposalComparison';
import MyProposals from './components/MyProposals';
import Settings from './components/Settings';
import DealIntelligence from './components/DealIntelligence';
import DealRoom from './components/DealRoom';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  const [userType, setUserType] = useState<'entrepreneur' | 'agency' | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <BrowserRouter>
      <div className="min-h-screen w-full">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={<LoginSignup onLogin={(type) => {
              setIsAuthenticated(true);
              setUserType(type);
            }} />}
          />
          <Route
            path="/account-type"
            element={<AccountTypeSelection onSelect={(type) => setUserType(type)} />}
          />
          <Route path="/profile-setup" element={<ProfileSetup userType={userType} />} />

          {/* Entrepreneur routes */}
          <Route path="/entrepreneur/dashboard" element={<EntrepreneurDashboard />} />
          <Route path="/entrepreneur/create-opportunity" element={<CreateOpportunity />} />
          <Route path="/entrepreneur/proposals" element={<ProposalComparison />} />
          <Route path="/entrepreneur/deal-intelligence" element={<DealIntelligence />} />

          {/* Agency routes */}
          <Route path="/agency/dashboard" element={<AgencyDashboard />} />
          <Route path="/agency/browse" element={<OpportunityMarketplace />} />
          <Route path="/agency/opportunity/:id" element={<OpportunityDetail />} />
          <Route path="/agency/generate-proposal/:id" element={<ErrorBoundary><AIProposalGenerator /></ErrorBoundary>} />
          <Route path="/agency/proposals" element={<MyProposals />} />
          <Route path="/agency/proposal/:id" element={<ProposalPreview />} />
          <Route path="/agency/deal-room" element={<DealRoom />} />

          {/* Shared routes */}
          <Route path="/settings" element={<Settings userType={userType} />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
