import { Router } from "express";

const router = Router();
const proposals = [];

router.get("/", (req, res) => {
  const { userEmail } = req.query;
  const result = userEmail
    ? proposals.filter((proposal) => proposal.userEmail === userEmail)
    : proposals;

  res.json({ proposals: result });
});

router.get("/:id", (req, res) => {
  const proposal = proposals.find((item) => item.id === req.params.id);

  if (!proposal) {
    return res.status(404).json({ error: "Proposal not found" });
  }

  res.json({ proposal });
});

router.post("/", (req, res) => {
  const {
    userEmail,
    businessName,
    clientName,
    clientIndustry,
    serviceOffering,
    budget,
    currency,
    timeline,
    tone,
    brief,
    generatedContent,
  } = req.body;

  if (!userEmail || !businessName || !clientName || !generatedContent) {
    return res.status(400).json({
      error: "userEmail, businessName, clientName, and generatedContent are required",
    });
  }

  const proposal = {
    id: crypto.randomUUID(),
    userEmail,
    businessName,
    clientName,
    clientIndustry: clientIndustry || "",
    serviceOffering: serviceOffering || "",
    budget: budget || "",
    currency: currency || "USD",
    timeline: timeline || "",
    tone: tone || "Professional",
    brief: brief || "",
    generatedContent,
    createdAt: new Date().toISOString(),
  };

  proposals.unshift(proposal);
  res.status(201).json({ proposal });
});

router.delete("/:id", (req, res) => {
  const index = proposals.findIndex((item) => item.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: "Proposal not found" });
  }

  const [deletedProposal] = proposals.splice(index, 1);
  res.json({ proposal: deletedProposal });
});

export default router;
