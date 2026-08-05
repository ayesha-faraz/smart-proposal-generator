import { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { ProposalForm, ProposalFormData } from "./components/ProposalForm";
import { ProposalView } from "./components/ProposalView";
import { LoginRegister } from "./components/LoginRegister";
import { MyProposals } from "./components/MyProposals";
import { BackgroundOrbs } from "./components/BackgroundOrbs";

type Screen = "login" | "form" | "proposal" | "myProposals";

interface SavedProposal {
  id: string;
  formData: ProposalFormData;
  dateGenerated: Date;
}

interface UserData {
  email: string;
  name: string;
  businessName: string;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");
  const [proposalData, setProposalData] = useState<ProposalFormData | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [savedProposals, setSavedProposals] = useState<SavedProposal[]>([]);

  // Check localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("propel_user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser) as UserData;
        setUserData(user);
        setCurrentScreen("form");
      } catch (e) {
        console.error("Failed to parse user data");
      }
    }
  }, []);

  const handleLogin = (email: string, name: string, businessName: string) => {
    const user = { email, name, businessName };
    setUserData(user);
    setCurrentScreen("form");
  };

  const handleLogout = () => {
    localStorage.removeItem('propel_user');
    window.location.href = '/';
  };

  const handleGenerate = (data: ProposalFormData) => {
    setProposalData(data);
    setCurrentScreen("proposal");

    // Save proposal to list
    const newProposal: SavedProposal = {
      id: Date.now().toString(),
      formData: data,
      dateGenerated: new Date(),
    };
    setSavedProposals([newProposal, ...savedProposals]);
  };

  const handleRegenerate = () => {
    if (proposalData) {
      setCurrentScreen("proposal");
    }
  };

  const handleBackToForm = () => {
    setCurrentScreen("form");
  };

  const handleViewProposal = (proposal: SavedProposal) => {
    setProposalData(proposal.formData);
    setCurrentScreen("proposal");
  };

  const handleMyProposalsClick = () => {
    setCurrentScreen("myProposals");
  };

  const handleGenerateNew = () => {
    setCurrentScreen("form");
  };

  const handleLogoClick = () => {
    const storedUser = localStorage.getItem("propel_user");
    if (storedUser) {
      // User is logged in, go to generator page
      setCurrentScreen("form");
    } else {
      // User is not logged in, go to login page
      setCurrentScreen("login");
    }
  };

  return (
    <div
      className="min-h-screen w-full relative"
      style={{
        background: '#060404',
        backgroundImage: [
          'radial-gradient(ellipse at 0% 70%, rgba(160,25,10,0.42) 0%, rgba(120,15,5,0.18) 28%, transparent 58%)',
          'radial-gradient(ellipse at 85% 18%, rgba(220,90,20,0.34) 0%, rgba(180,60,10,0.18) 34%, transparent 62%)',
          'radial-gradient(ellipse at 96% 0%, rgba(240,160,30,0.22) 0%, rgba(200,100,10,0.1) 45%, transparent 68%)',
          'radial-gradient(ellipse at 0% 0%, rgba(40,30,50,0.55) 0%, transparent 55%)',
          'radial-gradient(ellipse at center, transparent 28%, rgba(0,0,0,0.62) 100%)',
        ].join(', '),
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
        overflowX: 'hidden',
      }}
    >
      {/* Background Gradients for Generator and Proposal View */}
      {(currentScreen === "form" || currentScreen === "proposal") && (
        <BackgroundOrbs />
      )}

      {/* Content */}
      <div className="relative" style={{ zIndex: 10 }}>
        {currentScreen === "login" && <LoginRegister onLogin={handleLogin} />}

        {currentScreen !== "login" && (
          <>
            <Navbar
              onMyProposalsClick={handleMyProposalsClick}
              onLogoClick={handleLogoClick}
              currentPage={currentScreen === "myProposals" ? "proposals" : "form"}
              userEmail={userData?.email}
            />

            {currentScreen === "form" && <ProposalForm onGenerate={handleGenerate} defaultBusinessName={userData?.businessName} />}

            {currentScreen === "proposal" && proposalData && (
              <ProposalView
                formData={proposalData}
                onRegenerate={handleRegenerate}
                onBack={handleBackToForm}
              />
            )}

            {currentScreen === "myProposals" && (
              <MyProposals
                proposals={savedProposals}
                onViewProposal={handleViewProposal}
                onGenerateNew={handleGenerateNew}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
