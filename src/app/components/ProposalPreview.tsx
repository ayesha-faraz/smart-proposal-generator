import { motion } from "motion/react";
import { Link, useParams } from "react-router";
import { Copy, Download, Edit, Eye, Send } from "lucide-react";
import { useState } from "react";
import logoImg from "../../assets/brand/propel-logo-transparent.png";
import targetIcon from "../../assets/brand/propel-mark-transparent.png";
import { convertMarkdownToHTML, downloadPDF, formDataToProposal } from "../lib/proposals";
import { getLocalProposalById, getOpportunityById } from "../lib/marketplace";

export default function ProposalPreview() {
  const { id } = useParams();
  const [status, setStatus] = useState("Draft");
  const [notice, setNotice] = useState("");
  const generated = getLocalProposalById(id);
  const fallbackOpportunity = getOpportunityById(id);
  const proposal =
    generated ??
    formDataToProposal({
      businessName: "Propel Studio",
      tagline: "We turn business ambition into client-ready execution.",
      phone: "+92 300 1234567",
      website: "www.propelstudio.pk",
      email: "hello@propelstudio.pk",
      logo: null,
      logoFileName: "",
      clientName: fallbackOpportunity.company,
      clientIndustry: fallbackOpportunity.industry,
      clientWebsite: fallbackOpportunity.website || "",
      targetAudience: fallbackOpportunity.targetAudience,
      currentSituation: fallbackOpportunity.currentSituation,
      mainGoal: fallbackOpportunity.mainGoal,
      competitors: fallbackOpportunity.competitors || "",
      serviceOffering: fallbackOpportunity.service,
      projectBrief: fallbackOpportunity.brief,
      budget: fallbackOpportunity.budget,
      currency: fallbackOpportunity.budget.includes("PKR") ? "PKR" : "USD",
      timeline: "3 Months",
      tone: "Professional",
      urgency: "Consultative",
      language: "English",
    });

  const sentDate = proposal.dateGenerated.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen relative">
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

      <nav
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-[12px] border-b"
        style={{ backgroundColor: "rgba(255,255,255,0.6)", borderColor: "rgba(174,195,176,0.2)" }}
      >
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link to="/agency/dashboard">
            <img src={logoImg} alt="Propel - Global B2B Marketplace logo" className="h-10" />
          </Link>

          <div className="flex items-center gap-3">
            <span className="px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: "rgba(107,144,113,0.2)", color: "#375534" }}>
              {status}
            </span>
            <button onClick={() => downloadPDF(proposal)} className="p-2 rounded-full hover:bg-white/40 transition-colors" title="Download PDF">
              <Download size={18} style={{ color: "#375534" }} />
            </button>
            <Link to={`/agency/generate-proposal/${fallbackOpportunity.id}`} className="p-2 rounded-full hover:bg-white/40 transition-colors" title="Edit inputs">
              <Edit size={18} style={{ color: "#375534" }} />
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
          <motion.aside initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div
              className="p-6 rounded-[20px] backdrop-blur-[20px] sticky top-24"
              style={{ backgroundColor: "rgba(255,255,255,0.65)", border: "1px solid rgba(174,195,176,0.35)" }}
            >
              <h3 className="text-sm font-semibold mb-4" style={{ color: "#0F2A1D" }}>
                Proposal Metadata
              </h3>

              <Meta label="Client" value={proposal.formData.clientName} />
              <Meta label="Service" value={proposal.formData.serviceOffering} />
              <Meta label="Investment" value={`${proposal.formData.budget} ${proposal.formData.currency}`} />
              <Meta label="Timeline" value={proposal.formData.timeline} />
              <Meta label="Created" value={sentDate} />
              <Meta label="Views" value="0 views" />

              <div className="space-y-2 pt-6 mt-6 border-t" style={{ borderColor: "rgba(174,195,176,0.2)" }}>
                <button
                  onClick={() => {
                    setStatus("Sent");
                    setNotice("Proposal marked as sent.");
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm hover:bg-white/40 transition-colors"
                  style={{ color: "#375534" }}
                >
                  <Send size={14} />
                  Send Proposal
                </button>
                <button onClick={() => downloadPDF(proposal)} className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm hover:bg-white/40 transition-colors" style={{ color: "#375534" }}>
                  <Download size={14} />
                  Download PDF
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(proposal.generatedContent);
                    setNotice("Proposal text copied.");
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm hover:bg-white/40 transition-colors"
                  style={{ color: "#375534" }}
                >
                  <Copy size={14} />
                  Copy Text
                </button>
              </div>
              {notice && (
                <p className="mt-4 text-xs text-center" style={{ color: "#6B9071" }}>
                  {notice}
                </p>
              )}

              <div className="mt-6 pt-6 border-t flex justify-center" style={{ borderColor: "rgba(174,195,176,0.2)" }}>
                <img src={targetIcon} alt="Propel target icon" className="w-8 h-8 opacity-50" />
              </div>
            </div>
          </motion.aside>

          <motion.main initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div
              className="p-10 md:p-16 rounded-[20px] max-w-4xl mx-auto"
              style={{ backgroundColor: "#FFFFFF", boxShadow: "0 8px 48px rgba(15,42,29,0.1)" }}
            >
              <div className="mb-10 pb-8 border-b-4" style={{ borderColor: "#375534" }}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {proposal.formData.logo ? (
                      <img src={proposal.formData.logo} alt="" className="w-12 h-12 object-contain rounded-lg" />
                    ) : (
                      <img src={targetIcon} alt="Propel target icon" className="w-10 h-10" />
                    )}
                    <div>
                      <div className="font-semibold" style={{ color: "#0F2A1D" }}>
                        {proposal.formData.businessName}
                      </div>
                      <div className="text-sm" style={{ color: "#6B9071" }}>
                        Proposal for {proposal.formData.clientName}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-right" style={{ color: "#6B9071" }}>
                    {sentDate}
                  </div>
                </div>
              </div>

              <article
                className="proposal-document"
                dangerouslySetInnerHTML={{ __html: convertMarkdownToHTML(proposal.generatedContent) }}
              />
            </div>
          </motion.main>
        </div>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-3">
      <div className="text-xs mb-1" style={{ color: "#6B9071" }}>
        {label}
      </div>
      <div className="text-sm font-medium" style={{ color: "#0F2A1D" }}>
        {value}
      </div>
    </div>
  );
}
