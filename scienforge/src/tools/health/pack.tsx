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

/* ------------------------------------------------------------------ */
export const bodyFatNavy = makeTool({
  slug: "body-fat-percentage",
  category: "health",
  group: "Body composition",
  title: "Body fat percentage calculator (US Navy method)",
  label: "Body fat percentage",
  description:
    "Estimate body fat percentage from waist, neck and (for women) hip measurements using the US Navy circumference method.",
  keywords: ["body fat percentage", "body fat calculator", "navy method", "body composition"],
  related: ["bmi", "lean-body-mass"],
  columns: 4,
  inputs: [
    { kind: "select", key: "sex", label: "Sex", initial: "male",
      options: [{ value: "male", label: "Male" }, { value: "female", label: "Female" }] },
    { key: "height", label: "Height", unit: "cm", initial: "175" },
    { key: "neck", label: "Neck circumference", unit: "cm", initial: "38" },
    { key: "waist", label: "Waist circumference", unit: "cm", initial: "85" },
    { key: "hip", label: "Hip circumference", unit: "cm", initial: "95", optional: true, hint: "Required for women only" },
  ],
  compute: ({ n, s }) => {
    const male = s.sex === "male";
    if (!(n.height > 0) || !(n.neck > 0) || !(n.waist > 0)) return null;
    if (!male && !(n.hip > 0)) return null;
    let bf: number;
    if (male) {
      if (n.waist <= n.neck) return null;
      bf = 495 / (1.0324 - 0.19077 * Math.log10(n.waist - n.neck) + 0.15456 * Math.log10(n.height)) - 450;
    } else {
      if (n.waist + n.hip <= n.neck) return null;
      bf = 495 / (1.29579 - 0.35004 * Math.log10(n.waist + n.hip - n.neck) + 0.22100 * Math.log10(n.height)) - 450;
    }
    if (!Number.isFinite(bf) || bf < 0 || bf > 70) return null;

    let category: string;
    if (male) {
      category = bf < 6 ? "Essential fat" : bf < 14 ? "Athletic" : bf < 18 ? "Fitness" : bf < 25 ? "Average" : "Above average";
    } else {
      category = bf < 14 ? "Essential fat" : bf < 21 ? "Athletic" : bf < 25 ? "Fitness" : bf < 32 ? "Average" : "Above average";
    }

    return {
      name: "Estimated body fat",
      value: `${trim(bf, 4)}%`,
      rows: [
        { label: "Category", value: category },
      ],
      note: "A field estimate, not a clinical measurement. Circumference methods carry a typical margin of error of ±3-4 percentage points compared with DEXA scanning. Measure at the narrowest point of the waist and directly below the larynx for the neck.",
    };
  },
  Article: () => (
    <>
      <p>
        The US Navy method estimates body fat from a small number of circumference
        measurements rather than direct measurement of fat mass. It was developed as a
        practical field alternative to underwater weighing, which is accurate but requires
        specialised equipment.
      </p>
      <Formula>
        Men: %BF = 495 / (1.0324 − 0.19077·log₁₀(waist − neck) + 0.15456·log₁₀(height)) − 450{"\n"}
        Women: %BF = 495 / (1.29579 − 0.35004·log₁₀(waist + hip − neck) + 0.22100·log₁₀(height)) − 450
      </Formula>
      <p>
        The formulas differ by sex because fat distribution patterns differ systematically
        between men and women — the female formula includes hip circumference specifically
        to capture typical lower-body fat storage that the male formula does not need to
        account for.
      </p>

      <h2>Measurement technique matters more than the formula</h2>
      <p>
        Because the calculation is sensitive to small differences in the inputs, consistent
        measurement technique matters. Waist should be measured at the narrowest point,
        typically just above the navel, without pulling the tape tight enough to compress
        the skin. Neck should be measured just below the larynx. Small measurement errors
        of even a centimetre or two can shift the result by a percentage point or more.
      </p>

      <h2>Accuracy compared with other methods</h2>
      <table>
        <thead><tr><th>Method</th><th>Typical accuracy</th><th>Practicality</th></tr></thead>
        <tbody>
          <tr><td>DEXA scan</td><td>Very high (±1-2%)</td><td>Requires clinical equipment</td></tr>
          <tr><td>Hydrostatic weighing</td><td>High (±2-3%)</td><td>Requires specialised tank</td></tr>
          <tr><td>Skinfold calipers</td><td>Moderate (±3-4%)</td><td>Requires training to use consistently</td></tr>
          <tr><td>Navy circumference method</td><td>Moderate (±3-4%)</td><td>Just a tape measure</td></tr>
          <tr><td>Bioelectrical impedance (home scales)</td><td>Variable, sensitive to hydration</td><td>Very convenient</td></tr>
        </tbody>
      </table>

      <h2>Why this is an estimate, not a diagnosis</h2>
      <p>
        Any circumference-based method assumes a fairly typical fat distribution pattern.
        It systematically over- or under-estimates for people whose build differs
        substantially from that assumption — very muscular individuals, for instance, often
        get overestimated body fat readings from circumference methods, because the
        formula cannot distinguish a thick neck or waist caused by muscle from one caused
        by fat. Treat the result as a tracking tool for change over time using a consistent
        method, rather than a precise absolute figure.
      </p>
    </>
  ),
});

/* ------------------------------------------------------------------ */
export const leanBodyMass = makeTool({
  slug: "lean-body-mass",
  category: "health",
  group: "Body composition",
  title: "Lean body mass calculator",
  label: "Lean body mass",
  description:
    "Estimate lean body mass and fat mass from height, weight and sex using the Boer formula.",
  keywords: ["lean body mass calculator", "lbm calculator", "fat free mass", "boer formula"],
  related: ["body-fat-percentage", "bmi"],
  columns: 3,
  inputs: [
    { kind: "select", key: "sex", label: "Sex", initial: "male",
      options: [{ value: "male", label: "Male" }, { value: "female", label: "Female" }] },
    { key: "weight", label: "Weight", unit: "kg", initial: "75" },
    { key: "height", label: "Height", unit: "cm", initial: "175" },
  ],
  compute: ({ n, s }) => {
    if (!(n.weight > 0) || !(n.height > 0)) return null;
    const lbm = s.sex === "male"
      ? 0.407 * n.weight + 0.267 * n.height - 19.2
      : 0.252 * n.weight + 0.473 * n.height - 48.3;
    if (!(lbm > 0) || lbm > n.weight) return null;
    const fatMass = n.weight - lbm;
    const bfPct = (fatMass / n.weight) * 100;
    return {
      name: "Lean body mass",
      value: `${trim(lbm, 5)} kg`,
      rows: [
        { label: "Fat mass", value: `${trim(fatMass, 5)} kg` },
        { label: "Estimated body fat %", value: `${trim(bfPct, 4)}%` },
        { label: "Lean mass as % of total", value: `${trim((lbm / n.weight) * 100, 4)}%` },
      ],
      note: "Estimated from the Boer formula, one of several population-average formulas. Individual variation, especially in muscular individuals, can be substantial.",
    };
  },
  Article: () => (
    <>
      <p>
        Lean body mass is everything in the body that is not fat — muscle, bone, organs,
        water and connective tissue. It is a more physiologically meaningful reference
        point than total body weight for many purposes, since fat and lean tissue behave
        very differently metabolically.
      </p>
      <Formula>
        Men: LBM = 0.407 × weight(kg) + 0.267 × height(cm) − 19.2{"\n"}
        Women: LBM = 0.252 × weight(kg) + 0.473 × height(cm) − 48.3
      </Formula>
      <p>
        This is the Boer formula, one of several regression equations derived from
        population data linking body weight and height to measured lean mass. Others in
        common use include the Hume and James formulas, which agree closely for most
        people but diverge somewhat at the extremes of body size.
      </p>

      <h2>Why lean mass matters more than total weight in some contexts</h2>
      <ul>
        <li>
          <strong>Metabolic rate.</strong> Lean tissue is far more metabolically active
          than fat tissue, so two people of identical weight but different body
          composition can have meaningfully different resting energy expenditure.
        </li>
        <li>
          <strong>Medication dosing.</strong> Some medications are dosed relative to lean
          body mass rather than total weight, since fat tissue does not distribute or
          metabolise certain drugs the same way lean tissue does — though this is a
          clinical decision made by a prescriber with direct measurement, not something to
          self-calculate.
        </li>
        <li>
          <strong>Tracking training progress.</strong> Someone gaining muscle while losing
          fat can see total body weight stay flat or even rise, while lean mass and fat
          mass move in opposite directions underneath that number.
        </li>
      </ul>

      <h2>The limits of a population-average formula</h2>
      <p>
        These formulas were derived from average population data and applied backward as a
        general estimate — they were not built by measuring any specific individual&rsquo;s
        actual lean mass. They tend to be reasonably accurate for people close to average
        build, and systematically less accurate at either end of the spectrum: very lean,
        heavily muscled individuals often have their lean mass underestimated, since the
        formula has no way to know that a given height and weight combination is unusually
        muscular rather than unusually fat.
      </p>

      <h2>Direct measurement is more accurate</h2>
      <p>
        DEXA scanning, bioelectrical impedance analysis and hydrostatic weighing all
        measure body composition more directly than a height-and-weight formula can. This
        calculator is a convenient estimate for tracking rough trends without access to
        that equipment, not a substitute for it.
      </p>
    </>
  ),
});

/* ------------------------------------------------------------------ */
export const waistHipRatio = makeTool({
  slug: "waist-hip-ratio",
  category: "health",
  group: "Body composition",
  title: "Waist-to-hip ratio calculator",
  label: "Waist-to-hip ratio",
  description:
    "Calculate waist-to-hip ratio and see it against the World Health Organization's reference ranges for cardiometabolic risk.",
  keywords: ["waist to hip ratio", "whr calculator", "waist hip ratio"],
  related: ["bmi", "body-fat-percentage"],
  columns: 3,
  inputs: [
    { kind: "select", key: "sex", label: "Sex", initial: "male",
      options: [{ value: "male", label: "Male" }, { value: "female", label: "Female" }] },
    { key: "waist", label: "Waist circumference", unit: "cm", initial: "85" },
    { key: "hip", label: "Hip circumference", unit: "cm", initial: "100" },
  ],
  compute: ({ n, s }) => {
    if (!(n.waist > 0) || !(n.hip > 0)) return null;
    const ratio = n.waist / n.hip;
    const male = s.sex === "male";
    let risk: string;
    if (male) risk = ratio < 0.90 ? "Low" : ratio < 1.0 ? "Moderate" : "High";
    else risk = ratio < 0.80 ? "Low" : ratio < 0.85 ? "Moderate" : "High";
    return {
      name: "Waist-to-hip ratio",
      value: trim(ratio, 4),
      rows: [
        { label: "WHO risk category", value: risk },
      ],
      note: "WHO reference thresholds for cardiometabolic risk association, not a diagnosis. Measure waist at the narrowest point and hip at the widest point of the buttocks.",
    };
  },
  Article: () => (
    <>
      <p>
        Waist-to-hip ratio compares the circumference of the waist to the circumference of
        the hips. It is used as a simple proxy for fat distribution pattern — specifically,
        how much fat is stored around the abdomen relative to the hips and thighs.
      </p>
      <Formula>WHR = waist circumference / hip circumference</Formula>

      <h2>Why distribution matters, not just total fat</h2>
      <p>
        Two people with identical body fat percentage can have very different waist-to-hip
        ratios, because fat distribution pattern varies independently of total fat amount.
        Abdominal (visceral) fat, stored around internal organs, is associated with
        different metabolic risk than fat stored subcutaneously around the hips and
        thighs. This is the reason waist-to-hip ratio is studied as a health indicator
        separate from BMI or total body fat percentage — it is capturing where fat sits,
        not how much there is overall.
      </p>

      <h2>WHO reference thresholds</h2>
      <table>
        <thead><tr><th>Sex</th><th>Low risk</th><th>Moderate risk</th><th>High risk</th></tr></thead>
        <tbody>
          <tr><td>Male</td><td>Below 0.90</td><td>0.90–0.99</td><td>1.0 or above</td></tr>
          <tr><td>Female</td><td>Below 0.80</td><td>0.80–0.84</td><td>0.85 or above</td></tr>
        </tbody>
      </table>
      <p>
        These thresholds come from population studies associating waist-to-hip ratio with
        cardiometabolic risk factors. They describe a statistical association across large
        populations, not a diagnostic cutoff for any individual.
      </p>

      <h2>Measurement consistency</h2>
      <p>
        Waist is measured at the narrowest point of the torso, typically near the navel;
        hip is measured at the widest point around the buttocks. As with any circumference
        measurement, small inconsistencies in exactly where the tape sits shift the result
        — measuring in the same location, at the same time of day (ideally not right after
        a meal), gives the most consistent comparison over time.
      </p>

      <h2>What this ratio does not capture</h2>
      <p>
        Waist-to-hip ratio says nothing about muscle mass, overall fitness, or any factor
        beyond the relative proportion of two circumference measurements. It is one data
        point among many used in population health research, not a standalone health
        assessment, and should be interpreted alongside — not instead of — other
        measurements and, where relevant, a conversation with a healthcare professional.
      </p>
    </>
  ),
});

/* ------------------------------------------------------------------ */
export const idealBodyWeight = makeTool({
  slug: "ideal-body-weight",
  category: "health",
  group: "Body composition",
  title: "Ideal body weight calculator",
  label: "Ideal body weight",
  description:
    "See a reference range for body weight from height and sex, using several published formulas side by side rather than a single number.",
  keywords: ["ideal body weight calculator", "ibw calculator", "devine formula", "healthy weight range"],
  related: ["bmi", "lean-body-mass"],
  columns: 3,
  inputs: [
    { kind: "select", key: "sex", label: "Sex", initial: "male",
      options: [{ value: "male", label: "Male" }, { value: "female", label: "Female" }] },
    { key: "height", label: "Height", unit: "cm", initial: "175" },
  ],
  compute: ({ n, s }) => {
    if (!(n.height > 60) || !(n.height < 250)) return null;
    const heightIn = n.height / 2.54;
    const inchesOver5ft = heightIn - 60;
    if (inchesOver5ft < 0) return null;
    const male = s.sex === "male";

    const devine = male ? 50 + 2.3 * inchesOver5ft : 45.5 + 2.3 * inchesOver5ft;
    const robinson = male ? 52 + 1.9 * inchesOver5ft : 49 + 1.7 * inchesOver5ft;
    const miller = male ? 56.2 + 1.41 * inchesOver5ft : 53.1 + 1.36 * inchesOver5ft;
    const hamwi = male ? 48.0 + 2.7 * inchesOver5ft : 45.5 + 2.2 * inchesOver5ft;

    const values = [devine, robinson, miller, hamwi];
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    return {
      name: "Reference range across formulas",
      value: `${trim(min, 4)} – ${trim(max, 4)} kg`,
      rows: [
        { label: "Devine formula (1974)", value: `${trim(devine, 4)} kg` },
        { label: "Robinson formula (1983)", value: `${trim(robinson, 4)} kg` },
        { label: "Miller formula (1983)", value: `${trim(miller, 4)} kg` },
        { label: "Hamwi formula (1964)", value: `${trim(hamwi, 4)} kg` },
        { label: "Average across formulas", value: `${trim(avg, 4)} kg` },
      ],
      note: "These are decades-old reference formulas originally built for drug dosing, not a target or prescription. Healthy weight varies with build, muscle mass and many other factors a height-only formula cannot capture.",
    };
  },
  Article: () => (
    <>
      <p>
        &ldquo;Ideal body weight&rdquo; formulas were originally developed in a clinical
        context — to standardise medication dosing calculations, not to define a personal
        weight target. This calculator shows several of them side by side deliberately,
        because no single one is more &ldquo;correct&rdquo; than the others, and seeing
        the spread is more informative than seeing one authoritative-looking number.
      </p>
      <Formula>
        Devine: 50 + 2.3 × (height in inches − 60), women: 45.5 instead of 50{"\n"}
        (all formulas add a fixed base weight plus an increment per inch over 5 feet)
      </Formula>

      <h2>Where these formulas actually came from</h2>
      <p>
        The Devine formula, still the most widely cited, was published in 1974 specifically
        to estimate a dosing weight for calculating drug dosages in clinical pharmacy — a
        practical shortcut for pharmacists, not a research finding about optimal human body
        weight. The Robinson, Miller and Hamwi formulas were derived similarly, each from
        different reference populations and each disagreeing with the others by several
        kilograms for the same height.
      </p>

      <h2>Why they disagree with each other</h2>
      <p>
        Each formula assumes a fixed relationship between height and a &ldquo;normal&rdquo;
        weight, calibrated against whatever population that formula&rsquo;s authors had
        access to decades ago. None of them account for frame size, muscle mass, sex
        differences beyond a single offset, or the simple fact that healthy humans of the
        same height come in a wide range of builds. The spread between the four formulas
        shown here — often 3-5 kg for the same height — is itself the honest answer: there
        is no single correct number, only a rough range.
      </p>

      <h2>What a more useful frame looks like</h2>
      <p>
        Modern guidance tends to favour a healthy BMI range (typically 18.5-24.9) combined
        with waist circumference and overall body composition, rather than a single target
        weight from a height-only formula. Two people at the same height with very
        different muscle mass can both be perfectly healthy at quite different weights —
        something none of these formulas can see, since they only take height as input.
      </p>

      <h2>Use this as context, not a target</h2>
      <p>
        This tool exists to show that &ldquo;ideal weight&rdquo; is a much fuzzier concept
        than a single calculator output suggests. Weight is one data point; overall health
        depends on far more than that, and a healthcare provider looking at the whole
        picture is a better source of a personal target than any formula, this one
        included.
      </p>
    </>
  ),
});

/* ------------------------------------------------------------------ */
export const targetHeartRate = makeTool({
  slug: "target-heart-rate",
  category: "health",
  group: "Training",
  title: "Target heart rate zone calculator",
  label: "Target heart rate",
  description:
    "Find training heart rate zones from age and resting heart rate using the Karvonen (heart rate reserve) method.",
  keywords: ["target heart rate calculator", "heart rate zones", "karvonen formula", "training zones"],
  related: ["vo2-max", "running-pace"],
  columns: 3,
  inputs: [
    { key: "age", label: "Age", initial: "30" },
    { key: "resting", label: "Resting heart rate", unit: "bpm", initial: "65" },
  ],
  compute: ({ n }) => {
    if (!(n.age > 0) || !(n.age < 120) || !(n.resting > 30) || !(n.resting < 120)) return null;
    const maxHr = 220 - n.age;
    const hrr = maxHr - n.resting;
    if (hrr <= 0) return null;
    const zone = (lo: number, hi: number) => {
      const l = Math.round(n.resting + lo * hrr);
      const h = Math.round(n.resting + hi * hrr);
      return `${l} – ${h} bpm`;
    };
    return {
      name: "Estimated maximum heart rate",
      value: `${maxHr} bpm`,
      rows: [
        { label: "Heart rate reserve", value: `${hrr} bpm` },
        { label: "Zone 1 — very light (50-60%)", value: zone(0.5, 0.6) },
        { label: "Zone 2 — light (60-70%)", value: zone(0.6, 0.7) },
        { label: "Zone 3 — moderate (70-80%)", value: zone(0.7, 0.8) },
        { label: "Zone 4 — hard (80-90%)", value: zone(0.8, 0.9) },
        { label: "Zone 5 — maximum (90-100%)", value: zone(0.9, 1.0) },
      ],
      note: "The 220-minus-age formula is a population average with a standard deviation of roughly ±10-12 bpm — a genuine max heart rate test is more accurate for any specific individual.",
    };
  },
  Article: () => (
    <>
      <p>
        Training zones divide exercise intensity into bands based on percentage of maximum
        heart rate, or more precisely, percentage of heart rate reserve — the range between
        resting and maximum heart rate. Different zones emphasise different physiological
        adaptations: light zones build aerobic base and recovery capacity, hard zones build
        anaerobic capacity and speed.
      </p>
      <Formula>
        Max HR ≈ 220 − age{"\n"}
        Heart rate reserve (HRR) = Max HR − Resting HR{"\n"}
        Target HR = Resting HR + (intensity % × HRR)
      </Formula>

      <h2>Why heart rate reserve beats a simple percentage of max</h2>
      <p>
        A simpler method just takes a percentage of maximum heart rate directly (60% of
        max, say). The Karvonen method used here instead works from heart rate
        <em>reserve</em> — the gap between resting and maximum — which better accounts for
        individual fitness level. A very fit person with a low resting heart rate of 45 bpm
        and an unfit person with a resting rate of 80 bpm, both with the same calculated
        max heart rate, get meaningfully different target zones under Karvonen, whereas a
        simple percentage-of-max method would give them identical targets despite very
        different baseline fitness.
      </p>

      <h2>The formula&rsquo;s real limitation</h2>
      <p>
        The 220-minus-age estimate for maximum heart rate is a population average from
        decades-old research, and individual variation around it is substantial — a
        standard deviation of roughly 10-12 beats per minute is typical, meaning a
        meaningful fraction of people have a true max heart rate 10+ bpm away from what
        this formula predicts. Fitness professionals and researchers use several
        alternative formulas that claim modest improvements, but none eliminate this
        individual variation. A supervised maximal exercise test remains the only way to
        know your actual maximum heart rate with confidence.
      </p>

      <h2>What each zone is generally used for</h2>
      <ul>
        <li><strong>Zone 1-2 (50-70%).</strong> Recovery and aerobic base building — sustainable for long durations, builds the cardiovascular foundation other training sits on top of.</li>
        <li><strong>Zone 3 (70-80%).</strong> Moderate, sustained effort — the zone many people default to without meaning to, sometimes called the &ldquo;grey zone&rdquo; because it is harder than base training but not targeted enough to build peak fitness efficiently.</li>
        <li><strong>Zone 4 (80-90%).</strong> Hard efforts that build lactate threshold and race-pace capacity.</li>
        <li><strong>Zone 5 (90-100%).</strong> Maximum effort, sustainable only briefly — builds top-end speed and anaerobic capacity.</li>
      </ul>

      <h2>A note on relying on heart rate alone</h2>
      <p>
        Heart rate responds to factors beyond exercise intensity — heat, dehydration,
        caffeine, illness, sleep debt and stress can all shift it independent of effort
        level. Heart rate zones are a useful guide, not an infallible one, and anyone
        starting a new exercise program, especially with any underlying health condition,
        should get guidance from a doctor before using target heart rate zones to structure
        training.
      </p>
    </>
  ),
});

/* ------------------------------------------------------------------ */
export const vo2Max = makeTool({
  slug: "vo2-max",
  category: "health",
  group: "Training",
  title: "VO2 max estimator (Cooper test)",
  label: "VO2 max estimator",
  description:
    "Estimate VO2 max, a measure of aerobic fitness, from the distance covered in a 12-minute run using the Cooper test formula.",
  keywords: ["vo2 max calculator", "cooper test", "aerobic fitness", "vo2max estimate"],
  related: ["target-heart-rate", "running-pace"],
  columns: 2,
  inputs: [
    { key: "distance", label: "Distance covered in 12 minutes", unit: "m", initial: "2400" },
    { key: "age", label: "Age", initial: "30", optional: true },
  ],
  compute: ({ n }) => {
    if (!(n.distance > 800) || !(n.distance < 5000)) return null;
    const vo2 = (n.distance - 504.9) / 44.73;
    if (!(vo2 > 0)) return null;

    let category = "Below average";
    if (Number.isFinite(n.age) && n.age > 0) {
      // Rough general-population thresholds, not sex-specific for simplicity.
      if (vo2 > 55) category = "Superior";
      else if (vo2 > 45) category = "Excellent";
      else if (vo2 > 38) category = "Good";
      else if (vo2 > 32) category = "Fair";
      else category = "Below average";
    }

    return {
      name: "Estimated VO2 max",
      value: `${trim(vo2, 5)} mL/kg/min`,
      rows: [
        { label: "General fitness category", value: category },
        { label: "Distance entered", value: `${trim(n.distance, 6)} m in 12 minutes` },
      ],
      note: "Field-test estimate, not a laboratory measurement. Requires a genuine maximal effort sustained for the full 12 minutes to be meaningful — pacing yourself conservatively will understate your true VO2 max.",
    };
  },
  Article: () => (
    <>
      <p>
        VO2 max measures the maximum rate at which the body can consume oxygen during
        intense exercise, expressed per kilogram of body weight per minute. It is widely
        used as the single best laboratory measure of aerobic (cardiovascular) fitness,
        because it captures the combined capacity of the heart, lungs, blood and muscles to
        deliver and use oxygen.
      </p>
      <Formula>VO2 max = (distance in metres − 504.9) / 44.73</Formula>
      <p>
        This is the Cooper test formula, developed by Kenneth Cooper in 1968 as a field
        alternative to laboratory gas-analysis testing. It works by having someone run as
        far as possible in exactly 12 minutes and estimating VO2 max from that distance.
      </p>

      <h2>Why the test has to be maximal effort</h2>
      <p>
        The formula was calibrated against people genuinely running as fast as they could
        sustain for the full 12 minutes. Pacing conservatively, stopping early, or walking
        part of it all produce a distance that understates true aerobic capacity — the test
        only works as a fitness proxy if the effort behind it is actually maximal.
      </p>

      <h2>Field test versus laboratory measurement</h2>
      <p>
        A true VO2 max test measures oxygen consumption directly through a mask connected
        to gas analysis equipment while the subject exercises to exhaustion on a treadmill
        or bike, typically under a graded protocol of increasing intensity. The Cooper test
        approximates this with a single distance figure, correlating reasonably well with
        lab-measured VO2 max across populations, but with more individual scatter than a
        direct laboratory test — running economy, pacing strategy and motivation all affect
        the field-test distance independent of true aerobic capacity.
      </p>

      <h2>General fitness categories</h2>
      <table>
        <thead><tr><th>VO2 max (mL/kg/min)</th><th>General category</th></tr></thead>
        <tbody>
          <tr><td>Below 32</td><td>Below average</td></tr>
          <tr><td>32–38</td><td>Fair</td></tr>
          <tr><td>38–45</td><td>Good</td></tr>
          <tr><td>45–55</td><td>Excellent</td></tr>
          <tr><td>Above 55</td><td>Superior — elite endurance athlete territory</td></tr>
        </tbody>
      </table>
      <p>
        These bands are approximate and vary by age and sex in more detailed reference
        tables; elite endurance athletes such as marathon runners and cross-country skiers
        commonly measure VO2 max values above 70, among the highest ever recorded in
        humans.
      </p>

      <h2>What VO2 max does and does not predict</h2>
      <p>
        VO2 max correlates strongly with endurance performance but is not the only
        determinant of it — running economy (how efficiently someone uses oxygen at a given
        pace), lactate threshold, and mental pacing strategy all matter alongside raw
        aerobic capacity. Two runners with identical VO2 max can have quite different race
        times because of differences in these other factors.
      </p>
    </>
  ),
});

/* ------------------------------------------------------------------ */
export const sleepCycle = makeTool({
  slug: "sleep-cycle",
  category: "health",
  group: "Training",
  title: "Sleep cycle calculator",
  label: "Sleep cycle calculator",
  description:
    "Find bedtimes or wake times that align with complete 90-minute sleep cycles, to reduce the chance of waking mid-cycle.",
  keywords: ["sleep cycle calculator", "sleep calculator", "bedtime calculator", "wake up time calculator"],
  columns: 3,
  inputs: [
    { kind: "select", key: "mode", label: "I want to find my", initial: "bedtime",
      options: [
        { value: "bedtime", label: "Bedtime (I know my wake time)" },
        { value: "waketime", label: "Wake time (I know my bedtime)" },
      ] },
    { kind: "time", key: "time", label: "Time", initial: "07:00" },
    { key: "fallAsleep", label: "Minutes to fall asleep", initial: "15" },
  ],
  compute: ({ n, s }) => {
    const timeStr = s.time ?? "";
    const parts = timeStr.split(":").map(Number);
    if (parts.length !== 2 || !Number.isFinite(parts[0]) || !Number.isFinite(parts[1])) return null;
    const [hh, mm] = parts;
    if (hh < 0 || hh > 23 || mm < 0 || mm > 59) return null;
    if (!Number.isFinite(n.fallAsleep) || n.fallAsleep < 0) return null;

    const baseMinutes = hh * 60 + mm;
    const cycleLen = 90;
    const fmt = (totalMin: number) => {
      const m = ((totalMin % 1440) + 1440) % 1440;
      const h = Math.floor(m / 60);
      const mi = m % 60;
      return `${String(h).padStart(2, "0")}:${String(mi).padStart(2, "0")}`;
    };

    const bedtime = s.mode === "bedtime";
    const cycles = [6, 5, 4, 3];
    const rows = cycles.map((c) => {
      const totalSleep = c * cycleLen;
      const target = bedtime
        ? baseMinutes - totalSleep - n.fallAsleep
        : baseMinutes + n.fallAsleep + totalSleep;
      return {
        label: `${c} cycles (${trim(totalSleep / 60, 3)} h sleep)`,
        value: fmt(target),
      };
    });

    return {
      name: bedtime ? "Suggested bedtimes" : "Suggested wake times",
      value: rows[1].value,
      rows,
      note: "Sleep cycles vary in length between people and across the night — 90 minutes is a commonly used average, not a fixed number. Waking near the end of a cycle, rather than in the middle of deep sleep, is the underlying idea, not an exact science.",
    };
  },
  Article: () => (
    <>
      <p>
        Sleep is not uniform through the night — it moves through repeating cycles of
        light sleep, deep sleep and REM sleep, each cycle lasting roughly 90 minutes in
        adults. Waking near the boundary between cycles tends to feel easier than waking
        from deep sleep in the middle of one, which is the idea behind timing sleep and
        wake times around whole numbers of cycles.
      </p>
      <Formula>Total sleep time ≈ number of complete 90-minute cycles</Formula>

      <h2>Why this is a heuristic, not a precise science</h2>
      <p>
        The 90-minute figure is a population average. Individual cycle length genuinely
        varies, commonly cited as ranging from about 70 to 120 minutes depending on the
        person, and cycle length even shifts across a single night — early cycles tend to
        contain more deep sleep, later cycles more REM sleep. This calculator uses a fixed
        90-minute assumption because it is the most commonly cited average, but it will not
        be exactly right for any specific individual on any specific night.
      </p>

      <h2>What actually happens in each cycle</h2>
      <p>
        A typical cycle moves through light sleep, then progressively deeper stages, then
        back up through lighter sleep into a period of REM (rapid eye movement) sleep,
        associated with vivid dreaming, before the cycle repeats. Deep sleep is
        concentrated earlier in the night; REM sleep becomes more prominent in cycles
        closer to natural waking time. This is part of why waking from deep sleep — more
        common if woken abruptly early in the night — tends to produce more grogginess than
        waking from lighter sleep later on.
      </p>

      <h2>Total sleep duration still matters most</h2>
      <p>
        Cycle timing is a secondary optimisation on top of the more fundamental factor:
        total sleep duration. Most adults need somewhere in the range of 7-9 hours of sleep
        per night for healthy functioning, and no amount of clever cycle-timing compensates
        for chronic insufficient total sleep. Use this calculator to fine-tune timing within
        an adequate sleep window, not to justify cutting total sleep time short.
      </p>

      <h2>Practical caveats</h2>
      <p>
        The &ldquo;minutes to fall asleep&rdquo; input matters because cycles start once
        you are actually asleep, not once you get into bed — most people take somewhere
        between 10 and 20 minutes to fall asleep under normal conditions, though this
        varies with stress, caffeine intake and sleep environment. This tool is a planning
        aid, not a substitute for consistent sleep habits or for medical advice if sleep
        difficulties are persistent.
      </p>
    </>
  ),
});

/* ------------------------------------------------------------------ */
const MET_VALUES: Record<string, number> = {
  "Walking (3 mph, level)": 3.5,
  "Walking (4 mph, brisk)": 5.0,
  "Running (6 mph / 10 min mile)": 9.8,
  "Running (8 mph / 7.5 min mile)": 13.5,
  "Cycling (moderate, 12-14 mph)": 8.0,
  "Cycling (vigorous, 16-19 mph)": 12.0,
  "Swimming (moderate laps)": 8.3,
  "Weight training (general)": 3.5,
  "Weight training (vigorous)": 6.0,
  "Yoga": 2.5,
  "Basketball (game play)": 8.0,
  "Hiking (cross-country)": 6.0,
  "Jump rope": 12.3,
  "Rowing machine (moderate)": 7.0,
};

export const caloriesBurned = makeTool({
  slug: "calories-burned-exercise",
  category: "health",
  group: "Energy",
  title: "Calories burned during exercise calculator",
  label: "Calories burned",
  description:
    "Estimate calories burned during common activities from body weight, duration and exercise intensity using MET values.",
  keywords: ["calories burned calculator", "exercise calories", "met calculator", "workout calories"],
  related: ["bmr-tdee"],
  columns: 3,
  inputs: [
    { kind: "select", key: "activity", label: "Activity", initial: "Running (6 mph / 10 min mile)",
      options: Object.keys(MET_VALUES).map((a) => ({ value: a, label: a })) },
    { key: "weight", label: "Body weight", unit: "kg", initial: "70" },
    { key: "duration", label: "Duration", unit: "minutes", initial: "30" },
  ],
  compute: ({ n, s }) => {
    const met = MET_VALUES[String(s.activity)];
    if (!met || !(n.weight > 0) || !(n.duration > 0)) return null;
    const calories = (met * n.weight * 3.5) / 200 * n.duration;
    const perHour = (calories / n.duration) * 60;
    return {
      name: "Estimated calories burned",
      value: `${trim(calories, 5)} kcal`,
      rows: [
        { label: "MET value for this activity", value: trim(met, 3) },
        { label: "Rate", value: `${trim(perHour, 5)} kcal/hour` },
      ],
      note: "MET-based estimates are population averages and can be off by 20% or more for any individual, since actual energy expenditure depends on fitness level, technique, terrain and effort, not just activity type.",
    };
  },
  Article: () => (
    <>
      <p>
        A MET, or metabolic equivalent of task, expresses the energy cost of an activity as
        a multiple of resting metabolic rate. Sitting quietly is defined as 1 MET; an
        activity rated at 8 METs burns roughly eight times the energy of sitting still, for
        the same duration.
      </p>
      <Formula>Calories = MET × weight (kg) × 3.5 / 200 × duration (minutes)</Formula>
      <p>
        This is the standard formula for converting a MET value into an estimated calorie
        burn, derived from the definition of one MET as 3.5 mL of oxygen consumed per
        kilogram of body weight per minute, combined with the standard conversion between
        oxygen consumption and energy expenditure.
      </p>

      <h2>Why body weight is central to the calculation</h2>
      <p>
        Moving more mass costs more energy, so heavier individuals burn more calories doing
        the same activity for the same duration than lighter individuals — this is built
        directly into the formula, since weight is a multiplying factor. This is also why
        calorie burn estimates from wearable fitness trackers ask for body weight as a
        setup step; without it, the estimate cannot account for this effect at all.
      </p>

      <h2>MET values are averages, not measurements of you specifically</h2>
      <p>
        The published MET value for &ldquo;running at 6 mph&rdquo; is drawn from studies
        averaging many people&rsquo;s measured oxygen consumption at that pace. An
        individual&rsquo;s actual energy cost varies with running economy, fitness level,
        terrain, and even footwear — well-trained runners are often more metabolically
        efficient at a given pace than untrained ones, meaning they burn somewhat fewer
        calories covering the identical distance at the identical speed. MET-based
        estimates are therefore best treated as a reasonable approximation, not a precise
        individual measurement.
      </p>

      <h2>Comparing activities</h2>
      <table>
        <thead><tr><th>Activity</th><th>Approximate MET</th></tr></thead>
        <tbody>
          <tr><td>Yoga</td><td>2.5</td></tr>
          <tr><td>Walking, brisk</td><td>5.0</td></tr>
          <tr><td>Weight training, general</td><td>3.5</td></tr>
          <tr><td>Cycling, moderate</td><td>8.0</td></tr>
          <tr><td>Swimming, moderate laps</td><td>8.3</td></tr>
          <tr><td>Running, 6 mph</td><td>9.8</td></tr>
          <tr><td>Jump rope</td><td>12.3</td></tr>
          <tr><td>Running, 8 mph</td><td>13.5</td></tr>
        </tbody>
      </table>

      <h2>Where this fits into a bigger picture</h2>
      <p>
        Exercise calorie burn is typically a modest fraction of total daily energy
        expenditure for most people — resting metabolism (see the BMR/TDEE calculator)
        usually accounts for the largest share of calories burned in a day, even for
        people who exercise regularly. This tool estimates the exercise contribution
        specifically, not a complete daily energy picture.
      </p>
    </>
  ),
});

/* ------------------------------------------------------------------ */
export const waterIntake = makeTool({
  slug: "water-intake",
  category: "health",
  group: "Energy",
  title: "Daily water intake calculator",
  label: "Water intake",
  description:
    "Estimate a general daily water intake range from body weight and exercise duration, using commonly cited reference formulas.",
  keywords: ["water intake calculator", "hydration calculator", "how much water should i drink", "daily water needs"],
  columns: 3,
  inputs: [
    { key: "weight", label: "Body weight", unit: "kg", initial: "70" },
    { key: "exercise", label: "Exercise duration", unit: "minutes/day", initial: "30", optional: true },
  ],
  compute: ({ n }) => {
    if (!(n.weight > 0)) return null;
    const baseline = n.weight * 35; // mL, a commonly cited general reference
    const exerciseMin = Number.isFinite(n.exercise) && n.exercise > 0 ? n.exercise : 0;
    const exerciseAddition = (exerciseMin / 30) * 350; // roughly 350 mL per 30 min of exercise
    const total = baseline + exerciseAddition;
    return {
      name: "General reference range",
      value: `${trim(total / 1000, 3)} L per day`,
      rows: [
        { label: "Baseline (35 mL per kg)", value: `${trim(baseline / 1000, 3)} L` },
        { label: "Addition for exercise", value: `${trim(exerciseAddition / 1000, 3)} L` },
        { label: "In cups (approx. 240 mL each)", value: trim(total / 240, 4) },
        { label: "In standard 500 mL bottles", value: trim(total / 500, 4) },
      ],
      note: "A general population reference, not a personalised medical recommendation. Actual needs vary substantially with climate, altitude, health conditions, pregnancy and diet — food itself typically supplies 20% or more of total water intake, which this estimate does not separately account for.",
    };
  },
  Article: () => (
    <>
      <p>
        This calculator applies a commonly cited general reference — roughly 35 millilitres
        per kilogram of body weight per day — with an addition for exercise duration, to
        give a rough daily water intake range. It is a starting point for a very individual
        question, not a precise personal prescription.
      </p>
      <Formula>Baseline ≈ 35 mL × body weight (kg), plus roughly 350 mL per 30 minutes of exercise</Formula>

      <h2>Why there is no single correct number</h2>
      <p>
        Total water needs depend on far more than body weight: climate and humidity,
        altitude, activity level, diet composition, and individual physiology all shift the
        real requirement, sometimes substantially. Someone in a hot, humid climate doing
        physical labour outdoors needs considerably more water than the same body weight
        sitting in an air-conditioned office — a gap this simple formula cannot capture,
        since it only takes weight and exercise duration as input.
      </p>

      <h2>Food already supplies a meaningful share</h2>
      <p>
        A commonly cited estimate is that roughly 20% of daily water intake in a typical
        diet comes from food itself — fruits and vegetables in particular are largely
        water by weight. This calculator estimates total fluid need generally, without
        separately breaking out how much should come from drinking versus food, since that
        split depends heavily on individual diet.
      </p>

      <h2>Thirst is a reasonably good guide for most healthy people</h2>
      <p>
        For most healthy adults under normal conditions, thirst is a reasonably reliable
        physiological signal for hydration needs — the body has a functioning regulatory
        system for this. Formula-based estimates like this one are more useful as a rough
        sanity check or as a planning aid (how much water to carry on a hike, say) than as
        a strict target to hit exactly every day.
      </p>

      <h2>When to seek more specific guidance</h2>
      <p>
        Certain conditions change fluid needs significantly and are outside the scope of
        any general formula — kidney disease, heart failure, pregnancy, certain
        medications, and endurance exercise in heat all shift the picture in ways that
        deserve individualised medical guidance rather than a generic calculation. If you
        have a relevant health condition, or unusual thirst, urination or fluid retention
        patterns, that is a conversation for a doctor, not a formula.
      </p>
    </>
  ),
});

/* ------------------------------------------------------------------ */
export const macronutrientRatio = makeTool({
  slug: "macronutrient-ratio",
  category: "health",
  group: "Energy",
  title: "Macronutrient ratio calculator",
  label: "Macronutrient ratio",
  description:
    "Convert a daily calorie target and a chosen carbohydrate/protein/fat split into grams of each macronutrient.",
  keywords: ["macro calculator", "macronutrient calculator", "carbs protein fat calculator", "macro ratio"],
  related: ["bmr-tdee", "calories-burned-exercise"],
  columns: 4,
  inputs: [
    { key: "calories", label: "Daily calorie target", unit: "kcal", initial: "2200" },
    { key: "carbPct", label: "Carbohydrate", unit: "%", initial: "40" },
    { key: "proteinPct", label: "Protein", unit: "%", initial: "30" },
    { key: "fatPct", label: "Fat", unit: "%", initial: "30" },
  ],
  compute: ({ n }) => {
    if (!(n.calories > 0)) return null;
    const sum = n.carbPct + n.proteinPct + n.fatPct;
    if (Math.abs(sum - 100) > 1) return null;
    const carbCal = n.calories * (n.carbPct / 100);
    const proteinCal = n.calories * (n.proteinPct / 100);
    const fatCal = n.calories * (n.fatPct / 100);
    const carbG = carbCal / 4;
    const proteinG = proteinCal / 4;
    const fatG = fatCal / 9;
    return {
      name: "Grams per day",
      value: `${trim(carbG, 4)}g carbs · ${trim(proteinG, 4)}g protein · ${trim(fatG, 4)}g fat`,
      rows: [
        { label: "Carbohydrates", value: `${trim(carbG, 4)} g (${trim(carbCal, 5)} kcal)` },
        { label: "Protein", value: `${trim(proteinG, 4)} g (${trim(proteinCal, 5)} kcal)` },
        { label: "Fat", value: `${trim(fatG, 4)} g (${trim(fatCal, 5)} kcal)` },
      ],
      note: "This converts a chosen ratio and calorie target into grams — it does not recommend what the ratio or calorie target should be. Nutritional needs are highly individual; a registered dietitian is the right source for a personalised target.",
    };
  },
  Article: () => (
    <>
      <p>
        This tool performs a single, purely mathematical conversion: given a total daily
        calorie figure and a chosen percentage split between carbohydrates, protein and
        fat, it converts each percentage into grams. It does not recommend a calorie
        target or a macro split — both of those are inputs you provide, typically based on
        guidance from elsewhere.
      </p>
      <Formula>
        Carb grams = (calories × carb%) / 4{"\n"}
        Protein grams = (calories × protein%) / 4{"\n"}
        Fat grams = (calories × fat%) / 9
      </Formula>
      <p>
        The different divisors reflect each macronutrient&rsquo;s energy density:
        carbohydrates and protein both provide approximately 4 kilocalories per gram, while
        fat provides approximately 9 — more than double, gram for gram. This is why a
        higher-fat percentage of calories translates to fewer actual grams than the
        percentage alone might suggest.
      </p>

      <h2>Why the three percentages have to add to 100</h2>
      <p>
        Carbohydrate, protein and fat percentages describe how a fixed total calorie
        budget is divided between the three, so by definition they must sum to 100%. This
        calculator checks for that and will not compute a result if the three percentages
        do not add up, since an inconsistent split does not correspond to any actual
        calorie total.
      </p>

      <h2>There is no single correct macro split</h2>
      <p>
        Different goals and different dietary approaches favour different splits, and
        research supports a range of reasonable combinations rather than one optimal ratio
        for everyone. A 40/30/30 split, a lower-carbohydrate approach, or a
        higher-carbohydrate approach favoured by endurance athletes can all be
        nutritionally sound depending on individual goals, activity level, medical history
        and personal preference. This calculator deliberately does not suggest a
        &ldquo;correct&rdquo; ratio, because that decision depends on factors specific to
        the individual that a generic calculator has no way to know.
      </p>

      <h2>Grams are more actionable than percentages when eating</h2>
      <p>
        Nutrition labels and food tracking apps report macronutrients in grams, not
        percentages, which is the practical reason this conversion is useful — knowing you
        want &ldquo;30% of calories from protein&rdquo; is not directly actionable at the
        dinner table, but knowing you are targeting &ldquo;165 grams of protein&rdquo; can
        be checked directly against a food label.
      </p>

      <h2>Where to get a personalised target</h2>
      <p>
        A registered dietitian, taking into account medical history, activity level,
        specific goals and any conditions like diabetes or kidney disease, is the
        appropriate source for a calorie target and macro split tailored to an individual
        — particularly for anyone with an existing health condition, a history of
        disordered eating, or who is not simply looking for a general reference figure.
      </p>
    </>
  ),
});
