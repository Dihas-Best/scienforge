import type { ComponentType } from "react";

export type CategoryId =
  | "electronics"
  | "physics"
  | "chemistry"
  | "math"
  | "converters"
  | "health"
  | "finance";

export type Category = {
  id: CategoryId;
  name: string;
  blurb: string;
  /** Sub-headings used to group the tools on the category index. */
  groups: string[];
};

export type ToolMeta = {
  slug: string;
  category: CategoryId;
  group: string;
  /** Page <h1> and <title>. Write it the way someone would search for it. */
  title: string;
  /** Short label used in dense index lists. */
  label: string;
  /** Meta description, 140–160 characters. */
  description: string;
  keywords: string[];
  related?: string[];
};

export type Tool = ToolMeta & {
  /** The interactive calculator. Client component. */
  Calculator: ComponentType;
  /** The written explanation below the calculator. This is what gets indexed. */
  Article: ComponentType;
};

export const CATEGORIES: Category[] = [
  {
    id: "electronics",
    name: "Electronics",
    blurb: "Circuit values, component sizing and the arithmetic you do at a bench.",
    groups: ["Circuit basics", "Passive components", "Power and thermal", "Digital and data"],
  },
  {
    id: "physics",
    name: "Physics",
    blurb: "Mechanics, waves, optics and thermodynamics from a first-year course.",
    groups: ["Mechanics", "Energy and momentum", "Waves and optics", "Thermal and modern"],
  },
  {
    id: "chemistry",
    name: "Chemistry",
    blurb: "Solutions, gases and stoichiometry with the units kept honest.",
    groups: ["Solutions", "Gases", "Reactions"],
  },
  {
    id: "math",
    name: "Mathematics",
    blurb: "Algebra, geometry, statistics and a function plotter.",
    groups: ["Algebra", "Geometry", "Statistics", "Number tools"],
  },
  {
    id: "converters",
    name: "Converters",
    blurb: "Units, number bases and notation, converted both ways.",
    groups: ["Measurement", "Number systems"],
  },
  {
    id: "health",
    name: "Health and fitness",
    blurb: "Body composition, energy expenditure and training numbers.",
    groups: ["Body composition", "Energy", "Training"],
  },
  {
    id: "finance",
    name: "Finance",
    blurb: "Interest, loans and savings growth over time.",
    groups: ["Interest and growth", "Borrowing"],
  },
];

export function categoryById(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}
