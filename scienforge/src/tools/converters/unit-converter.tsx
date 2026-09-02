"use client";

import { useMemo, useState } from "react";
import Readout from "@/components/Readout";
import { parseEng, trim } from "@/lib/format";
import type { Tool } from "@/lib/types";

/** Every unit is stored as its size in the category's base unit. */
const FAMILIES: Record<string, { base: string; units: Record<string, number> }> = {
  Length: { base: "metre", units: {
    "nanometre (nm)": 1e-9, "micrometre (µm)": 1e-6, "millimetre (mm)": 1e-3,
    "centimetre (cm)": 1e-2, "metre (m)": 1, "kilometre (km)": 1e3,
    "inch (in)": 0.0254, "foot (ft)": 0.3048, "yard (yd)": 0.9144,
    "mile (mi)": 1609.344, "nautical mile": 1852, "light year": 9.4607304725808e15,
  }},
  Mass: { base: "kilogram", units: {
    "milligram (mg)": 1e-6, "gram (g)": 1e-3, "kilogram (kg)": 1, "tonne (t)": 1000,
    "ounce (oz)": 0.028349523125, "pound (lb)": 0.45359237, "stone": 6.35029318,
    "US ton": 907.18474, "atomic mass unit (u)": 1.66053906892e-27,
  }},
  Volume: { base: "litre", units: {
    "millilitre (mL)": 1e-3, "litre (L)": 1, "cubic metre (m³)": 1000,
    "cubic centimetre (cm³)": 1e-3, "US teaspoon": 0.00492892159375,
    "US tablespoon": 0.01478676478125, "US fluid ounce": 0.0295735295625,
    "US cup": 0.2365882365, "US pint": 0.473176473, "US gallon": 3.785411784,
    "imperial pint": 0.56826125, "imperial gallon": 4.54609,
  }},
  Energy: { base: "joule", units: {
    "joule (J)": 1, "kilojoule (kJ)": 1000, "calorie (cal)": 4.184,
    "kilocalorie (kcal)": 4184, "watt hour (Wh)": 3600, "kilowatt hour (kWh)": 3.6e6,
    "electronvolt (eV)": 1.602176634e-19, "BTU": 1055.05585262, "foot-pound": 1.3558179483314,
  }},
  Power: { base: "watt", units: {
    "milliwatt (mW)": 1e-3, "watt (W)": 1, "kilowatt (kW)": 1e3, "megawatt (MW)": 1e6,
    "horsepower (metric)": 735.49875, "horsepower (mechanical)": 745.6998715823,
    "BTU per hour": 0.29307107017,
  }},
  Pressure: { base: "pascal", units: {
    "pascal (Pa)": 1, "kilopascal (kPa)": 1000, "bar": 1e5, "millibar (mbar)": 100,
    "atmosphere (atm)": 101325, "torr (mmHg)": 133.322387415, "psi": 6894.757293168,
  }},
  Speed: { base: "metre per second", units: {
    "metre per second (m/s)": 1, "kilometre per hour (km/h)": 1 / 3.6,
    "mile per hour (mph)": 0.44704, "knot": 0.514444444444, "foot per second": 0.3048,
    "speed of light (c)": 299792458,
  }},
  Angle: { base: "radian", units: {
    "radian (rad)": 1, "degree (°)": Math.PI / 180, "gradian": Math.PI / 200,
    "arcminute (′)": Math.PI / 10800, "arcsecond (″)": Math.PI / 648000,
    "full turn": 2 * Math.PI,
  }},
  Data: { base: "byte", units: {
    "bit": 0.125, "byte (B)": 1, "kilobyte (kB, 1000)": 1e3, "kibibyte (KiB, 1024)": 1024,
    "megabyte (MB)": 1e6, "mebibyte (MiB)": 1024 ** 2, "gigabyte (GB)": 1e9,
    "gibibyte (GiB)": 1024 ** 3, "terabyte (TB)": 1e12, "tebibyte (TiB)": 1024 ** 4,
  }},
  Time: { base: "second", units: {
    "nanosecond (ns)": 1e-9, "microsecond (µs)": 1e-6, "millisecond (ms)": 1e-3,
    "second (s)": 1, "minute": 60, "hour": 3600, "day": 86400, "week": 604800,
    "year (365 d)": 31536000,
  }},
};

const TEMPS = ["Celsius (°C)", "Fahrenheit (°F)", "Kelvin (K)", "Rankine (°R)"];

function toKelvin(v: number, unit: string): number {
  if (unit.startsWith("Celsius")) return v + 273.15;
  if (unit.startsWith("Fahrenheit")) return (v - 32) * (5 / 9) + 273.15;
  if (unit.startsWith("Rankine")) return v * (5 / 9);
  return v;
}
function fromKelvin(k: number, unit: string): number {
  if (unit.startsWith("Celsius")) return k - 273.15;
  if (unit.startsWith("Fahrenheit")) return (k - 273.15) * (9 / 5) + 32;
  if (unit.startsWith("Rankine")) return k * 1.8;
  return k;
}

function Calculator() {
  const families = [...Object.keys(FAMILIES), "Temperature"];
  const [family, setFamily] = useState("Length");
  const [from, setFrom] = useState("metre (m)");
  const [to, setTo] = useState("foot (ft)");
  const [amount, setAmount] = useState("1");

  const units = family === "Temperature" ? TEMPS : Object.keys(FAMILIES[family].units);

  const changeFamily = (f: string) => {
    setFamily(f);
    const list = f === "Temperature" ? TEMPS : Object.keys(FAMILIES[f].units);
    setFrom(list[0]);
    setTo(list[1] ?? list[0]);
  };

  const result = useMemo(() => {
    const v = parseEng(amount);
    if (!Number.isFinite(v)) return null;
    if (family === "Temperature") {
      const k = toKelvin(v, from);
      return {
        value: fromKelvin(k, to),
        all: TEMPS.map((u) => ({ label: u, value: trim(fromKelvin(k, u), 7) })),
      };
    }
    const f = FAMILIES[family].units;
    if (!(from in f) || !(to in f)) return null;
    const base = v * f[from];
    return {
      value: base / f[to],
      all: Object.keys(f).slice(0, 8).map((u) => ({ label: u, value: trim(base / f[u], 7) })),
    };
  }, [amount, family, from, to]);

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="field-label" htmlFor="uc-fam">Category</label>
          <select id="uc-fam" className="field-input" value={family} onChange={(e) => changeFamily(e.target.value)}>
            {families.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="uc-amt">Amount</label>
          <input id="uc-amt" className="field-input" inputMode="decimal"
            value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div>
          <label className="field-label" htmlFor="uc-from">From</label>
          <select id="uc-from" className="field-input" value={from} onChange={(e) => setFrom(e.target.value)}>
            {units.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="uc-to">To</label>
          <select id="uc-to" className="field-input" value={to} onChange={(e) => setTo(e.target.value)}>
            {units.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>

      <button
        onClick={() => { const f = from; setFrom(to); setTo(f); }}
        className="mt-3 rounded-[2px] border border-rule bg-panel px-3 py-1.5 text-sm text-ink-soft hover:border-plotter hover:text-plotter"
      >
        Swap the two units
      </button>

      <div className="mt-5">
        <Readout
          name={result ? `${amount} ${from} in ${to}` : "Waiting for input"}
          value={result ? trim(result.value, 8) : "Enter an amount"}
          rows={result?.all}
        />
      </div>
    </div>
  );
}

function Article() {
  return (
    <>
      <p>
        Unit conversion is multiplication by a carefully chosen form of the number one. A
        conversion factor such as 1 inch = 2.54 cm can be written as a fraction equal to 1,
        and multiplying by it changes the units without changing the quantity.
      </p>
      <h2>Track the units, not just the numbers</h2>
      <p>
        Write the units into the working and cancel them like algebraic symbols. If the
        answer comes out in the units you wanted, the arrangement was right; if it comes out
        in metres per second when you wanted seconds, you have divided where you should have
        multiplied. This is called dimensional analysis and it catches most conversion errors
        before they matter.
      </p>
      <h2>Exact versus approximate factors</h2>
      <p>
        Some conversions are exact by definition: an inch is exactly 2.54 cm, a pound is
        exactly 0.45359237 kg, and a nautical mile is exactly 1852 m. Others are measured
        constants and carry uncertainty. Where a factor is exact, the only error in your
        answer is the one you introduced by rounding.
      </p>
      <h2>Temperature is different</h2>
      <p>
        Every other conversion here is a pure scaling, so zero maps to zero. Temperature
        scales have offset zero points, which is why Fahrenheit needs both a multiplication
        and a subtraction. It also means temperature <em>differences</em> convert differently
        from temperature <em>values</em>: a rise of 10 °C is a rise of 18 °F, not 50 °F.
      </p>
      <h2>The decimal versus binary trap in data sizes</h2>
      <p>
        A kilobyte is 1000 bytes; a kibibyte is 1024. Drive manufacturers use the decimal
        prefixes and most operating systems report the binary ones, which is why a
        &ldquo;1 TB&rdquo; drive shows as about 931 GB. Both figures are correct — they are
        measuring in different units with confusingly similar names.
      </p>
      <h2>Why unit errors are expensive</h2>
      <p>
        The Mars Climate Orbiter was lost in 1999 because one team supplied thrust data in
        pound-force seconds while the receiving software expected newton-seconds. The
        arithmetic was fine; the units were not.
      </p>
    </>
  );
}

const tool: Tool = {
  slug: "unit-converter",
  category: "converters",
  group: "Measurement",
  title: "Unit converter",
  label: "Unit converter",
  description:
    "Convert length, mass, volume, energy, power, pressure, speed, angle, data and temperature between more than eighty units.",
  keywords: ["unit converter", "metric", "imperial", "conversion", "temperature", "length"],
  related: ["number-base-converter"],
  Calculator,
  Article,
};

export default tool;
