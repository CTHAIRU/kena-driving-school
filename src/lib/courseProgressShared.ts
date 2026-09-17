export const COMPUTER_MODULES = [
  { moduleNumber: 1, title: "Introduction to computers", defaultClasswork: "Typing speed assessment & OS desktop navigation" },
  { moduleNumber: 2, title: "Computer systems & Hardware", defaultClasswork: "Identifying system components, ports & peripheral setup" },
  { moduleNumber: 3, title: "MS Windows", defaultClasswork: "File management, directory tree creation & control panel settings" },
  { moduleNumber: 4, title: "MS Word", defaultClasswork: "Professional business memo, tables & mail merge document" },
  { moduleNumber: 5, title: "MS Excel", defaultClasswork: "Financial ledger with SUMIF, VLOOKUP, pivot tables & chart" },
  { moduleNumber: 6, title: "MS Access", defaultClasswork: "Relational student database schema, query design & data entry form" },
  { moduleNumber: 7, title: "MS Publisher", defaultClasswork: "Tri-fold corporate brochure and branded event certificate" },
  { moduleNumber: 8, title: "MS PowerPoint", defaultClasswork: "10-slide multimedia pitch presentation with slide transitions" },
  { moduleNumber: 9, title: "Email & Internet", defaultClasswork: "Professional email etiquette, cloud storage setup & online search" },
  { moduleNumber: 10, title: "Computer maintenance", defaultClasswork: "Disk cleanup, antivirus scanning & backup drive image creation" },
];

export const AI_MODULES = [
  { moduleNumber: 1, title: "Introduction to AI & its basic", defaultClasswork: "AI ecosystem mapping and setting up generative AI environment" },
  { moduleNumber: 2, title: "AI models ;Chatgpt, Gemini Etc.", defaultClasswork: "Comparative analysis of Claude, GPT-4, and Gemini capabilities" },
  { moduleNumber: 3, title: "Research and writing assistants", defaultClasswork: "Drafting literature review and executive report using Perplexity & AI writers" },
  { moduleNumber: 4, title: "Notebook LM", defaultClasswork: "Grounded source ingestion, source citations & creating audio podcast overview" },
  { moduleNumber: 5, title: "Prompt engineering", defaultClasswork: "Few-shot prompting, persona development & system instruction matrix" },
  { moduleNumber: 6, title: "Image generation", defaultClasswork: "Midjourney & Stable Diffusion prompt composition with aspect ratios" },
  { moduleNumber: 7, title: "Audio generation", defaultClasswork: "Voice cloning, realistic Kenyan accent synthesis & podcast intro audio" },
  { moduleNumber: 8, title: "Video generation", defaultClasswork: "Storyboard script-to-video production using Runway & Pika" },
  { moduleNumber: 9, title: "Job creation &marketing", defaultClasswork: "AI-driven freelance service gig launch and marketing campaign portfolio" },
];

export type CourseType = "DRIVING" | "COMPUTER" | "AI";
export type CertificateStatus = "UNCOLLECTED" | "PRINTING" | "COLLECTED";

export function detectCourseType(pkgName?: string | null, category?: string | null): CourseType {
  const name = (pkgName || "").toLowerCase();
  const cat = (category || "").toLowerCase();

  if (name.includes("computer") || cat.includes("computer")) {
    return "COMPUTER";
  }
  if (name.includes("artificial") || name.includes("ai") || cat.includes("ai")) {
    return "AI";
  }
  return "DRIVING";
}

export function generateCertificateNumber(courseType: CourseType, admissionOrId: string): string {
  const year = new Date().getFullYear();
  const cleanId = admissionOrId.replace(/[^A-Z0-9]/gi, "").toUpperCase().slice(-4) || Math.floor(1000 + Math.random() * 9000);
  const prefix = courseType === "COMPUTER" ? "COMP" : courseType === "AI" ? "AIM" : "DRV";
  return `KENA-CERT-${prefix}-${year}-${cleanId}`;
}
