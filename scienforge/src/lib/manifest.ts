// GENERATED FILE — do not edit by hand.
// Run `npm run manifest` to regenerate from src/tools.
import type { ToolMeta } from "./types";

export const MANIFEST: ToolMeta[] = [
  {
    "slug": "molarity",
    "category": "chemistry",
    "group": "Solutions",
    "title": "Molarity and solution concentration calculator",
    "label": "Molarity",
    "description": "Convert between mass, moles, volume and concentration for a solution. Find how much solute to weigh out, or what concentration you made.",
    "keywords": [
      "molarity",
      "concentration",
      "moles",
      "solution",
      "mol/L",
      "dilution"
    ],
    "related": []
  },
  {
    "slug": "ideal-gas-law",
    "category": "chemistry",
    "group": "Gases",
    "title": "Ideal gas law calculator",
    "label": "Ideal gas law",
    "description": "Solve PV = nRT for pressure, volume, moles or temperature, with density and molar volume included.",
    "keywords": [
      "ideal gas law",
      "pv=nrt",
      "pressure",
      "moles",
      "gas constant"
    ],
    "related": [
      "molarity"
    ]
  },
  {
    "slug": "ph",
    "category": "chemistry",
    "group": "Solutions",
    "title": "pH and hydrogen ion concentration calculator",
    "label": "pH",
    "description": "Convert between pH, pOH and hydrogen or hydroxide ion concentration, at 25 °C.",
    "keywords": [
      "ph",
      "poh",
      "acid",
      "base",
      "hydrogen ion",
      "concentration"
    ],
    "related": [
      "molarity"
    ]
  },
  {
    "slug": "dilution",
    "category": "chemistry",
    "group": "Solutions",
    "title": "Dilution calculator",
    "label": "Dilution",
    "description": "Apply C1V1 = C2V2 to find the stock volume needed for a target concentration, and how much solvent to add.",
    "keywords": [
      "dilution",
      "c1v1",
      "stock solution",
      "concentration",
      "molarity"
    ],
    "related": [
      "molarity"
    ]
  },
  {
    "slug": "half-life",
    "category": "chemistry",
    "group": "Reactions",
    "title": "Half-life and radioactive decay calculator",
    "label": "Half-life",
    "description": "Find the remaining quantity after a given time, the decay constant, and the time to reach any fraction of the original amount.",
    "keywords": [
      "half life",
      "radioactive decay",
      "decay constant",
      "carbon dating",
      "exponential decay"
    ],
    "related": []
  },
  {
    "slug": "number-base-converter",
    "category": "converters",
    "group": "Number systems",
    "title": "Binary, hex and decimal converter",
    "label": "Number base converter",
    "description": "Convert a whole number between binary, octal, decimal, hexadecimal and any base from 2 to 36, with bit width shown.",
    "keywords": [
      "binary",
      "hexadecimal",
      "decimal",
      "octal",
      "base converter",
      "hex"
    ],
    "related": []
  },
  {
    "slug": "unit-converter",
    "category": "converters",
    "group": "Measurement",
    "title": "Unit converter",
    "label": "Unit converter",
    "description": "Convert length, mass, volume, energy, power, pressure, speed, angle, data and temperature between more than eighty units.",
    "keywords": [
      "unit converter",
      "metric",
      "imperial",
      "conversion",
      "temperature",
      "length"
    ],
    "related": [
      "number-base-converter"
    ]
  },
  {
    "slug": "led-resistor",
    "category": "electronics",
    "group": "Circuit basics",
    "title": "LED series resistor calculator",
    "label": "LED resistor",
    "description": "Size the current-limiting resistor for an LED from supply voltage, forward voltage and target current, with the nearest E24 value and power rating.",
    "keywords": [
      "led resistor",
      "current limiting resistor",
      "forward voltage",
      "e24"
    ],
    "related": [
      "ohms-law",
      "voltage-divider"
    ]
  },
  {
    "slug": "ohms-law",
    "category": "electronics",
    "group": "Circuit basics",
    "title": "Ohm's law calculator",
    "label": "Ohm's law",
    "description": "Solve for voltage, current or resistance from any two values, with power dissipation included. Accepts engineering shorthand like 4k7.",
    "keywords": [
      "ohms law",
      "voltage",
      "current",
      "resistance",
      "power",
      "V=IR"
    ],
    "related": [
      "voltage-divider",
      "led-resistor"
    ]
  },
  {
    "slug": "series-parallel-resistance",
    "category": "electronics",
    "group": "Circuit basics",
    "title": "Series and parallel resistance calculator",
    "label": "Series / parallel resistance",
    "description": "Combine up to four resistors in series or in parallel and get the equivalent resistance, plus the current split through each branch.",
    "keywords": [
      "series resistance",
      "parallel resistance",
      "equivalent resistance"
    ],
    "related": [
      "ohms-law",
      "voltage-divider"
    ]
  },
  {
    "slug": "capacitor-series-parallel",
    "category": "electronics",
    "group": "Passive components",
    "title": "Capacitors in series and parallel calculator",
    "label": "Capacitor networks",
    "description": "Find the equivalent capacitance of capacitors in series or parallel, with stored energy and charge at a given voltage.",
    "keywords": [
      "capacitor series",
      "capacitor parallel",
      "equivalent capacitance",
      "farad"
    ],
    "related": [
      "rc-time-constant",
      "lc-resonance"
    ]
  },
  {
    "slug": "rc-time-constant",
    "category": "electronics",
    "group": "Passive components",
    "title": "RC time constant calculator",
    "label": "RC time constant",
    "description": "Compute the time constant of a resistor-capacitor pair, plus the charge and discharge times to reach any percentage of the supply.",
    "keywords": [
      "rc time constant",
      "tau",
      "charging",
      "discharge",
      "capacitor"
    ],
    "related": [
      "rc-filter-cutoff",
      "capacitor-series-parallel"
    ]
  },
  {
    "slug": "rc-filter-cutoff",
    "category": "electronics",
    "group": "Passive components",
    "title": "RC low-pass and high-pass filter calculator",
    "label": "RC filter cutoff",
    "description": "Find the −3 dB cutoff frequency of a first-order RC filter, with the phase shift and the attenuation at any frequency you choose.",
    "keywords": [
      "rc filter",
      "cutoff frequency",
      "low pass",
      "high pass",
      "-3db"
    ],
    "related": [
      "rc-time-constant",
      "lc-resonance"
    ]
  },
  {
    "slug": "lc-resonance",
    "category": "electronics",
    "group": "Passive components",
    "title": "LC resonant frequency calculator",
    "label": "LC resonance",
    "description": "Find the resonant frequency of an inductor and capacitor, with characteristic impedance, Q factor and bandwidth.",
    "keywords": [
      "lc resonance",
      "resonant frequency",
      "tank circuit",
      "q factor"
    ],
    "related": [
      "rc-filter-cutoff",
      "reactance"
    ]
  },
  {
    "slug": "reactance",
    "category": "electronics",
    "group": "Passive components",
    "title": "Capacitive and inductive reactance calculator",
    "label": "Reactance",
    "description": "Compute the reactance of a capacitor or inductor at any frequency, and the current it passes at a given AC voltage.",
    "keywords": [
      "reactance",
      "capacitive reactance",
      "inductive reactance",
      "impedance",
      "xc",
      "xl"
    ],
    "related": [
      "lc-resonance",
      "rc-filter-cutoff"
    ]
  },
  {
    "slug": "op-amp-gain",
    "category": "electronics",
    "group": "Circuit basics",
    "title": "Op-amp gain calculator",
    "label": "Op-amp gain",
    "description": "Find the gain of an inverting or non-inverting op-amp stage from its feedback resistors, with the output voltage and required bandwidth.",
    "keywords": [
      "op amp gain",
      "inverting amplifier",
      "non-inverting",
      "feedback resistor"
    ],
    "related": [
      "voltage-divider",
      "ohms-law"
    ]
  },
  {
    "slug": "555-timer-astable",
    "category": "electronics",
    "group": "Circuit basics",
    "title": "555 timer astable calculator",
    "label": "555 astable",
    "description": "Compute the frequency, duty cycle and high and low times of a 555 timer in astable mode from R1, R2 and C.",
    "keywords": [
      "555 timer",
      "astable",
      "duty cycle",
      "oscillator",
      "ne555"
    ],
    "related": [
      "rc-time-constant"
    ]
  },
  {
    "slug": "battery-life",
    "category": "electronics",
    "group": "Power and thermal",
    "title": "Battery life calculator",
    "label": "Battery life",
    "description": "Estimate how long a battery will run a circuit from its capacity in mAh and the average current draw, with a derating factor applied.",
    "keywords": [
      "battery life",
      "mah",
      "runtime",
      "current draw",
      "capacity"
    ],
    "related": [
      "ohms-law"
    ]
  },
  {
    "slug": "transformer-turns-ratio",
    "category": "electronics",
    "group": "Power and thermal",
    "title": "Transformer turns ratio calculator",
    "label": "Transformer turns ratio",
    "description": "Relate primary and secondary turns, voltages and currents in an ideal transformer, including the impedance transformation ratio.",
    "keywords": [
      "transformer",
      "turns ratio",
      "primary",
      "secondary",
      "step down"
    ],
    "related": []
  },
  {
    "slug": "decibel-converter",
    "category": "electronics",
    "group": "Digital and data",
    "title": "Decibel converter",
    "label": "Decibels",
    "description": "Convert between decibels and power or voltage ratios, and between dBm and watts, in both directions.",
    "keywords": [
      "decibel",
      "db",
      "dbm",
      "power ratio",
      "voltage ratio",
      "gain"
    ],
    "related": []
  },
  {
    "slug": "resistor-colour-code",
    "category": "electronics",
    "group": "Passive components",
    "title": "Resistor colour code calculator",
    "label": "Resistor colour code",
    "description": "Decode 4-band and 5-band resistor colour codes into resistance and tolerance, with the minimum and maximum values shown.",
    "keywords": [
      "resistor",
      "colour code",
      "color code",
      "bands",
      "tolerance",
      "ohms"
    ],
    "related": [
      "ohms-law",
      "voltage-divider"
    ]
  },
  {
    "slug": "voltage-divider",
    "category": "electronics",
    "group": "Circuit basics",
    "title": "Voltage divider calculator",
    "label": "Voltage divider",
    "description": "Find the output voltage of a two-resistor divider, including current draw, output impedance and the drop caused by a load.",
    "keywords": [
      "voltage divider",
      "resistor divider",
      "potential divider",
      "adc scaling"
    ],
    "related": [
      "ohms-law",
      "resistor-colour-code"
    ]
  },
  {
    "slug": "compound-interest",
    "category": "finance",
    "group": "Interest and growth",
    "title": "Compound interest calculator",
    "label": "Compound interest",
    "description": "Project the growth of a starting balance with regular contributions, at any interest rate and compounding frequency.",
    "keywords": [
      "compound interest",
      "savings",
      "investment growth",
      "apy",
      "future value"
    ],
    "related": []
  },
  {
    "slug": "loan-payment",
    "category": "finance",
    "group": "Borrowing",
    "title": "Loan payment calculator",
    "label": "Loan payment",
    "description": "Find the monthly payment on an amortising loan, with total interest paid and the split on the first payment.",
    "keywords": [
      "loan payment",
      "amortisation",
      "mortgage",
      "monthly payment",
      "interest"
    ],
    "related": []
  },
  {
    "slug": "bmi",
    "category": "health",
    "group": "Body composition",
    "title": "BMI calculator",
    "label": "BMI",
    "description": "Calculate body mass index from height and weight, in metric or imperial units, with the standard category ranges.",
    "keywords": [
      "bmi",
      "body mass index",
      "height",
      "weight"
    ],
    "related": []
  },
  {
    "slug": "bmr-tdee",
    "category": "health",
    "group": "Energy",
    "title": "BMR and daily energy expenditure calculator",
    "label": "BMR and TDEE",
    "description": "Estimate basal metabolic rate with the Mifflin-St Jeor equation and total daily energy expenditure from an activity level.",
    "keywords": [
      "bmr",
      "tdee",
      "metabolic rate",
      "mifflin st jeor",
      "calories"
    ],
    "related": []
  },
  {
    "slug": "one-rep-max",
    "category": "health",
    "group": "Training",
    "title": "One rep max calculator",
    "label": "One rep max",
    "description": "Estimate a one repetition maximum from a set taken to near failure, using the Epley and Brzycki formulas, with a percentage table.",
    "keywords": [
      "one rep max",
      "1rm",
      "epley",
      "brzycki",
      "strength",
      "lifting"
    ],
    "related": []
  },
  {
    "slug": "running-pace",
    "category": "health",
    "group": "Training",
    "title": "Running pace calculator",
    "label": "Running pace",
    "description": "Convert between pace, speed, distance and finishing time, with split times for common race distances.",
    "keywords": [
      "running pace",
      "speed",
      "marathon",
      "5k",
      "split times",
      "min per km"
    ],
    "related": []
  },
  {
    "slug": "graphing-calculator",
    "category": "math",
    "group": "Algebra",
    "title": "Graphing calculator",
    "label": "Graphing calculator",
    "description": "Plot up to four functions of x on the same axes, with adjustable range, zoom, and support for trigonometric, logarithmic and exponential functions.",
    "keywords": [
      "graphing calculator",
      "function plotter",
      "graph",
      "plot",
      "y=f(x)"
    ],
    "related": [
      "quadratic-equation",
      "logarithm"
    ]
  },
  {
    "slug": "percentage",
    "category": "math",
    "group": "Algebra",
    "title": "Percentage calculator",
    "label": "Percentage",
    "description": "Work out a percentage of a number, percentage change between two numbers, and what percentage one number is of another.",
    "keywords": [
      "percentage",
      "percent change",
      "percent of",
      "increase",
      "decrease"
    ],
    "related": []
  },
  {
    "slug": "right-triangle",
    "category": "math",
    "group": "Geometry",
    "title": "Right triangle calculator",
    "label": "Right triangle",
    "description": "Solve a right triangle from two sides: get the third side, both acute angles, area, perimeter and the trigonometric ratios.",
    "keywords": [
      "right triangle",
      "pythagoras",
      "hypotenuse",
      "trigonometry",
      "sohcahtoa"
    ],
    "related": []
  },
  {
    "slug": "circle",
    "category": "math",
    "group": "Geometry",
    "title": "Circle calculator",
    "label": "Circle",
    "description": "Compute radius, diameter, circumference and area of a circle from any one of them, plus arc length and sector area.",
    "keywords": [
      "circle",
      "circumference",
      "area",
      "radius",
      "diameter",
      "arc length",
      "sector"
    ],
    "related": []
  },
  {
    "slug": "standard-deviation",
    "category": "math",
    "group": "Statistics",
    "title": "Standard deviation and mean calculator",
    "label": "Standard deviation",
    "description": "Enter a list of numbers to get the mean, median, sample and population standard deviation, variance and range.",
    "keywords": [
      "standard deviation",
      "mean",
      "variance",
      "median",
      "statistics"
    ],
    "related": []
  },
  {
    "slug": "permutations-combinations",
    "category": "math",
    "group": "Statistics",
    "title": "Permutations and combinations calculator",
    "label": "Permutations & combinations",
    "description": "Compute nPr, nCr, factorials and the number of arrangements with and without repetition allowed.",
    "keywords": [
      "permutations",
      "combinations",
      "npr",
      "ncr",
      "factorial",
      "binomial"
    ],
    "related": []
  },
  {
    "slug": "logarithm",
    "category": "math",
    "group": "Number tools",
    "title": "Logarithm calculator",
    "label": "Logarithm",
    "description": "Compute a logarithm in any base, with natural log, base 10 and base 2 shown alongside, plus the antilog.",
    "keywords": [
      "logarithm",
      "log",
      "ln",
      "log2",
      "natural log",
      "antilog"
    ],
    "related": []
  },
  {
    "slug": "quadratic-equation",
    "category": "math",
    "group": "Algebra",
    "title": "Quadratic equation solver",
    "label": "Quadratic solver",
    "description": "Solve ax² + bx + c = 0 with real or complex roots, and see the discriminant, vertex, axis of symmetry and Vieta's relations.",
    "keywords": [
      "quadratic",
      "roots",
      "discriminant",
      "vertex",
      "parabola",
      "solver"
    ],
    "related": []
  },
  {
    "slug": "force-mass-acceleration",
    "category": "physics",
    "group": "Mechanics",
    "title": "Force, mass and acceleration calculator",
    "label": "F = ma",
    "description": "Solve Newton's second law for force, mass or acceleration, with weight and momentum change included.",
    "keywords": [
      "newtons second law",
      "force",
      "mass",
      "acceleration",
      "f=ma"
    ],
    "related": [
      "projectile-motion",
      "kinetic-energy"
    ]
  },
  {
    "slug": "kinetic-energy",
    "category": "physics",
    "group": "Energy and momentum",
    "title": "Kinetic and potential energy calculator",
    "label": "Kinetic energy",
    "description": "Compute kinetic energy from mass and speed, gravitational potential energy from height, and the speed one converts into the other.",
    "keywords": [
      "kinetic energy",
      "potential energy",
      "joules",
      "1/2mv2",
      "mgh"
    ],
    "related": [
      "force-mass-acceleration",
      "momentum"
    ]
  },
  {
    "slug": "momentum",
    "category": "physics",
    "group": "Energy and momentum",
    "title": "Momentum and collision calculator",
    "label": "Momentum",
    "description": "Find momentum from mass and velocity, and the outcome of an elastic or perfectly inelastic collision between two bodies.",
    "keywords": [
      "momentum",
      "collision",
      "elastic",
      "inelastic",
      "conservation"
    ],
    "related": [
      "kinetic-energy",
      "force-mass-acceleration"
    ]
  },
  {
    "slug": "circular-motion",
    "category": "physics",
    "group": "Mechanics",
    "title": "Circular motion and centripetal force calculator",
    "label": "Circular motion",
    "description": "Compute centripetal acceleration, force, period and angular velocity for an object moving in a circle.",
    "keywords": [
      "centripetal force",
      "circular motion",
      "angular velocity",
      "rpm",
      "g-force"
    ],
    "related": []
  },
  {
    "slug": "simple-pendulum",
    "category": "physics",
    "group": "Waves and optics",
    "title": "Simple pendulum period calculator",
    "label": "Pendulum period",
    "description": "Find the period and frequency of a simple pendulum from its length and local gravity, with the large-angle correction shown.",
    "keywords": [
      "pendulum",
      "period",
      "oscillation",
      "shm",
      "frequency"
    ],
    "related": []
  },
  {
    "slug": "wave-speed",
    "category": "physics",
    "group": "Waves and optics",
    "title": "Wave speed, frequency and wavelength calculator",
    "label": "Wave equation",
    "description": "Relate wave speed, frequency and wavelength, with period and wavenumber, for sound, light or any other wave.",
    "keywords": [
      "wave speed",
      "wavelength",
      "frequency",
      "v=fλ",
      "period"
    ],
    "related": []
  },
  {
    "slug": "lens-equation",
    "category": "physics",
    "group": "Waves and optics",
    "title": "Thin lens equation calculator",
    "label": "Thin lens",
    "description": "Find image distance, magnification and image type for a thin lens or mirror from the object distance and focal length.",
    "keywords": [
      "thin lens",
      "focal length",
      "magnification",
      "image distance",
      "optics"
    ],
    "related": []
  },
  {
    "slug": "escape-velocity",
    "category": "physics",
    "group": "Thermal and modern",
    "title": "Orbital and escape velocity calculator",
    "label": "Escape velocity",
    "description": "Compute escape velocity, circular orbital speed and orbital period for any body from its mass and radius.",
    "keywords": [
      "escape velocity",
      "orbital velocity",
      "orbit",
      "gravity",
      "period"
    ],
    "related": []
  },
  {
    "slug": "density",
    "category": "physics",
    "group": "Mechanics",
    "title": "Density, mass and volume calculator",
    "label": "Density",
    "description": "Convert between density, mass and volume, with buoyancy in water and specific gravity included.",
    "keywords": [
      "density",
      "mass",
      "volume",
      "specific gravity",
      "buoyancy"
    ],
    "related": []
  },
  {
    "slug": "projectile-motion",
    "category": "physics",
    "group": "Mechanics",
    "title": "Projectile motion calculator",
    "label": "Projectile motion",
    "description": "Compute range, time of flight, apex height and impact velocity for a projectile launched at any angle, from any height, under any gravity.",
    "keywords": [
      "projectile motion",
      "range",
      "trajectory",
      "kinematics",
      "launch angle"
    ],
    "related": []
  }
];

export function metaFor(category: string, slug: string): ToolMeta | undefined {
  return MANIFEST.find((t) => t.category === category && t.slug === slug);
}

export function metaBySlug(slug: string): ToolMeta | undefined {
  return MANIFEST.find((t) => t.slug === slug);
}

export function metaByCategory(category: string): ToolMeta[] {
  return MANIFEST.filter((t) => t.category === category);
}

export const SEARCH_INDEX = MANIFEST.map((t) => ({
  slug: t.slug,
  category: t.category,
  title: t.title,
  label: t.label,
  terms: [t.title, t.label, t.group, ...t.keywords].join(" ").toLowerCase(),
}));
