import { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { ProposalForm, ProposalFormData } from "./components/ProposalForm";
import { ProposalView } from "./components/ProposalView";
import { LoginRegister } from "./components/LoginRegister";
import { MyProposals } from "./components/MyProposals";
import { BackgroundOrbs } from "./components/BackgroundOrbs";
import {
  getCurrentProfile,
  getCurrentSession,
  getProposalRecords,
  saveProposalRecord,
  signOut,
  supabase,
  type UserRole,
} from "./lib/supabase";
import { AppProposal, formDataToProposal, proposalToRecord, recordToProposal } from "./lib/proposals";
import { clearPropelSession } from "./lib/logout";

type Screen = "login" | "form" | "proposal" | "myProposals";

interface UserData {
  id: string;
  email: string;
  name: string;
  businessName: string;
  role: UserRole;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");
  const [proposalData, setProposalData] = useState<AppProposal | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [savedProposals, setSavedProposals] = useState<AppProposal[]>([]);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const applySession = async () => {
    const session = await getCurrentSession();
    const profile = await getCurrentProfile(session);
    if (!session?.user || !profile) {
      clearPropelSession();
      setUserData(null);
      setCurrentScreen("login");
      return;
    }

    const user = {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      businessName: profile.business_name,
      role: profile.role,
    };
    localStorage.setItem("propel_user", JSON.stringify(user));
    setUserData(user);
    setCurrentScreen("form");
  };

  useEffect(() => {
    const isDemoMode = new URLSearchParams(window.location.search).get("demo") === "1";
    if (isDemoMode) {
      const user = {
        id: "demo",
        email: "demo@propel.com",
        name: "Alex",
        businessName: "Propel Studio",
        role: "agency" as UserRole,
      };
      localStorage.setItem("propel_user", JSON.stringify(user));
      setUserData(user);
      setCurrentScreen("form");
      setIsAuthLoading(false);
      return;
    }

    applySession()
      .catch((error) => {
        console.warn("Could not restore Supabase session", error);
        clearPropelSession();
      })
      .finally(() => setIsAuthLoading(false));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        clearPropelSession();
        setUserData(null);
        setCurrentScreen("login");
        return;
      }

      getCurrentProfile(session)
        .then((profile) => {
          if (!profile) return;
          const user = {
            id: profile.id,
            email: profile.email,
            name: profile.name,
            businessName: profile.business_name,
            role: profile.role,
          };
          localStorage.setItem("propel_user", JSON.stringify(user));
          setUserData(user);
          setCurrentScreen("form");
        })
        .catch((error) => console.warn("Could not load user profile", error));
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!userData?.email) return;

    const localKey = `propel_proposals_${userData.email}`;
    const loadSavedProposals = async () => {
      try {
        if (userData.id === "demo") {
          throw new Error("Demo mode uses local proposals only.");
        }
        const records = await getProposalRecords();
        const proposals = records.map(recordToProposal);
        setSavedProposals(proposals);
        localStorage.setItem(localKey, JSON.stringify(proposals));
      } catch (error) {
        console.warn("Could not load proposals from Supabase", error);
        const stored = localStorage.getItem(localKey);
        if (stored) {
          try {
            const proposals = (JSON.parse(stored) as AppProposal[]).map((proposal) => ({
              ...proposal,
              dateGenerated: new Date(proposal.dateGenerated),
            }));
            setSavedProposals(proposals);
          } catch (e) {
            console.error("Failed to parse saved proposals");
          }
        }
      }
    };

    loadSavedProposals();
  }, [userData?.email]);

  const handleLogin = async () => {
    try {
      await applySession();
    } catch (error) {
      console.warn("Could not load profile after login", error);
    }
  };

  const handleLogout = async () => {
    await signOut();
    clearPropelSession();
    setUserData(null);
    setProposalData(null);
    setSavedProposals([]);
    window.history.replaceState(null, "", window.location.pathname);
    setCurrentScreen("login");
  };

  const handleGenerate = async (data: ProposalFormData) => {
    const newProposal = formDataToProposal(data);
    setProposalData(newProposal);
    setCurrentScreen("proposal");

    setSavedProposals((previous) => {
      const next = [newProposal, ...previous];
      if (userData?.email) {
        localStorage.setItem(`propel_proposals_${userData.email}`, JSON.stringify(next));
      }
      return next;
    });

    if (userData?.email && userData.id !== "demo") {
      try {
        const saved = await saveProposalRecord(
          proposalToRecord(data, newProposal.generatedContent, userData.email),
        );
        if (saved?.id) {
          setSavedProposals((previous) =>
            previous.map((proposal) =>
              proposal.id === newProposal.id
                ? {
                    ...proposal,
                    id: String(saved.id),
                    dateGenerated: saved.created_at ? new Date(saved.created_at) : proposal.dateGenerated,
                  }
                : proposal,
            ),
          );
          setProposalData((current) =>
            current?.id === newProposal.id
              ? {
                  ...current,
                  id: String(saved.id),
                  dateGenerated: saved.created_at ? new Date(saved.created_at) : current.dateGenerated,
                }
              : current,
          );
        }
      } catch (error) {
        console.warn("Could not save proposal to Supabase", error);
      }
    }
  };

  const handleRegenerate = () => {
    if (proposalData) {
      setCurrentScreen("proposal");
    }
  };

  const handleBackToForm = () => {
    setCurrentScreen("form");
  };

  const handleViewProposal = (proposal: AppProposal) => {
    setProposalData(proposal);
    setCurrentScreen("proposal");
  };

  const handleMyProposalsClick = () => {
    setCurrentScreen("myProposals");
  };

  const handleGenerateNew = () => {
    setCurrentScreen("form");
  };

  const handleLogoClick = () => {
    if (userData) {
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
        overflow: 'hidden',
      }}
    >
      {/* Background Gradients for Generator and Proposal View */}
      {(currentScreen === "form" || currentScreen === "proposal") && (
        <BackgroundOrbs />
      )}

      {/* Content */}
      <div className="relative" style={{ zIndex: 10 }}>
        {isAuthLoading && (
          <div className="min-h-screen flex items-center justify-center" style={{ color: "#f5f0eb" }}>
            Loading...
          </div>
        )}

        {!isAuthLoading && currentScreen === "login" && <LoginRegister onLogin={handleLogin} />}

        {!isAuthLoading && currentScreen !== "login" && (
          <>
            <Navbar
              onMyProposalsClick={handleMyProposalsClick}
              onLogoClick={handleLogoClick}
              onLogout={handleLogout}
              currentPage={currentScreen === "myProposals" ? "proposals" : "form"}
              userEmail={userData?.email}
            />

            {currentScreen === "form" && <ProposalForm onGenerate={handleGenerate} defaultBusinessName={userData?.businessName} />}

            {currentScreen === "proposal" && proposalData && (
              <ProposalView
                proposal={proposalData}
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
