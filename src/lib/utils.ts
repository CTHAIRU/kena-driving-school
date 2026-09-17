import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number): string {
  return `KSh ${new Intl.NumberFormat("en-KE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)}`;
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-KE", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(date: Date | string | null | undefined): string {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleTimeString("en-KE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return "-";
  return `${formatDate(date)} at ${formatTime(date)}`;
}

// Official NTSA (National Transport and Safety Authority of Kenya) Curriculum Competencies
export const STANDARD_DRIVING_SKILLS = [
  "Model Town Board (MTB) & Road Signs",
  "Cockpit Drill & 5-Point Safety Checks",
  "Vehicle Mechanics & Engine Fluids Check",
  "Clutch Biting Point & Smooth Moving Off",
  "Hill Start (Mlima) & Handbrake Balance",
  "Steering Technique & Three-Point Turn",
  "90-Degree Reverse Bay Parking",
  "Parallel Parking (Kando ya Barabara)",
  "Roundabouts & Kenyan Junction Priority",
  "Highway Roadcraft (Thika Superhighway)",
  "Hazard Perception & Emergency Braking",
  "Night & Adverse Weather Roadcraft",
];

export { OFFICIAL_PRACTICAL_TOPICS, type PracticalTopic } from "./practicalTopics";
