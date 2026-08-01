import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Suspense, lazy, useState } from 'react';

import LandingPage from './components/LandingPage';

const LoginSignup = lazy(() => import('./components/LoginSignup'));
const AccountTypeSelection = lazy(() => import('./components/AccountTypeSelection'));
const ProfileSetup = lazy(() => import('./components/ProfileSetup'));
const EntrepreneurDashboard = lazy(() => import('./components/EntrepreneurDashboard'));
const CreateOpportunity = lazy(() => import('./components/CreateOpportunity'));
const AgencyDashboard = lazy(() => import('./components/AgencyDashboard'));
const OpportunityMarketplace = lazy(() => import('./components/OpportunityMarketplace'));
const OpportunityDetail = lazy(() => import('./components/OpportunityDetail'));
const AIProposalGenerator = lazy(() => import('./components/AIProposalGenerator'));
const ProposalPreview = lazy(() => import('./components/ProposalPreview'));
const ProposalComparison = lazy(() => import('./components/ProposalComparison'));
const MyProposals = lazy(() => import('./components/MyProposals'));
const Settings = lazy(() => import('./components/Settings'));
const DealIntelligence = lazy(() => import('./components/DealIntelligence'));
const DealRoom = lazy(() => import('./components/DealRoom'));

const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F7FAF3', color: '#375534' }}>
    Loading...
  </div>
);

export default function App() {
  const [userType, setUserType] = useState<'entrepreneur' | 'agency' | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <BrowserRouter>
      <div className="min-h-screen w-full">
        <Suspense fallback={<RouteFallback />}>
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
            <Route path="/agency/generate-proposal/:id" element={<AIProposalGenerator />} />
            <Route path="/agency/proposals" element={<MyProposals />} />
            <Route path="/agency/proposal/:id" element={<ProposalPreview />} />
            <Route path="/agency/deal-room" element={<DealRoom />} />

            {/* Shared routes */}
            <Route path="/settings" element={<Settings userType={userType} />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}
