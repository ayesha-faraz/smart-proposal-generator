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

type PdfDoc = InstanceType<typeof jsPDF>;

export const normalizePdfText = (value: string) =>
  String(value || "-")
    .replace(/\u00a0/g, " ")
    .replace(/[\u200b-\u200d\ufeff]/g, "")
    .replace(/[ \t]+/g, " ")
    .trim() || "-";

const breakLongWord = (doc: PdfDoc, word: string, maxWidth: number) => {
  const pieces: string[] = [];
  let current = "";
  for (const char of word) {
    const next = current + char;
    if (current && doc.getTextWidth(next) > maxWidth) {
      pieces.push(current);
      current = char;
    } else {
      current = next;
    }
  }
  if (current) pieces.push(current);
  return pieces;
};

export const splitPdfTextToLines = (doc: PdfDoc, text: string, maxWidth: number) => {
  const paragraphs = String(text || "-").split(/\r?\n/);
  const lines: string[] = [];

  paragraphs.forEach((paragraph, paragraphIndex) => {
    const words = normalizePdfText(paragraph).split(" ");
    let lineText = "";

    words.forEach((word) => {
      const wordParts = doc.getTextWidth(word) > maxWidth ? breakLongWord(doc, word, maxWidth) : [word];
      wordParts.forEach((part) => {
        const candidate = lineText ? `${lineText} ${part}` : part;
        if (lineText && doc.getTextWidth(candidate) > maxWidth) {
          lines.push(lineText);
          lineText = part;
        } else {
          lineText = candidate;
        }
      });
    });

    if (lineText) lines.push(lineText);
    if (paragraphIndex < paragraphs.length - 1) lines.push("");
  });

  return lines.length ? lines : ["-"];
};

export const createProposalPdfDoc = ({
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

  const resetTextState = () => {
    if ("setCharSpace" in doc && typeof doc.setCharSpace === "function") {
      doc.setCharSpace(0);
    }
  };

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
    resetTextState();
    doc.setFont("helvetica", options.fontStyle ?? "normal");
    doc.setFontSize(size);
    doc.setTextColor(options.color ?? dark);
    const lines = splitPdfTextToLines(doc, text, maxWidth);
    for (const lineText of lines) {
      addPageIfNeeded(lineText ? lineHeight : lineHeight * 0.6);
      if (lineText) doc.text(lineText, x, y, { align: "left", charSpace: 0, maxWidth });
      y += lineHeight;
    }
  };

  const drawSection = (title: string, body: string) => {
    addPageIfNeeded(60);
    y += 12;
    resetTextState();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.setTextColor(dark);
    doc.text(normalizePdfText(title), margin, y, { align: "left", charSpace: 0 });
    y += 18;
    drawWrappedText(body, margin, contentWidth, { color: muted });
  };

  const drawBullet = (item: string) => {
    const bulletX = margin;
    const textX = margin + 16;
    const lineHeight = 14.8;
    resetTextState();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(muted);
    const lines = splitPdfTextToLines(doc, item, contentWidth - 16);
    lines.forEach((lineText, index) => {
      addPageIfNeeded(lineHeight);
      if (index === 0) {
        doc.setTextColor(orange);
        doc.text("•", bulletX, y, { align: "left", charSpace: 0 });
        doc.setTextColor(muted);
      }
      doc.text(lineText, textX, y, { align: "left", charSpace: 0, maxWidth: contentWidth - 16 });
      y += lineHeight;
    });
    y += 2;
  };

  doc.setProperties({
    title: `${clientName} Proposal`,
    subject: `Proposal from ${businessName}`,
    creator: "Propel",
  });

  doc.setFillColor("#fffaf6");
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  resetTextState();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(23);
  doc.setTextColor(dark);
  const headlineLines = splitPdfTextToLines(doc, headline, contentWidth - 150);
  doc.text(headlineLines, margin, y, { align: "left", charSpace: 0 });

  if (contactLines.length > 0) {
    resetTextState();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(muted);
    contactLines.forEach((lineText, index) => {
      doc.text(normalizePdfText(lineText), pageWidth - margin, margin + index * 12, { align: "right", charSpace: 0 });
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
    doc.text("Scope of Work", margin, y, { align: "left", charSpace: 0 });
    y += 20;
    scope.forEach((item) => drawBullet(item));
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
      resetTextState();
      doc.text("Item", margin + 8, y + 16, { align: "left", charSpace: 0 });
      doc.text("Details", margin + itemWidth + 8, y + 16, { align: "left", charSpace: 0 });
      doc.text("Cost", pageWidth - margin - 8, y + 16, { align: "right", charSpace: 0 });
      y += 25;
    };

    drawInvestmentHeader();

    investment.forEach((row) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      const itemLines = splitPdfTextToLines(doc, row.item, itemWidth - 12);
      doc.setFont("helvetica", "normal");
      const detailsLines = splitPdfTextToLines(doc, row.details, detailsWidth - 12);
      const rowHeight = Math.max(itemLines.length, detailsLines.length, 1) * 13 + 16;
      const startedNewPage = addPageIfNeeded(rowHeight + 10);
      if (startedNewPage) drawInvestmentHeader();
      doc.setDrawColor(line);
      doc.line(margin, y, pageWidth - margin, y);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(dark);
      resetTextState();
      doc.text(itemLines, margin + 8, y + 14, { align: "left", charSpace: 0 });
      doc.setFont("helvetica", "normal");
      doc.setTextColor(muted);
      doc.text(detailsLines, margin + itemWidth + 8, y + 14, { align: "left", charSpace: 0 });
      doc.setFont("helvetica", "bold");
      doc.setTextColor(dark);
      doc.text(normalizePdfText(row.cost), pageWidth - margin - 8, y + 14, { align: "right", charSpace: 0 });
      y += rowHeight;
    });

    if (totalInvestment) {
      addPageIfNeeded(32);
      y += 10;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(orange);
      doc.text(normalizePdfText(totalInvestment), pageWidth - margin, y, { align: "right", charSpace: 0 });
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
    resetTextState();
    doc.text(`${normalizePdfText(businessName)} | Confidential`, margin, pageHeight - 16, { align: "left", charSpace: 0 });
    doc.text(`Page ${pageNumber} of ${pageCount}`, pageWidth - margin, pageHeight - 16, { align: "right", charSpace: 0 });
  }

  return doc;
};

export const downloadProposalPdf = (input: ProposalPdfInput) => {
  const doc = createProposalPdfDoc(input);
  const { filename } = input;
  doc.save(`${sanitizeFilename(filename)}.pdf`);
};
