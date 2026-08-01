import { motion } from "motion/react";
import { Link, useParams } from "react-router";
import { ArrowLeft, Bookmark, Sparkles } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { getOpportunityById, opportunities } from "../lib/marketplace";
import { useState } from "react";

export default function OpportunityDetail() {
  const { id } = useParams();
  const [saved, setSaved] = useState(false);
  const opportunity = getOpportunityById(id);
  const similar = opportunities.filter((item) => item.id !== opportunity.id && item.service === opportunity.service).slice(0, 2);

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
        <div className="max-w-6xl mx-auto">
          <Link to="/agency/browse" className="inline-flex items-center gap-2 text-sm font-medium mb-6" style={{ color: "#375534" }}>
            <ArrowLeft size={16} />
            Back to marketplace
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-[20px] backdrop-blur-[20px]"
              style={{
                backgroundColor: "rgba(255,255,255,0.65)",
                border: "1px solid rgba(174,195,176,0.35)",
                boxShadow: "0 4px 24px rgba(15,42,29,0.06)",
              }}
            >
              <h1
                className="text-4xl mb-5"
                style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", color: "#0F2A1D" }}
              >
                {opportunity.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 mb-6 text-sm" style={{ color: "#6B9071" }}>
                <span>{opportunity.company}</span>
                <span>|</span>
                <span>{opportunity.industry}</span>
                <span>|</span>
                <span>{opportunity.location}</span>
              </div>

              <div className="flex flex-wrap gap-3 mb-8">
                {[opportunity.budget, opportunity.timeline, opportunity.service].map((tag) => (
                  <span key={tag} className="px-4 py-2 rounded-full text-sm" style={{ backgroundColor: "rgba(174,195,176,0.2)", color: "#375534" }}>
                    {tag}
                  </span>
                ))}
              </div>

              <section className="space-y-6" style={{ color: "#375534" }}>
                <div>
                  <h2 className="text-lg font-semibold mb-2" style={{ color: "#0F2A1D" }}>Brief</h2>
                  <p className="leading-relaxed">{opportunity.brief}</p>
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-2" style={{ color: "#0F2A1D" }}>Main Goal</h2>
                  <p className="leading-relaxed">{opportunity.mainGoal}</p>
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-2" style={{ color: "#0F2A1D" }}>Current Situation</h2>
                  <p className="leading-relaxed">{opportunity.currentSituation}</p>
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-2" style={{ color: "#0F2A1D" }}>Target Audience</h2>
                  <p className="leading-relaxed">{opportunity.targetAudience}</p>
                </div>
              </section>
            </motion.div>

            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div
                className="p-6 rounded-[20px] backdrop-blur-[20px] sticky top-8"
                style={{
                  backgroundColor: "rgba(255,255,255,0.65)",
                  border: "1px solid rgba(174,195,176,0.35)",
                  boxShadow: "0 4px 24px rgba(15,42,29,0.06)",
                }}
              >
                <h3 className="text-lg font-semibold mb-3" style={{ color: "#0F2A1D" }}>
                  Ready to pitch?
                </h3>
                <p className="text-sm mb-6" style={{ color: "#6B9071" }}>
                  Propel will combine this brief with your stored company profile and prepare a client-ready proposal.
                </p>

                <Link
                  to={`/agency/generate-proposal/${opportunity.id}`}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-full font-medium mb-3 transition-all hover:scale-102"
                  style={{ backgroundColor: "#375534", color: "#FFFFFF" }}
                >
                  <Sparkles size={17} />
                  Generate Proposal
                </Link>

                <button
                  onClick={() => setSaved((value) => !value)}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-full font-medium border transition-all hover:scale-102"
                  style={{
                    borderColor: "#375534",
                    color: saved ? "#FFFFFF" : "#375534",
                    backgroundColor: saved ? "#375534" : "transparent",
                  }}
                >
                  <Bookmark size={17} />
                  {saved ? "Saved" : "Save Opportunity"}
                </button>

                {similar.length > 0 && (
                  <div className="mt-8 pt-6 border-t" style={{ borderColor: "rgba(174,195,176,0.2)" }}>
                    <h4 className="text-sm font-semibold mb-4" style={{ color: "#0F2A1D" }}>
                      Similar Opportunities
                    </h4>
                    <div className="space-y-3">
                      {similar.map((item) => (
                        <Link
                          to={`/agency/opportunity/${item.id}`}
                          key={item.id}
                          className="block p-3 rounded-lg"
                          style={{ backgroundColor: "rgba(174,195,176,0.1)" }}
                        >
                          <div className="text-sm font-medium mb-1" style={{ color: "#0F2A1D" }}>
                            {item.title}
                          </div>
                          <div className="text-xs" style={{ color: "#6B9071" }}>
                            {item.budget} | {item.timeline}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.aside>
          </div>
        </div>
      </div>
    </div>
  );
}
