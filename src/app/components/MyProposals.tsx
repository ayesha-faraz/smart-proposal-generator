import { motion } from "motion/react";
import { Link } from "react-router";
import { Copy, Download, Edit, Eye, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Sidebar } from "./Sidebar";
import targetIcon from "../../assets/brand/propel-mark-transparent.png";
import { downloadPDF, formDataToProposal } from "../lib/proposals";
import { getLocalProposals, getOpportunityById } from "../lib/marketplace";

export default function MyProposals() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [notice, setNotice] = useState("");
  const saved = getLocalProposals();
  const sampleOpportunity = getOpportunityById("1");
  const proposals = saved.length
    ? saved
    : [
        formDataToProposal({
          businessName: "Propel Studio",
          tagline: "We turn business ambition into client-ready execution.",
          phone: "+92 300 1234567",
          website: "www.propelstudio.pk",
          email: "hello@propelstudio.pk",
          logo: null,
          logoFileName: "",
          clientName: sampleOpportunity.company,
          clientIndustry: sampleOpportunity.industry,
          clientWebsite: sampleOpportunity.website || "",
          targetAudience: sampleOpportunity.targetAudience,
          currentSituation: sampleOpportunity.currentSituation,
          mainGoal: sampleOpportunity.mainGoal,
          competitors: sampleOpportunity.competitors || "",
          serviceOffering: "Web Design",
          projectBrief: sampleOpportunity.brief,
          budget: "2500000",
          currency: "PKR",
          timeline: "3 Months",
          tone: "Professional",
          urgency: "Soon",
          language: "English",
        }),
      ];

  const visibleProposals = useMemo(() => {
    if (activeFilter === "All") return proposals;
    return proposals.filter(() => activeFilter === "Draft");
  }, [activeFilter, proposals]);

  return (
    <div className="flex min-h-screen relative">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-25 blur-[60px]"
          style={{ background: "radial-gradient(circle, rgba(174,195,176,1) 0%, transparent 65%)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-15 blur-[50px]"
          style={{ background: "radial-gradient(circle, rgba(107,144,113,1) 0%, transparent 60%)" }}
        />
      </div>

      <Sidebar userType="agency" />

      <div className="flex-1 ml-60 relative z-10 p-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h1
            className="text-3xl"
            style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", color: "#0F2A1D" }}
          >
            My Proposals
          </h1>
          <Link
            to="/agency/browse"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium"
            style={{ backgroundColor: "#375534", color: "#FFFFFF" }}
          >
            <Sparkles size={16} />
            Generate from brief
          </Link>
        </div>

        <div className="flex gap-2 mb-8">
          {["All", "Draft", "Sent", "Shortlisted"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                backgroundColor: activeFilter === filter ? "#375534" : "rgba(255,255,255,0.6)",
                color: activeFilter === filter ? "#FFFFFF" : "#375534",
                border: "1px solid rgba(174,195,176,0.4)",
              }}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {visibleProposals.map((proposal, idx) => (
            <motion.div
              key={proposal.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap xl:flex-nowrap items-center gap-6 p-6 rounded-[20px] backdrop-blur-[20px] transition-all hover:-translate-y-1"
              style={{
                backgroundColor: "rgba(255,255,255,0.65)",
                border: "1px solid rgba(174,195,176,0.35)",
                boxShadow: "0 4px 24px rgba(15,42,29,0.06)",
              }}
            >
              <img src={targetIcon} alt="Propel target icon" className="w-5 h-5 flex-shrink-0" />

              <div className="flex-1 min-w-[220px]">
                <div className="font-bold mb-1" style={{ color: "#0F2A1D" }}>
                  {proposal.formData.clientName}
                </div>
                <div className="text-sm mb-2" style={{ color: "#6B9071" }}>
                  {proposal.formData.mainGoal}
                </div>
                <span className="px-2 py-1 text-xs rounded-full" style={{ backgroundColor: "rgba(174,195,176,0.3)", color: "#375534" }}>
                  {proposal.formData.serviceOffering}
                </span>
              </div>

              <div className="text-right">
                <div className="font-bold mb-1" style={{ color: "#375534" }}>
                  {proposal.formData.budget} {proposal.formData.currency}
                </div>
                <div className="text-sm" style={{ color: "#6B9071" }}>
                  {proposal.formData.timeline}
                </div>
              </div>

              <span className="px-4 py-2 text-xs rounded-full font-medium" style={{ backgroundColor: "rgba(107,144,113,0.2)", color: "#375534" }}>
                Draft
              </span>

              <div className="text-sm" style={{ color: "#6B9071" }}>
                {proposal.dateGenerated.toLocaleDateString()}
              </div>

              <div className="flex items-center gap-2">
                <Link to={`/agency/proposal/${proposal.id}`} className="p-2 rounded-lg hover:bg-white/60 transition-colors" title="View">
                  <Eye size={18} style={{ color: "#375534" }} />
                </Link>
                <Link to="/agency/browse" className="p-2 rounded-lg hover:bg-white/60 transition-colors" title="Generate another">
                  <Edit size={18} style={{ color: "#375534" }} />
                </Link>
                <button onClick={() => downloadPDF(proposal)} className="p-2 rounded-lg hover:bg-white/60 transition-colors" title="Download">
                  <Download size={18} style={{ color: "#375534" }} />
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(proposal.generatedContent);
                    setNotice("Proposal text copied.");
                  }}
                  className="p-2 rounded-lg hover:bg-white/60 transition-colors"
                  title="Copy"
                >
                  <Copy size={18} style={{ color: "#375534" }} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {notice && (
          <p className="mt-4 text-sm" style={{ color: "#6B9071" }}>
            {notice}
          </p>
        )}

        {!saved.length && (
          <p className="mt-5 text-sm" style={{ color: "#6B9071" }}>
            Showing a sample proposal. Once you generate from an opportunity, your saved proposals will appear here.
          </p>
        )}
      </div>
    </div>
  );
}
