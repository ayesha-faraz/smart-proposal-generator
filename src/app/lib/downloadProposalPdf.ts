import { jsPDF } from "jspdf";

interface ProposalPdfSection {
  title: string;
  body: string;
}

interface ProposalPdfInvestmentRow {
  item: string;
  details: string;
  cost: string;
}

interface ProposalPdfInput {
  filename: string;
  businessName: string;
  clientName: string;
  currentDate: string;
  headline: string;
  subtitle: string;
  contactLines?: string[];
  sections: ProposalPdfSection[];
  scope?: string[];
  investment?: ProposalPdfInvestmentRow[];
  totalInvestment?: string;
  footer?: string;
}

const sanitizeFilename = (value: string) =>
  value
    .trim()
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase() || "proposal";

export const downloadProposalPdf = ({
  filename,
  businessName,
  clientName,
  currentDate,
  headline,
  subtitle,
  contactLines = [],
  sections,
  scope = [],
  investment = [],
  totalInvestment,
  footer,
}: ProposalPdfInput) => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 48;
  const contentWidth = pageWidth - margin * 2;
  const orange = "#e8712a";
  const dark = "#1a1210";
  const muted = "#6f625b";
  const pale = "#fff0e6";
  const line = "#eadbd0";
  let y = margin;

  const addPageIfNeeded = (height: number) => {
    if (y + height <= pageHeight - margin) return false;
    doc.addPage();
    doc.setFillColor("#fffaf6");
    doc.rect(0, 0, pageWidth, pageHeight, "F");
    y = margin;
    return true;
  };

  const drawWrappedText = (
    text: string,
    x: number,
    maxWidth: number,
    options: { size?: number; color?: string; lineHeight?: number; fontStyle?: "normal" | "bold" } = {},
  ) => {
    const size = options.size ?? 10.5;
    const lineHeight = options.lineHeight ?? size * 1.55;
    doc.setFont("helvetica", options.fontStyle ?? "normal");
    doc.setFontSize(size);
    doc.setTextColor(options.color ?? dark);
    const lines = doc.splitTextToSize(text || "-", maxWidth) as string[];
    for (const lineText of lines) {
      addPageIfNeeded(lineHeight);
      doc.text(lineText, x, y);
      y += lineHeight;
    }
  };

  const drawSection = (title: string, body: string) => {
    addPageIfNeeded(60);
    y += 12;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.setTextColor(dark);
    doc.text(title, margin, y);
    y += 18;
    drawWrappedText(body, margin, contentWidth, { color: muted });
  };

  doc.setProperties({
    title: `${clientName} Proposal`,
    subject: `Proposal from ${businessName}`,
    creator: "Propel",
  });

  doc.setFillColor("#fffaf6");
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(23);
  doc.setTextColor(dark);
  const headlineLines = doc.splitTextToSize(headline, contentWidth - 150);
  doc.text(headlineLines, margin, y);

  if (contactLines.length > 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(muted);
    contactLines.forEach((lineText, index) => {
      doc.text(lineText, pageWidth - margin, margin + index * 12, { align: "right" });
    });
  }

  y += headlineLines.length * 28;
  drawWrappedText(subtitle, margin, contentWidth - 20, { color: orange, fontStyle: "bold", size: 11.5 });
  drawWrappedText(`Prepared for ${clientName} on ${currentDate}`, margin, contentWidth, { color: muted, size: 9.5 });
  y += 8;
  doc.setDrawColor(orange);
  doc.setLineWidth(3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 18;

  sections.forEach((section) => drawSection(section.title, section.body));

  if (scope.length > 0) {
    addPageIfNeeded(64);
    y += 12;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.setTextColor(dark);
    doc.text("Scope of Work", margin, y);
    y += 20;
    scope.forEach((item) => {
      drawWrappedText(`- ${item}`, margin + 8, contentWidth - 8, { color: muted });
    });
  }

  if (investment.length > 0) {
    addPageIfNeeded(100);
    y += 12;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.setTextColor(dark);
    doc.text("Investment", margin, y);
    y += 18;

    const itemWidth = 120;
    const costWidth = 92;
    const detailsWidth = contentWidth - itemWidth - costWidth;

    const drawInvestmentHeader = () => {
      doc.setFillColor(232, 113, 42);
      doc.rect(margin, y, contentWidth, 25, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(dark);
      doc.text("Item", margin + 8, y + 16);
      doc.text("Details", margin + itemWidth + 8, y + 16);
      doc.text("Cost", pageWidth - margin - 8, y + 16, { align: "right" });
      y += 25;
    };

    drawInvestmentHeader();

    investment.forEach((row) => {
      const itemLines = doc.splitTextToSize(row.item, itemWidth - 12);
      const detailsLines = doc.splitTextToSize(row.details, detailsWidth - 12);
      const rowHeight = Math.max(itemLines.length, detailsLines.length, 1) * 13 + 16;
      const startedNewPage = addPageIfNeeded(rowHeight + 10);
      if (startedNewPage) drawInvestmentHeader();
      doc.setDrawColor(line);
      doc.line(margin, y, pageWidth - margin, y);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(dark);
      doc.text(itemLines, margin + 8, y + 14);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(muted);
      doc.text(detailsLines, margin + itemWidth + 8, y + 14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(dark);
      doc.text(row.cost, pageWidth - margin - 8, y + 14, { align: "right" });
      y += rowHeight;
    });

    if (totalInvestment) {
      addPageIfNeeded(32);
      y += 10;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(orange);
      doc.text(totalInvestment, pageWidth - margin, y, { align: "right" });
      y += 12;
    }
  }

  if (footer) {
    addPageIfNeeded(48);
    y += 24;
    doc.setFillColor(pale);
    doc.roundedRect(margin, y, contentWidth, 44, 8, 8, "F");
    y += 17;
    drawWrappedText(footer, margin + 14, contentWidth - 28, { color: muted, size: 8.5, lineHeight: 11 });
  }

  const pageCount = doc.getNumberOfPages();
  for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
    doc.setPage(pageNumber);
    doc.setDrawColor(line);
    doc.setLineWidth(0.5);
    doc.line(margin, pageHeight - 30, pageWidth - margin, pageHeight - 30);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(muted);
    doc.text(`${businessName} | Confidential`, margin, pageHeight - 16);
    doc.text(`Page ${pageNumber} of ${pageCount}`, pageWidth - margin, pageHeight - 16, { align: "right" });
  }

  doc.save(`${sanitizeFilename(filename)}.pdf`);
};
