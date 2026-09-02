"use client";

import { makeTool } from "@/lib/makeTool";
import Formula from "@/components/Formula";
import { trim } from "@/lib/format";

export const bmi = makeTool({
  slug: "bmi",
  category: "health", group: "Body composition",
  title: "BMI calculator",
  label: "BMI",
  description: "Calculate body mass index from height and weight, in metric or imperial units, with the standard category ranges.",
  keywords: ["bmi", "body mass index", "height", "weight"],
  columns: 3,
  inputs: [
    { kind: "select", key: "units", label: "Units", initial: "metric",
      options: [{ value: "metric", label: "Metric (kg, cm)" }, { value: "imperial", label: "Imperial (lb, in)" }] },
    { key: "w", label: "Weight", initial: "70" },
    { key: "h", label: "Height", initial: "175" },
  ],
  compute: ({ n, s }) => {
    if (!(n.w > 0) || !(n.h > 0)) return null;
    const kg = s.units === "metric" ? n.w : n.w * 0.45359237;
    const m = s.units === "metric" ? n.h / 100 : n.h * 0.0254;
    const bmiVal = kg / (m * m);
    const cat = bmiVal < 18.5 ? "below 18.5" : bmiVal < 25 ? "18.5 to 24.9"
      : bmiVal < 30 ? "25.0 to 29.9" : "30.0 and above";
    return {
      name: "Body mass index",
      value: trim(bmiVal, 4),
      rows: [
        { label: "Falls in the band", value: cat },
        { label: "Weight for BMI 18.5", value: `${trim(18.5 * m * m, 4)} kg` },
        { label: "Weight for BMI 25", value: `${trim(25 * m * m, 4)} kg` },
        { label: "Height used", value: `${trim(m, 4)} m` },
      ],
      note: "BMI is a population-level screening figure, not a measure of any individual's health.",
    };
  },
  Article: () => (
    <>
      <p>Body mass index divides weight by the square of height. It was devised in the 1830s by Adolphe Quetelet as a statistical tool for describing populations, not for assessing individuals — a distinction that has been widely lost.</p>
      <Formula>BMI = kg / m²&nbsp;&nbsp;&nbsp;BMI = 703 × lb / in²</Formula>
      <h2>The standard bands</h2>
      <table>
        <thead><tr><th>BMI</th><th>Label used by WHO</th></tr></thead>
        <tbody>
          <tr><td>Below 18.5</td><td>Underweight</td></tr>
          <tr><td>18.5 – 24.9</td><td>Normal range</td></tr>
          <tr><td>25.0 – 29.9</td><td>Overweight</td></tr>
          <tr><td>30.0 and above</td><td>Obese</td></tr>
        </tbody>
      </table>
      <h2>What it cannot see</h2>
      <p>BMI knows only two numbers, so it cannot distinguish muscle from fat, cannot tell where fat is distributed, and takes no account of age, sex, frame size or ancestry. Athletes with high muscle mass routinely score as overweight. Older adults who have lost muscle can score as normal while carrying substantial fat.</p>
      <p>The squared height term also biases the scale: it tends to overestimate for tall people and underestimate for short ones, because human bodies do not scale as neat squares.</p>
      <h2>Better individual measures</h2>
      <p>Waist circumference and waist-to-height ratio track abdominal fat, which is the deposit most strongly linked to metabolic risk, and both are almost as easy to measure. Clinically, BMI is used as a first filter and then followed up with something more informative. A single number from two measurements cannot tell you whether you are healthy; a doctor with your full picture can.</p>
    </>
  ),
});

export const bmr = makeTool({
  slug: "bmr-tdee",
  category: "health", group: "Energy",
  title: "BMR and daily energy expenditure calculator",
  label: "BMR and TDEE",
  description: "Estimate basal metabolic rate with the Mifflin-St Jeor equation and total daily energy expenditure from an activity level.",
  keywords: ["bmr", "tdee", "metabolic rate", "mifflin st jeor", "calories"],
  columns: 3,
  inputs: [
    { kind: "select", key: "sex", label: "Sex", initial: "male",
      options: [{ value: "male", label: "Male" }, { value: "female", label: "Female" }] },
    { key: "age", label: "Age", unit: "years", initial: "25" },
    { key: "w", label: "Weight", unit: "kg", initial: "70" },
    { key: "h", label: "Height", unit: "cm", initial: "175" },
    { kind: "select", key: "act", label: "Activity level", initial: "1.55",
      options: [
        { value: "1.2", label: "Sedentary — desk work" },
        { value: "1.375", label: "Light — 1–3 days a week" },
        { value: "1.55", label: "Moderate — 3–5 days a week" },
        { value: "1.725", label: "Active — 6–7 days a week" },
        { value: "1.9", label: "Very active — physical job or twice daily" },
      ] },
  ],
  compute: ({ n, s }) => {
    if (!(n.w > 0) || !(n.h > 0) || !(n.age > 0)) return null;
    const base = 10 * n.w + 6.25 * n.h - 5 * n.age;
    const bmrVal = s.sex === "male" ? base + 5 : base - 161;
    const mult = Number(s.act);
    return {
      name: "Basal metabolic rate",
      value: `${trim(bmrVal, 5)} kcal/day`,
      rows: [
        { label: "Total daily expenditure", value: `${trim(bmrVal * mult, 5)} kcal/day` },
        { label: "In kilojoules", value: `${trim(bmrVal * mult * 4.184, 5)} kJ/day` },
        { label: "Activity multiplier used", value: String(mult) },
        { label: "BMR as average power", value: `${trim((bmrVal * 4184) / 86400, 4)} W` },
      ],
      note: "Estimates from a population equation. Individual metabolic rates vary by roughly ±10%.",
    };
  },
  Article: () => (
    <>
      <p>Basal metabolic rate is the energy your body uses at complete rest, keeping your heart beating, your brain running and your temperature stable. It accounts for the majority of daily energy use in most people — typically 60 to 70 percent.</p>
      <Formula>
        Male:&nbsp;&nbsp; BMR = 10w + 6.25h − 5a + 5{"\n"}
        Female: BMR = 10w + 6.25h − 5a − 161
      </Formula>
      <p>Weight in kilograms, height in centimetres, age in years. This is the Mifflin-St Jeor equation, published in 1990, which is more accurate for modern populations than the older Harris-Benedict formula it replaced.</p>
      <h2>From BMR to total expenditure</h2>
      <p>Multiplying by an activity factor gives total daily energy expenditure. The factors are coarse and self-reported activity is notoriously overestimated, so treat the result as a starting figure to be adjusted against what actually happens over a few weeks rather than a target to be trusted.</p>
      <h2>What the equation cannot account for</h2>
      <p>Body composition is the largest omission. Muscle is more metabolically active than fat, so two people of identical height, weight, age and sex can differ by several hundred kilocalories a day. Thyroid function, genetics, medications, sleep and recent dieting history all shift the figure too.</p>
      <p>Metabolic rate also adapts. Sustained large energy deficits reduce BMR beyond what weight loss alone would predict, which is one reason very aggressive approaches tend to stall.</p>
      <h2>Using the number sensibly</h2>
      <p>This is a population estimate, not a prescription. Anyone making significant changes to how they eat or train — and particularly anyone with a medical condition or a history of disordered eating — should work with a doctor or a registered dietitian rather than a formula.</p>
    </>
  ),
});

export const oneRepMax = makeTool({
  slug: "one-rep-max",
  category: "health", group: "Training",
  title: "One rep max calculator",
  label: "One rep max",
  description: "Estimate a one repetition maximum from a set taken to near failure, using the Epley and Brzycki formulas, with a percentage table.",
  keywords: ["one rep max", "1rm", "epley", "brzycki", "strength", "lifting"],
  columns: 2,
  inputs: [
    { key: "w", label: "Weight lifted", unit: "kg", initial: "80" },
    { key: "r", label: "Repetitions completed", initial: "5" },
  ],
  compute: ({ n }) => {
    if (!(n.w > 0) || !(n.r >= 1)) return null;
    const epley = n.w * (1 + n.r / 30);
    const brzycki = n.w * (36 / (37 - n.r));
    const avg = (epley + brzycki) / 2;
    return {
      name: "Estimated one rep max",
      value: `${trim(avg, 5)} kg`,
      rows: [
        { label: "Epley formula", value: `${trim(epley, 5)} kg` },
        { label: "Brzycki formula", value: `${trim(brzycki, 5)} kg` },
        { label: "95% (about 2 reps)", value: `${trim(avg * 0.95, 5)} kg` },
        { label: "90% (about 4 reps)", value: `${trim(avg * 0.9, 5)} kg` },
        { label: "85% (about 6 reps)", value: `${trim(avg * 0.85, 5)} kg` },
        { label: "75% (about 10 reps)", value: `${trim(avg * 0.75, 5)} kg` },
      ],
      note: "Accuracy falls away sharply above about eight repetitions.",
    };
  },
  Article: () => (
    <>
      <p>A one rep max is the heaviest weight you could lift once with correct technique. Estimating it from a lighter set lets you plan training percentages without the fatigue and injury risk of repeatedly testing a true maximum.</p>
      <Formula>
        Epley:&nbsp;&nbsp; 1RM = w × (1 + r/30){"\n"}
        Brzycki: 1RM = w × 36 / (37 − r)
      </Formula>
      <h2>Why two formulas</h2>
      <p>They were fitted to different data and diverge as repetitions increase. Brzycki tends to give lower estimates at high rep counts and breaks down entirely at 37 reps, where its denominator reaches zero. Averaging the two is a reasonable practical compromise, which is what the headline figure above does.</p>
      <h2>The estimate degrades with reps</h2>
      <p>Below about five repetitions, both formulas are usually within a few percent. Above eight the relationship between endurance and maximal strength becomes highly individual, and an estimate from a set of fifteen tells you more about your muscular endurance than your maximum.</p>
      <p>Lift type matters too. Squat and deadlift estimates from higher rep sets tend to run high because those lifts are limited by fatigue as much as by force production; bench press estimates tend to be closer.</p>
      <h2>Using it in training</h2>
      <p>Percentage-based programmes reference the 1RM: strength work usually sits at 80–95%, hypertrophy work at 65–80%. Because a true maximum fluctuates day to day with sleep, food and stress, many lifters now use rate of perceived exertion alongside percentages rather than trusting a single calculated number.</p>
      <p>The set the estimate comes from should be taken close to failure with good form. A comfortable set of five with three reps left in reserve will give a figure well below what you could actually lift.</p>
    </>
  ),
});

export const pace = makeTool({
  slug: "running-pace",
  category: "health", group: "Training",
  title: "Running pace calculator",
  label: "Running pace",
  description: "Convert between pace, speed, distance and finishing time, with split times for common race distances.",
  keywords: ["running pace", "speed", "marathon", "5k", "split times", "min per km"],
  columns: 3,
  inputs: [
    { key: "dist", label: "Distance", unit: "km", initial: "10" },
    { key: "h", label: "Hours", initial: "0" },
    { key: "m", label: "Minutes", initial: "50" },
    { key: "s", label: "Seconds", initial: "0" },
  ],
  compute: ({ n }) => {
    const secs = (n.h || 0) * 3600 + (n.m || 0) * 60 + (n.s || 0);
    if (!(n.dist > 0) || !(secs > 0)) return null;
    const perKm = secs / n.dist;
    const fmt = (t: number) => {
      const mm = Math.floor(t / 60), ss = t - mm * 60;
      return `${mm}:${ss.toFixed(0).padStart(2, "0")}`;
    };
    const fmtLong = (t: number) => {
      const hh = Math.floor(t / 3600), mm = Math.floor((t % 3600) / 60), ss = Math.round(t % 60);
      return `${hh}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
    };
    return {
      name: "Pace per kilometre",
      value: `${fmt(perKm)} /km`,
      rows: [
        { label: "Pace per mile", value: `${fmt(perKm * 1.609344)} /mi` },
        { label: "Speed", value: `${trim(3600 / perKm, 4)} km/h` },
        { label: "5 km at this pace", value: fmtLong(perKm * 5) },
        { label: "10 km", value: fmtLong(perKm * 10) },
        { label: "Half marathon", value: fmtLong(perKm * 21.0975) },
        { label: "Marathon", value: fmtLong(perKm * 42.195) },
      ],
    };
  },
  Article: () => (
    <>
      <p>Pace is time per unit distance; speed is distance per unit time. Runners think in pace because it is what a watch shows and what you hold during a race. They are reciprocals of each other.</p>
      <Formula>pace (s/km) = time (s) / distance (km)&nbsp;&nbsp;&nbsp;speed (km/h) = 3600 / pace</Formula>
      <h2>Race distances do not scale linearly</h2>
      <p>Doubling the distance costs more than double the time, because you cannot hold the same intensity. A common rule of thumb adds roughly 15 to 20 seconds per kilometre when moving from 10 km to half marathon pace, and a similar amount again to marathon pace. Riegel&rsquo;s formula makes this precise with an exponent of about 1.06.</p>
      <h2>Even splits versus positive splits</h2>
      <p>Most personal bests over longer distances come from even or slightly negative splits — running the second half at the same speed or marginally faster. Starting too fast is the most common pacing mistake, and the time lost in the final quarter almost always exceeds the time gained early.</p>
      <h2>Converting between units</h2>
      <p>A mile is 1.609 km, so mile pace is always the larger number. 5:00/km is 8:03/mi; 4:00/km is 6:26/mi. A four-hour marathon is 5:41/km, and a sub-three-hour marathon needs 4:16/km sustained for the full 42.195 km.</p>
    </>
  ),
});
