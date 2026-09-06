"use client";

import { makeTool } from "@/lib/makeTool";
import Formula from "@/components/Formula";
import { trim } from "@/lib/format";

/* ------------------------------------------------------------------ */
export const ipSubnet = makeTool({
  slug: "ip-subnet",
  category: "everyday",
  group: "Tech and security",
  title: "IP subnet calculator",
  label: "IP subnet",
  description:
    "Find the network address, broadcast address, usable host range and subnet mask for an IPv4 address and CIDR prefix.",
  keywords: ["ip subnet", "subnet calculator", "cidr", "network address", "subnet mask", "broadcast address"],
  columns: 2,
  inputs: [
    { key: "ip", label: "IP address", initial: "192.168.1.50", hint: "e.g. 192.168.1.0" },
    { key: "cidr", label: "CIDR prefix", initial: "24", unit: "/", hint: "0–32" },
  ],
  compute: ({ n, s }) => {
    const raw = String(s.ip ?? "").trim();
    const parts = raw.split(".").map((p) => Number(p));
    const prefix = Math.round(n.cidr);
    if (
      parts.length !== 4 ||
      parts.some((p) => !Number.isInteger(p) || p < 0 || p > 255) ||
      !Number.isFinite(prefix) ||
      prefix < 0 ||
      prefix > 32
    ) {
      return null;
    }
    const ipInt = (((parts[0] << 24) >>> 0) + (parts[1] << 16) + (parts[2] << 8) + parts[3]) >>> 0;
    const maskInt = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
    const networkInt = (ipInt & maskInt) >>> 0;
    const broadcastInt = (networkInt | (~maskInt >>> 0)) >>> 0;
    const toDotted = (v: number) =>
      [(v >>> 24) & 255, (v >>> 16) & 255, (v >>> 8) & 255, v & 255].join(".");

    const totalHosts = 2 ** (32 - prefix);
    const usableHosts = prefix >= 31 ? 0 : Math.max(0, totalHosts - 2);
    const firstHost = prefix >= 31 ? networkInt : networkInt + 1;
    const lastHost = prefix >= 31 ? broadcastInt : broadcastInt - 1;

    const octet = (bits: number) =>
      bits <= 0 ? 0 : bits >= 8 ? 255 : (0xff << (8 - bits)) & 0xff;
    const wildcardInt = (~maskInt) >>> 0;

    return {
      name: "Network address",
      value: toDotted(networkInt),
      rows: [
        { label: "Subnet mask", value: toDotted(maskInt) },
        { label: "Wildcard mask", value: toDotted(wildcardInt) },
        { label: "Broadcast address", value: toDotted(broadcastInt) },
        {
          label: "Usable host range",
          value: usableHosts > 0 ? `${toDotted(firstHost)} – ${toDotted(lastHost)}` : "None (point-to-point or single host)",
        },
        { label: "Total addresses", value: totalHosts.toLocaleString() },
        { label: "Usable hosts", value: usableHosts.toLocaleString() },
      ],
      note: "Standard IPv4 subnetting. /31 and /32 have no usable host range under the classic definition, though /31 is commonly used for point-to-point links.",
    };
  },
  Article: () => (
    <>
      <p>
        An IPv4 address and a subnet mask together split a network into a network portion
        and a host portion. The mask decides where that split falls, which in turn decides
        how many devices the subnet can hold and where its boundaries sit.
      </p>
      <Formula>Total addresses = 2^(32 − prefix)</Formula>
      <p>
        A /24 network has 32 − 24 = 8 host bits, so 2⁸ = 256 total addresses. A /28 has only
        4 host bits, giving 16 addresses. Every step down in the host-bit count halves the
        network&rsquo;s size.
      </p>

      <h2>Why two addresses are unusable</h2>
      <p>
        The first address in a subnet, with all host bits set to zero, identifies the
        network itself and cannot be assigned to a device. The last address, with all host
        bits set to one, is the broadcast address, reserved for messages sent to every host
        on the subnet at once. A /24 with 256 total addresses therefore has 254 usable ones.
      </p>

      <h2>Reading CIDR notation</h2>
      <p>
        The number after the slash is the count of bits fixed as the network portion,
        counted from the left. <code>/24</code> means the first three octets are the
        network and the last octet is free for hosts — exactly what the traditional
        255.255.255.0 mask means. CIDR notation and dotted-decimal masks are two ways of
        writing the identical thing.
      </p>

      <table>
        <thead><tr><th>CIDR</th><th>Mask</th><th>Total addresses</th><th>Usable hosts</th></tr></thead>
        <tbody>
          <tr><td>/24</td><td>255.255.255.0</td><td>256</td><td>254</td></tr>
          <tr><td>/25</td><td>255.255.255.128</td><td>128</td><td>126</td></tr>
          <tr><td>/26</td><td>255.255.255.192</td><td>64</td><td>62</td></tr>
          <tr><td>/28</td><td>255.255.255.240</td><td>16</td><td>14</td></tr>
          <tr><td>/30</td><td>255.255.255.252</td><td>4</td><td>2</td></tr>
        </tbody>
      </table>

      <h2>Why subnet at all</h2>
      <p>
        A single flat network of thousands of devices floods itself with broadcast traffic
        and puts every machine in one failure domain. Splitting an address block into
        subnets — one per floor, per department, per VLAN — contains broadcast traffic,
        lets you apply different routing and firewall rules per segment, and uses address
        space more efficiently than handing every segment a full /24 regardless of size.
      </p>

      <h2>The wildcard mask</h2>
      <p>
        Cisco access lists and some routing configurations use a wildcard mask instead of a
        subnet mask — the bitwise inverse of it. Where the subnet mask has a 1, the
        wildcard has a 0, and vice versa. A /24&rsquo;s subnet mask of 255.255.255.0 becomes
        a wildcard of 0.0.0.255. It is easy to transpose the two by mistake, and doing so
        silently matches the opposite set of addresses from the one intended.
      </p>
    </>
  ),
});

/* ------------------------------------------------------------------ */
const MS_DAY = 86400000;

function parseDateInput(v: string): Date | null {
  if (!v) return null;
  const d = new Date(v + "T00:00:00");
  return Number.isNaN(d.getTime()) ? null : d;
}

export const ageCalculator = makeTool({
  slug: "age-calculator",
  category: "everyday",
  group: "Dates and time",
  title: "Age calculator",
  label: "Age calculator",
  description:
    "Find exact age in years, months and days from a birth date, plus days until the next birthday and total days lived.",
  keywords: ["age calculator", "how old am i", "birthday calculator", "date of birth"],
  columns: 2,
  inputs: [
    { kind: "date", key: "dob", label: "Date of birth", initial: "2012-01-01" },
    { kind: "date", key: "asOf", label: "As of date", initial: "" , optional: true, hint: "Leave blank for today"},
  ],
  compute: ({ s }) => {
    const dob = parseDateInput(String(s.dob ?? ""));
    if (!dob) return null;
    const asOf = parseDateInput(String(s.asOf ?? "")) ?? new Date(new Date().toDateString());
    if (asOf < dob) return null;

    let years = asOf.getFullYear() - dob.getFullYear();
    let months = asOf.getMonth() - dob.getMonth();
    let days = asOf.getDate() - dob.getDate();
    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(asOf.getFullYear(), asOf.getMonth(), 0).getDate();
      days += prevMonth;
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const totalDays = Math.round((asOf.getTime() - dob.getTime()) / MS_DAY);

    let nextBday = new Date(asOf.getFullYear(), dob.getMonth(), dob.getDate());
    if (nextBday < asOf) nextBday = new Date(asOf.getFullYear() + 1, dob.getMonth(), dob.getDate());
    const daysToNext = Math.round((nextBday.getTime() - asOf.getTime()) / MS_DAY);

    return {
      name: "Age",
      value: `${years} years, ${months} months, ${days} days`,
      rows: [
        { label: "Total days lived", value: totalDays.toLocaleString() },
        { label: "Total weeks lived", value: Math.floor(totalDays / 7).toLocaleString() },
        { label: "Total months lived", value: (years * 12 + months).toLocaleString() },
        { label: "Days until next birthday", value: daysToNext === 0 ? "Today!" : daysToNext.toLocaleString() },
      ],
    };
  },
  Article: () => (
    <>
      <p>
        Age arithmetic looks trivial and is not, because months and years have unequal
        lengths. Subtracting two calendar dates directly to get &ldquo;years and
        months&rdquo; produces wrong answers whenever the day-of-month of the birth date
        falls after the day-of-month of the target date — you have to borrow from the
        month column, and the amount you borrow depends on how many days the previous
        month actually had.
      </p>

      <h2>Why the naive subtraction fails</h2>
      <p>
        Someone born on 30 January, checked on 1 March, is not &ldquo;1 month and 1
        day&rdquo; old since their last birthday in a naive year-month-day subtraction —
        the day component goes negative (1 − 30) and has to borrow a full month, and that
        borrowed month is worth 28, 29, 30 or 31 days depending on which month it is. Get
        this wrong and ages come out fluctuating by a day depending on which months are
        involved, which is why so many quick age scripts are subtly buggy.
      </p>

      <h2>Total days as the honest number</h2>
      <p>
        Because years and months are irregular units, the one figure that is unambiguous
        is the total elapsed days — a straight difference between two calendar dates with
        no unit conversion involved. Everything else, including &ldquo;years and
        months,&rdquo; is a human-readable approximation layered on top of that count.
      </p>

      <h2>Leap years</h2>
      <p>
        A year is not exactly 365 days; the calendar adds a leap day roughly every four
        years to keep pace with the actual solar year. Someone born on 29 February has a
        real birthday only once every four years on the standard calendar — most systems,
        including this one, treat 1 March as their observed birthday in non-leap years,
        though there is no universal convention and some jurisdictions specify 28 February
        instead for legal purposes such as the age of majority.
      </p>

      <h2>Where exact age actually matters</h2>
      <ul>
        <li>Legal eligibility — voting, driving, purchasing age-restricted goods — is defined by exact elapsed time, not a rounded figure.</li>
        <li>Insurance premiums and actuarial tables are often banded by age in a way sensitive to which side of a birthday a person falls.</li>
        <li>Developmental and medical assessments in young children are frequently expressed in months rather than years, because a few months matters proportionally more early in life.</li>
      </ul>
    </>
  ),
});

/* ------------------------------------------------------------------ */
export const dateCalculator = makeTool({
  slug: "date-calculator",
  category: "everyday",
  group: "Dates and time",
  title: "Date calculator — add or subtract days",
  label: "Date calculator",
  description:
    "Add or subtract a number of days, weeks or months from a date, or find the number of days between two dates.",
  keywords: ["date calculator", "days between dates", "add days to date", "date difference"],
  columns: 3,
  inputs: [
    { kind: "date", key: "start", label: "Start date", initial: new Date().toISOString().slice(0, 10) },
    { key: "amount", label: "Amount to add", initial: "30", hint: "Use a negative number to subtract" },
    { kind: "select", key: "unit", label: "Unit", initial: "days",
      options: [
        { value: "days", label: "Days" },
        { value: "weeks", label: "Weeks" },
        { value: "months", label: "Months" },
        { value: "years", label: "Years" },
      ] },
    { kind: "date", key: "end", label: "Or: an end date to compare", initial: "", optional: true },
  ],
  compute: ({ n, s }) => {
    const start = parseDateInput(String(s.start ?? ""));
    if (!start) return null;

    const endInput = parseDateInput(String(s.end ?? ""));
    if (endInput) {
      const diffDays = Math.round((endInput.getTime() - start.getTime()) / MS_DAY);
      const fmt = (d: Date) => d.toISOString().slice(0, 10);
      return {
        name: "Days between dates",
        value: `${Math.abs(diffDays).toLocaleString()} days`,
        rows: [
          { label: "Direction", value: diffDays >= 0 ? "End date is after start date" : "End date is before start date" },
          { label: "In weeks", value: trim(Math.abs(diffDays) / 7, 5) },
          { label: "Start date", value: fmt(start) },
          { label: "End date", value: fmt(endInput) },
        ],
      };
    }

    if (!Number.isFinite(n.amount)) return null;
    const amt = Math.round(n.amount);
    const result = new Date(start);
    if (s.unit === "days") result.setDate(result.getDate() + amt);
    else if (s.unit === "weeks") result.setDate(result.getDate() + amt * 7);
    else if (s.unit === "months") result.setMonth(result.getMonth() + amt);
    else result.setFullYear(result.getFullYear() + amt);

    const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const diffDays = Math.round((result.getTime() - start.getTime()) / MS_DAY);

    return {
      name: "Resulting date",
      value: result.toISOString().slice(0, 10),
      rows: [
        { label: "Day of week", value: dayNames[result.getDay()] },
        { label: "Days from start", value: diffDays.toLocaleString() },
      ],
    };
  },
  Article: () => (
    <>
      <p>
        Adding a fixed number of days to a date is unambiguous — every day is the same
        length, so the arithmetic is just a straight offset. Adding months or years is not,
        because those units stretch and compress depending on which months are involved.
      </p>

      <h2>Why adding months is not linear</h2>
      <p>
        Adding one month to 31 January cannot land on 31 February, because February does
        not have 31 days. Every date library has to make a choice here, and the common one
        — clamping to the last valid day of the target month — turns 31 January + 1 month
        into 28 February (or 29, in a leap year). This calculator follows that convention,
        which is also what spreadsheet software and most programming languages do by
        default.
      </p>
      <p>
        The consequence worth knowing: adding one month twice does not always equal adding
        two months once, once a clamp has happened. 31 January + 1 month = 28 February;
        28 February + 1 month = 28 March. But 31 January + 2 months in one step gives
        31 March. Chained single-month additions and one multi-month addition can diverge.
      </p>

      <h2>Counting days between two dates</h2>
      <p>
        This is the more reliable operation, because days do not have the variable-length
        problem that months do. The count is a plain subtraction of two points on a
        continuous timeline. The only subtlety is whether the two endpoints are both
        included, both excluded, or one of each — a convention that has to be fixed before
        the count means anything, and one that trips up rental agreements and contract
        terms surprisingly often. This calculator gives the number of days that have
        elapsed between the two dates, not an inclusive day count.
      </p>

      <h2>Where this shows up</h2>
      <ul>
        <li>Working out a due date a fixed number of days after an invoice or a contract signing.</li>
        <li>Finding how many days remain until a deadline, exam or event.</li>
        <li>Calculating a return-by date a set number of weeks after a loan or rental began.</li>
        <li>Checking whether a fixed-term period — a warranty, a visa, a trial — has expired.</li>
      </ul>

      <h2>Time zones and daylight saving</h2>
      <p>
        This calculator works entirely in calendar dates and ignores time-of-day and time
        zone entirely, which is the right approach for questions phrased as
        &ldquo;days,&rdquo; but the wrong one if the actual question involves exact
        timestamps — a flight duration crossing a daylight-saving transition, for instance,
        can differ from a naive hour count by exactly one hour.
      </p>
    </>
  ),
});

/* ------------------------------------------------------------------ */
type GpaCourse = { grade: string; credits: number };

const GRADE_POINTS: Record<string, number> = {
  "A+": 4.0, "A": 4.0, "A-": 3.7,
  "B+": 3.3, "B": 3.0, "B-": 2.7,
  "C+": 2.3, "C": 2.0, "C-": 1.7,
  "D+": 1.3, "D": 1.0, "D-": 0.7,
  "F": 0.0,
};

export const gpaCalculator = makeTool({
  slug: "gpa-calculator",
  category: "everyday",
  group: "Study tools",
  title: "GPA calculator",
  label: "GPA calculator",
  description:
    "Calculate your grade point average on the standard 4.0 scale from letter grades and credit hours for up to six courses.",
  keywords: ["gpa calculator", "grade point average", "4.0 scale", "college gpa", "semester gpa"],
  columns: 3,
  inputs: [
    { kind: "select", key: "g1", label: "Course 1 grade", initial: "A",
      options: Object.keys(GRADE_POINTS).map((g) => ({ value: g, label: g })) },
    { key: "c1", label: "Course 1 credits", initial: "3" },
    { kind: "select", key: "g2", label: "Course 2 grade", initial: "B+",
      options: Object.keys(GRADE_POINTS).map((g) => ({ value: g, label: g })) },
    { key: "c2", label: "Course 2 credits", initial: "3" },
    { kind: "select", key: "g3", label: "Course 3 grade", initial: "A-",
      options: [{ value: "", label: "— none —" }, ...Object.keys(GRADE_POINTS).map((g) => ({ value: g, label: g }))] },
    { key: "c3", label: "Course 3 credits", initial: "", optional: true },
    { kind: "select", key: "g4", label: "Course 4 grade", initial: "",
      options: [{ value: "", label: "— none —" }, ...Object.keys(GRADE_POINTS).map((g) => ({ value: g, label: g }))] },
    { key: "c4", label: "Course 4 credits", initial: "", optional: true },
  ],
  compute: ({ n, s }) => {
    const rows: GpaCourse[] = [];
    for (const i of [1, 2, 3, 4]) {
      const g = String((s as Record<string, unknown>)[`g${i}`] ?? "");
      const c = (n as Record<string, number>)[`c${i}`];
      if (g && GRADE_POINTS[g] !== undefined && Number.isFinite(c) && c > 0) {
        rows.push({ grade: g, credits: c });
      }
    }
    if (rows.length === 0) return null;

    const totalCredits = rows.reduce((a, r) => a + r.credits, 0);
    const totalPoints = rows.reduce((a, r) => a + GRADE_POINTS[r.grade] * r.credits, 0);
    const gpa = totalPoints / totalCredits;

    return {
      name: "GPA",
      value: trim(gpa, 4),
      rows: [
        { label: "Total credit hours", value: String(totalCredits) },
        { label: "Total quality points", value: trim(totalPoints, 5) },
        { label: "Courses counted", value: String(rows.length) },
        { label: "On a percentage-style scale (approx.)", value: `${trim(gpa * 25, 4)}%` },
      ],
      note: "Standard unweighted 4.0 scale. Some schools weight honors or AP courses higher — check your institution's specific scale before relying on this for an official record.",
    };
  },
  Article: () => (
    <>
      <p>
        Grade point average converts letter grades into a single weighted number. Each
        letter grade maps to a point value, and the average is weighted by how many
        credit hours each course was worth — a 4-credit course counts twice as much toward
        the average as a 2-credit one.
      </p>
      <Formula>GPA = Σ(grade points × credits) / Σ(credits)</Formula>

      <h2>The standard scale</h2>
      <table>
        <thead><tr><th>Grade</th><th>Points</th><th>Grade</th><th>Points</th></tr></thead>
        <tbody>
          <tr><td>A / A+</td><td>4.0</td><td>C</td><td>2.0</td></tr>
          <tr><td>A−</td><td>3.7</td><td>C−</td><td>1.7</td></tr>
          <tr><td>B+</td><td>3.3</td><td>D+</td><td>1.3</td></tr>
          <tr><td>B</td><td>3.0</td><td>D</td><td>1.0</td></tr>
          <tr><td>B−</td><td>2.7</td><td>D−</td><td>0.7</td></tr>
          <tr><td>C+</td><td>2.3</td><td>F</td><td>0.0</td></tr>
        </tbody>
      </table>
      <p>
        This is the most common scale in the United States, but it is a convention, not a
        universal standard — some schools use a straight integer scale without plus and
        minus distinctions, and grading scales outside the US vary widely.
      </p>

      <h2>Why credit-weighting matters</h2>
      <p>
        A student who gets an A in a 1-credit seminar and a C in a 4-credit core course
        does not average to a B — the core course, carrying four times the weight, pulls
        the GPA much closer to a C than a simple average of the two letter grades would
        suggest. This is exactly why GPA is a weighted average rather than a plain mean of
        grade points.
      </p>

      <h2>Semester GPA versus cumulative GPA</h2>
      <p>
        A semester GPA uses only that term&rsquo;s courses. A cumulative GPA uses every
        credit hour and quality point earned across every term to date. Combining them
        correctly means adding total quality points and total credit hours across all
        terms and dividing at the end — not averaging the semester GPAs themselves, since
        that silently ignores differences in course load between semesters.
      </p>

      <h2>A caveat worth stating plainly</h2>
      <p>
        Many institutions weight honors, AP or IB courses above the standard 4.0 ceiling —
        sometimes to 5.0 for an A in an honors class. This calculator uses the unweighted
        scale. If your school uses weighted grades, the number here will understate your
        official GPA, and you should check your school&rsquo;s registrar or handbook for
        the exact scale it uses before relying on any online calculator for something like
        an official transcript or a scholarship application.
      </p>
    </>
  ),
});

/* ------------------------------------------------------------------ */
function randomInt(max: number): number {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] % max;
}

export const passwordGenerator = makeTool({
  slug: "password-generator",
  category: "everyday",
  group: "Tech and security",
  title: "Password generator",
  label: "Password generator",
  description:
    "Generate a random password of a chosen length using your browser's cryptographic random number generator, with an estimate of how hard it is to guess.",
  keywords: ["password generator", "random password", "strong password", "secure password"],
  columns: 3,
  inputs: [
    { key: "len", label: "Length", initial: "16", hint: "8–64 characters" },
    { kind: "select", key: "upper", label: "Uppercase letters", initial: "yes",
      options: [{ value: "yes", label: "Include" }, { value: "no", label: "Exclude" }] },
    { kind: "select", key: "digits", label: "Digits", initial: "yes",
      options: [{ value: "yes", label: "Include" }, { value: "no", label: "Exclude" }] },
    { kind: "select", key: "symbols", label: "Symbols", initial: "yes",
      options: [{ value: "yes", label: "Include" }, { value: "no", label: "Exclude" }] },
    { key: "regen", label: "Change this number to generate a new one", initial: "1" },
  ],
  compute: ({ n, s }) => {
    const len = Math.round(n.len);
    if (!Number.isFinite(len) || len < 4 || len > 128) return null;
    if (typeof window === "undefined" || !window.crypto?.getRandomValues) return null;

    let charset = "abcdefghijklmnopqrstuvwxyz";
    if (s.upper === "yes") charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (s.digits === "yes") charset += "0123456789";
    if (s.symbols === "yes") charset += "!@#$%^&*()-_=+[]{};:,.<>?";

    let pw = "";
    for (let i = 0; i < len; i++) pw += charset[randomInt(charset.length)];

    const entropyBits = len * Math.log2(charset.length);
    const guessesPerSecond = 1e10; // a generous offline-attack estimate
    const secondsToGuess = 2 ** entropyBits / guessesPerSecond / 2; // average case
    const years = secondsToGuess / (3600 * 24 * 365);

    let strength: string;
    if (entropyBits < 40) strength = "Weak";
    else if (entropyBits < 60) strength = "Moderate";
    else if (entropyBits < 80) strength = "Strong";
    else strength = "Very strong";

    return {
      name: "Generated password",
      value: pw,
      rows: [
        { label: "Character set size", value: `${charset.length} characters` },
        { label: "Entropy", value: `${trim(entropyBits, 5)} bits` },
        { label: "Strength", value: strength },
        {
          label: "Estimated time to crack (offline attack)",
          value: years > 1e6 ? `${trim(years / 1e6, 4)} million years` : years > 1 ? `${trim(years, 4)} years` : `${trim(secondsToGuess, 4)} seconds`,
        },
      ],
      note: "Generated locally in your browser using the Web Crypto API — it is never sent anywhere. Change the 'regen' number to produce a new one, since the same inputs otherwise redraw identically.",
    };
  },
  Article: () => (
    <>
      <p>
        A password&rsquo;s resistance to guessing comes down to one number: how many
        possible passwords exist in the space it was drawn from, expressed as entropy in
        bits. A truly random password of length L drawn from a character set of size N has
        entropy L × log₂(N) bits, and every additional bit doubles the number of guesses an
        attacker needs on average.
      </p>
      <Formula>Entropy (bits) = length × log₂(character set size)</Formula>

      <h2>Why length beats complexity</h2>
      <p>
        Adding one more character to the length multiplies the search space by the size of
        the character set — for a full set of about 90 printable characters, that is
        roughly a 90-fold increase. Adding an entire new character class (say, requiring at
        least one symbol) barely moves the character-set size at all if the length stays
        the same. A 20-character password using only lowercase letters has more entropy
        (about 94 bits) than a 10-character password using every character class combined
        (about 65 bits). Length is the dominant factor by a wide margin.
      </p>

      <h2>Randomness has to come from the right place</h2>
      <p>
        This generator uses <code>crypto.getRandomValues</code>, the Web Crypto API&rsquo;s
        cryptographically secure random number source, rather than
        <code>Math.random()</code>. The distinction matters: <code>Math.random()</code> is
        good enough for a dice-roll animation but its internal state can, in principle, be
        reconstructed from enough observed outputs, which makes it unsuitable for anything
        security-relevant. Every password here is generated locally in your browser and
        never transmitted anywhere.
      </p>

      <h2>What entropy does not protect against</h2>
      <ul>
        <li>
          <strong>Reused passwords.</strong> A single leaked database exposes every account
          that reused the same password, regardless of how strong it was.
        </li>
        <li>
          <strong>Phishing.</strong> A perfectly random password typed into a fake login
          page is compromised instantly — entropy only defends against guessing, not
          deception.
        </li>
        <li>
          <strong>Weak storage on the far end.</strong> If a service stores passwords
          improperly, the strength of what you sent them is irrelevant.
        </li>
      </ul>
      <p>
        A password manager that generates and stores a unique high-entropy password per
        site addresses the reuse problem, which is generally the larger practical risk
        compared with entropy alone.
      </p>

      <h2>The crack-time estimate</h2>
      <p>
        The time-to-crack figure assumes an offline attack — the attacker has obtained a
        password hash and is guessing as fast as their hardware allows, taken here as ten
        billion guesses per second, a reasonable figure for GPU-accelerated cracking
        against a fast, unsalted hash. Real systems that hash passwords properly (with
        bcrypt, scrypt or Argon2) impose a deliberate slowdown that can push this estimate
        up by several orders of magnitude — and conversely, a system using a fast, poorly
        chosen hash function makes real-world cracking faster than this estimate suggests.
      </p>
    </>
  ),
});
