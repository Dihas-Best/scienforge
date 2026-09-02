"use client";

import type { ComponentType } from "react";

/* --------------------------------------------------------------------------
 * ADDING A TOOL
 * 1. Write it in src/tools/<category>/ — either its own file (like ohms-law.tsx)
 *    or another makeTool() export in that category's pack.tsx.
 * 2. Import it below and add it to the TOOLS array.
 * 3. Run `npm run manifest` so routing, SEO and search pick it up.
 * ------------------------------------------------------------------------ */

import ohmsLaw from "@/tools/electronics/ohms-law";
import resistorColourCode from "@/tools/electronics/resistor-colour-code";
import voltageDivider from "@/tools/electronics/voltage-divider";
import ledResistor from "@/tools/electronics/led-resistor";
import * as elec from "@/tools/electronics/pack";

import projectileMotion from "@/tools/physics/projectile-motion";
import * as phys from "@/tools/physics/pack";

import molarity from "@/tools/chemistry/molarity";
import * as chem from "@/tools/chemistry/pack";

import quadratic from "@/tools/math/quadratic";
import graphing from "@/tools/math/graphing";
import * as maths from "@/tools/math/pack";

import unitConverter from "@/tools/converters/unit-converter";
import * as conv from "@/tools/converters/pack";

import * as health from "@/tools/health/pack";
import * as finance from "@/tools/finance/pack";

import type { Tool } from "./types";

export const TOOLS: Tool[] = [
  ohmsLaw, resistorColourCode, voltageDivider, ledResistor,
  elec.seriesParallel, elec.capacitorNetwork, elec.rcTimeConstant, elec.rcFilter,
  elec.lcResonance, elec.reactance, elec.opAmpGain, elec.timer555,
  elec.batteryLife, elec.transformerTurns, elec.decibels,

  projectileMotion, phys.newtonsSecondLaw, phys.kineticEnergy, phys.momentum,
  phys.circularMotion, phys.pendulum, phys.waveSpeed, phys.lensEquation,
  phys.escapeVelocity, phys.density,

  molarity, chem.idealGas, chem.phCalc, chem.dilution, chem.halfLife,

  graphing, quadratic, maths.percentage, maths.rightTriangle, maths.circleGeometry,
  maths.standardDeviation, maths.combinatorics, maths.logarithm,

  unitConverter, conv.numberBase,

  health.bmi, health.bmr, health.oneRepMax, health.pace,

  finance.compoundInterest, finance.loanPayment,
];

const BY_SLUG = new Map(TOOLS.map((t) => [t.slug, t]));

export function componentsFor(slug: string):
  | { Calculator: ComponentType; Article: ComponentType }
  | undefined {
  const t = BY_SLUG.get(slug);
  return t ? { Calculator: t.Calculator, Article: t.Article } : undefined;
}
