"use client";

import { makeTool } from "@/lib/makeTool";
import Formula from "@/components/Formula";
import { si, trim } from "@/lib/format";

const PI = Math.PI;

export const newtonsSecondLaw = makeTool({
  slug: "force-mass-acceleration",
  category: "physics",
  group: "Mechanics",
  title: "Force, mass and acceleration calculator",
  label: "F = ma",
  description:
    "Solve Newton's second law for force, mass or acceleration, with weight and momentum change included.",
  keywords: ["newtons second law", "force", "mass", "acceleration", "f=ma"],
  related: ["projectile-motion", "kinetic-energy"],
  columns: 4,
  inputs: [
    { key: "m", label: "Mass", unit: "kg", initial: "1500" },
    { key: "a", label: "Acceleration", unit: "m/s²", initial: "3" },
    { key: "t", label: "Time applied", unit: "s", initial: "", optional: true },
    { key: "g", label: "Gravity", unit: "m/s²", initial: "9.81" },
  ],
  compute: ({ n }) => {
    if (!(n.m > 0) || !Number.isFinite(n.a)) return null;
    const f = n.m * n.a;
    const rows = [
      { label: "Weight on Earth", value: `${trim(n.m * n.g, 5)} N` },
      { label: "Force in kilograms-force", value: `${trim(f / 9.80665, 5)} kgf` },
    ];
    if (n.t > 0) {
      rows.push({ label: "Velocity change", value: `${trim(n.a * n.t, 5)} m/s` });
      rows.push({ label: "Impulse", value: `${trim(f * n.t, 5)} N·s` });
      rows.push({ label: "Distance from rest", value: `${trim(0.5 * n.a * n.t * n.t, 5)} m` });
    }
    return { name: "Net force", value: `${trim(f, 5)} N`, rows };
  },
  Article: () => (
    <>
      <p>
        Newton&rsquo;s second law says the net force on an object equals its mass times its
        acceleration. The word doing the work is <em>net</em>: it is the vector sum of every
        force acting, not any single one of them.
      </p>
      <Formula>F = m · a&nbsp;&nbsp;&nbsp;a = F / m&nbsp;&nbsp;&nbsp;m = F / a</Formula>
      <p>
        A car pushed forward by 6 kN of drive force while 2 kN of drag and friction push
        back accelerates under 4 kN, not 6. This is why a vehicle stops accelerating at top
        speed even though the engine is still producing force — drag has grown until the net
        force is zero.
      </p>
      <h2>Mass and weight are different things</h2>
      <p>
        Mass is how much matter there is, measured in kilograms, and it does not change with
        location. Weight is the gravitational force on that mass, measured in newtons, and it
        does. A 70 kg person weighs about 687 N on Earth and 113 N on the Moon, but their mass
        is 70 kg in both places — and so is the force needed to accelerate them sideways.
      </p>
      <h2>Impulse and the reason airbags work</h2>
      <p>
        The law can be rewritten as F = Δp / Δt, force is the rate of change of momentum. A
        collision changes momentum by a fixed amount regardless of how it happens, so
        stretching the time over which that change occurs reduces the peak force
        proportionally. Crumple zones, airbags, running shoes and gymnastic landing mats all
        exploit exactly this.
      </p>
    </>
  ),
});

export const kineticEnergy = makeTool({
  slug: "kinetic-energy",
  category: "physics",
  group: "Energy and momentum",
  title: "Kinetic and potential energy calculator",
  label: "Kinetic energy",
  description:
    "Compute kinetic energy from mass and speed, gravitational potential energy from height, and the speed one converts into the other.",
  keywords: ["kinetic energy", "potential energy", "joules", "1/2mv2", "mgh"],
  related: ["force-mass-acceleration", "momentum"],
  columns: 4,
  inputs: [
    { key: "m", label: "Mass", unit: "kg", initial: "2" },
    { key: "v", label: "Speed", unit: "m/s", initial: "20" },
    { key: "h", label: "Height", unit: "m", initial: "10", optional: true },
    { key: "g", label: "Gravity", unit: "m/s²", initial: "9.81" },
  ],
  compute: ({ n }) => {
    if (!(n.m > 0) || !Number.isFinite(n.v)) return null;
    const ke = 0.5 * n.m * n.v * n.v;
    const rows = [
      { label: "Momentum", value: `${trim(n.m * n.v, 5)} kg·m/s` },
      { label: "In calories", value: `${trim(ke / 4.184, 5)} cal` },
      { label: "Speed if energy doubles", value: `${trim(n.v * Math.SQRT2, 5)} m/s` },
    ];
    if (n.h > 0) {
      const pe = n.m * n.g * n.h;
      rows.push({ label: "Potential energy at that height", value: `${trim(pe, 5)} J` });
      rows.push({ label: "Impact speed from that height", value: `${trim(Math.sqrt(2 * n.g * n.h), 5)} m/s` });
      rows.push({ label: "Height this KE could reach", value: `${trim(ke / (n.m * n.g), 5)} m` });
    }
    return { name: "Kinetic energy", value: `${trim(ke, 5)} J`, rows };
  },
  Article: () => (
    <>
      <p>
        Kinetic energy is the energy an object has because it is moving. Gravitational
        potential energy is the energy it has because of where it is. In the absence of
        friction, one converts entirely into the other.
      </p>
      <Formula>KE = ½ m v²&nbsp;&nbsp;&nbsp;PE = m g h</Formula>
      <h2>The square is the whole story</h2>
      <p>
        Kinetic energy scales with the square of speed while momentum scales linearly. Double
        the speed of a car and you double its momentum but quadruple its kinetic energy — and
        since braking has to dissipate all of that energy, the stopping distance also
        quadruples. A car travelling at 60 km/h needs roughly four times the braking distance
        of one at 30 km/h, not twice.
      </p>
      <p>
        The same square is why a 9 mm bullet weighing 8 grams at 360 m/s carries more energy
        than a 70 kg person walking at 1.5 m/s, despite weighing nine thousand times less.
      </p>
      <h2>Conversion between the two</h2>
      <p>
        Drop an object from height h and, ignoring air resistance, all its potential energy
        becomes kinetic by the time it lands. Setting mgh = ½mv² and cancelling the mass gives
        v = √(2gh) — which is why a feather and a hammer land together in a vacuum. The mass
        drops out of the equation entirely.
      </p>
      <h2>Where the energy actually goes</h2>
      <p>
        Real systems lose energy to air resistance, friction and permanent deformation. A
        bouncing ball returns to a lower height each time because some kinetic energy becomes
        heat and sound in the impact. The coefficient of restitution measures what fraction of
        the speed survives a collision.
      </p>
    </>
  ),
});

export const momentum = makeTool({
  slug: "momentum",
  category: "physics",
  group: "Energy and momentum",
  title: "Momentum and collision calculator",
  label: "Momentum",
  description:
    "Find momentum from mass and velocity, and the outcome of an elastic or perfectly inelastic collision between two bodies.",
  keywords: ["momentum", "collision", "elastic", "inelastic", "conservation"],
  related: ["kinetic-energy", "force-mass-acceleration"],
  columns: 4,
  inputs: [
    { key: "m1", label: "Mass 1", unit: "kg", initial: "2" },
    { key: "v1", label: "Velocity 1", unit: "m/s", initial: "5" },
    { key: "m2", label: "Mass 2", unit: "kg", initial: "3" },
    { key: "v2", label: "Velocity 2", unit: "m/s", initial: "-2" },
  ],
  compute: ({ n }) => {
    if (!(n.m1 > 0) || !(n.m2 > 0) || !Number.isFinite(n.v1) || !Number.isFinite(n.v2)) return null;
    const p = n.m1 * n.v1 + n.m2 * n.v2;
    const vInel = p / (n.m1 + n.m2);
    const u1 = ((n.m1 - n.m2) * n.v1 + 2 * n.m2 * n.v2) / (n.m1 + n.m2);
    const u2 = ((n.m2 - n.m1) * n.v2 + 2 * n.m1 * n.v1) / (n.m1 + n.m2);
    const keBefore = 0.5 * n.m1 * n.v1 ** 2 + 0.5 * n.m2 * n.v2 ** 2;
    const keInel = 0.5 * (n.m1 + n.m2) * vInel ** 2;
    return {
      name: "Total momentum",
      value: `${trim(p, 5)} kg·m/s`,
      rows: [
        { label: "Elastic: body 1 after", value: `${trim(u1, 5)} m/s` },
        { label: "Elastic: body 2 after", value: `${trim(u2, 5)} m/s` },
        { label: "Inelastic: combined speed", value: `${trim(vInel, 5)} m/s` },
        { label: "Kinetic energy before", value: `${trim(keBefore, 5)} J` },
        { label: "Energy lost if they stick", value: `${trim(keBefore - keInel, 5)} J` },
      ],
      note: "Use negative velocities for motion in the opposite direction.",
    };
  },
  Article: () => (
    <>
      <p>
        Momentum is mass times velocity, and it is conserved in every collision. Whatever the
        total was before, it is the same afterwards, provided no outside force acts. This
        holds whether the bodies bounce apart, stick together, or shatter.
      </p>
      <Formula>p = m v&nbsp;&nbsp;&nbsp;m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂</Formula>
      <h2>Elastic versus inelastic</h2>
      <p>
        In a perfectly elastic collision, kinetic energy is conserved as well as momentum.
        Billiard balls and gas molecules come close. In a perfectly inelastic collision the
        bodies stick together and move as one; momentum is still conserved but energy is not —
        the difference goes into deformation, heat and sound. Real collisions sit between the
        two extremes.
      </p>
      <h2>Direction is not optional</h2>
      <p>
        Momentum is a vector. Two objects of equal mass approaching each other at the same
        speed have zero total momentum, and if they stick together they stop dead. Getting the
        signs right is most of the work in these problems: pick a positive direction and stay
        with it.
      </p>
      <h2>A useful special case</h2>
      <p>
        In an elastic collision between equal masses where one is at rest, the moving one stops
        and the stationary one leaves at the original speed. This is the Newton&rsquo;s cradle
        result, and it is the only arrangement that satisfies both conservation laws at once.
      </p>
    </>
  ),
});

export const circularMotion = makeTool({
  slug: "circular-motion",
  category: "physics",
  group: "Mechanics",
  title: "Circular motion and centripetal force calculator",
  label: "Circular motion",
  description:
    "Compute centripetal acceleration, force, period and angular velocity for an object moving in a circle.",
  keywords: ["centripetal force", "circular motion", "angular velocity", "rpm", "g-force"],
  columns: 3,
  inputs: [
    { key: "m", label: "Mass", unit: "kg", initial: "1" },
    { key: "v", label: "Tangential speed", unit: "m/s", initial: "10" },
    { key: "r", label: "Radius", unit: "m", initial: "2" },
  ],
  compute: ({ n }) => {
    if (!(n.r > 0) || !Number.isFinite(n.v)) return null;
    const a = (n.v * n.v) / n.r;
    const w = n.v / n.r;
    return {
      name: "Centripetal acceleration",
      value: `${trim(a, 5)} m/s²`,
      rows: [
        { label: "Centripetal force", value: n.m > 0 ? `${trim(n.m * a, 5)} N` : "—" },
        { label: "In g", value: `${trim(a / 9.80665, 4)} g` },
        { label: "Angular velocity", value: `${trim(w, 5)} rad/s` },
        { label: "Period", value: `${trim((2 * PI) / w, 5)} s` },
        { label: "Revolutions per minute", value: `${trim((60 * w) / (2 * PI), 5)} rpm` },
      ],
    };
  },
  Article: () => (
    <>
      <p>
        An object moving in a circle at constant speed is still accelerating, because its
        direction is changing. That acceleration points inward, toward the centre, and
        something has to supply the force that produces it.
      </p>
      <Formula>a = v² / r = ω² r&nbsp;&nbsp;&nbsp;F = m v² / r</Formula>
      <h2>There is no centrifugal force</h2>
      <p>
        The outward push you feel on a roundabout is not a force acting on you. It is your
        inertia — your body trying to continue in a straight line while the seat pushes you
        inward. In an inertial frame, the only real force is the centripetal one, supplied by
        friction, tension, gravity or a normal force depending on the situation.
      </p>
      <h2>Radius matters more than you expect</h2>
      <p>
        Acceleration goes as the square of speed but only inversely with radius. Halving the
        radius of a turn at the same speed doubles the force required. This is why a tight
        corner is far harder on tyres than a sweeping one at the same speed, and why a
        centrifuge is short rather than long — it is easier to reach high acceleration by
        spinning a small radius quickly.
      </p>
      <h2>Where the force comes from</h2>
      <ul>
        <li>A car turning: sideways friction between tyre and road, which has a hard limit.</li>
        <li>A satellite: gravity, which is why orbital speed depends only on altitude.</li>
        <li>A ball on a string: tension, which is why the string snaps above a certain speed.</li>
        <li>A banked track: the horizontal component of the normal force, which is why banking lets a corner be taken faster than friction alone would allow.</li>
      </ul>
    </>
  ),
});

export const pendulum = makeTool({
  slug: "simple-pendulum",
  category: "physics",
  group: "Waves and optics",
  title: "Simple pendulum period calculator",
  label: "Pendulum period",
  description:
    "Find the period and frequency of a simple pendulum from its length and local gravity, with the large-angle correction shown.",
  keywords: ["pendulum", "period", "oscillation", "shm", "frequency"],
  columns: 3,
  inputs: [
    { key: "l", label: "Length", unit: "m", initial: "1" },
    { key: "g", label: "Gravity", unit: "m/s²", initial: "9.81" },
    { key: "th", label: "Amplitude", unit: "degrees", initial: "10", optional: true },
  ],
  compute: ({ n }) => {
    if (!(n.l > 0) || !(n.g > 0)) return null;
    const t = 2 * PI * Math.sqrt(n.l / n.g);
    const rows = [
      { label: "Frequency", value: `${trim(1 / t, 5)} Hz` },
      { label: "Angular frequency", value: `${trim(Math.sqrt(n.g / n.l), 5)} rad/s` },
      { label: "Length for a 1-second swing", value: `${trim(n.g / (4 * PI * PI), 5)} m` },
    ];
    if (n.th > 0) {
      const r = (n.th * PI) / 180;
      const corrected = t * (1 + (r * r) / 16 + (11 * r ** 4) / 3072);
      rows.push({ label: `Corrected for ${trim(n.th, 3)}°`, value: `${trim(corrected, 6)} s` });
      rows.push({ label: "Error in small-angle model", value: `${trim(((corrected - t) / t) * 100, 3)}%` });
    }
    return { name: "Period", value: `${trim(t, 6)} s`, rows };
  },
  Article: () => (
    <>
      <p>
        For small swings, a pendulum&rsquo;s period depends only on its length and the local
        strength of gravity. The mass of the bob does not appear, and neither does the
        amplitude.
      </p>
      <Formula>T = 2π √(L / g)</Formula>
      <p>
        This independence from amplitude is called isochronism, and it is what made the
        pendulum the basis of accurate timekeeping for nearly three hundred years. A pendulum
        clock keeps time even as the swing decays.
      </p>
      <h2>The small-angle approximation</h2>
      <p>
        The formula comes from replacing sin θ with θ, which is accurate to better than 0.1%
        below about 5°. Beyond that the real period is longer, and the error grows with the
        square of the amplitude — roughly 0.2% at 10°, 1.7% at 30°, and 18% at 90°. The
        calculator shows the corrected value using the standard series expansion.
      </p>
      <h2>Length dominates, but as a square root</h2>
      <p>
        To double the period you need four times the length. A pendulum beating exactly one
        second per swing is about 0.994 m long, which is why grandfather clocks are the height
        they are.
      </p>
      <h2>Measuring g with a piece of string</h2>
      <p>
        Rearranged, g = 4π²L / T². Time fifty swings rather than one and divide, so that your
        reaction-time error is spread across all of them. Done carefully this gives g to
        within a fraction of a percent, and it remains one of the cleanest experiments in an
        introductory lab.
      </p>
    </>
  ),
});

export const waveSpeed = makeTool({
  slug: "wave-speed",
  category: "physics",
  group: "Waves and optics",
  title: "Wave speed, frequency and wavelength calculator",
  label: "Wave equation",
  description:
    "Relate wave speed, frequency and wavelength, with period and wavenumber, for sound, light or any other wave.",
  keywords: ["wave speed", "wavelength", "frequency", "v=fλ", "period"],
  columns: 3,
  inputs: [
    { key: "v", label: "Wave speed", unit: "m/s", initial: "343", hint: "Sound in air 343, light 3e8" },
    { key: "f", label: "Frequency", unit: "Hz", initial: "440" },
    { key: "lam", label: "Wavelength", unit: "m", initial: "", optional: true },
  ],
  compute: ({ n }) => {
    let v = n.v, f = n.f, lam = n.lam;
    if (Number.isFinite(v) && Number.isFinite(f)) lam = v / f;
    else if (Number.isFinite(v) && Number.isFinite(lam)) f = v / lam;
    else if (Number.isFinite(f) && Number.isFinite(lam)) v = f * lam;
    else return null;
    if (!Number.isFinite(lam) || !Number.isFinite(f)) return null;
    return {
      name: "Wavelength",
      value: si(lam, "m"),
      rows: [
        { label: "Frequency", value: si(f, "Hz") },
        { label: "Speed", value: si(v, "m/s") },
        { label: "Period", value: si(1 / f, "s") },
        { label: "Wavenumber", value: `${trim((2 * PI) / lam, 5)} rad/m` },
        { label: "Quarter wavelength", value: si(lam / 4, "m") },
      ],
    };
  },
  Article: () => (
    <>
      <p>
        Every wave obeys the same relationship between how fast it travels, how often it
        oscillates and how long each cycle is in space. It follows directly from the
        definitions: in one period the wave advances exactly one wavelength.
      </p>
      <Formula>v = f λ&nbsp;&nbsp;&nbsp;λ = v / f&nbsp;&nbsp;&nbsp;T = 1 / f</Formula>
      <h2>Speed is set by the medium, not the source</h2>
      <p>
        This is the point students most often miss. Sound travels at about 343 m/s in air at
        20 °C whatever note you play; light travels at 3.00 × 10⁸ m/s in a vacuum whatever its
        colour. When a wave crosses into a different medium its speed changes and its
        wavelength changes with it — but its frequency does not, because the source is still
        oscillating at the same rate. Frequency is the property that survives refraction, which
        is why a sound is the same pitch underwater.
      </p>
      <h2>Some reference speeds</h2>
      <table>
        <thead><tr><th>Medium</th><th>Wave</th><th>Speed</th></tr></thead>
        <tbody>
          <tr><td>Air at 20 °C</td><td>Sound</td><td>343 m/s</td></tr>
          <tr><td>Water</td><td>Sound</td><td>1480 m/s</td></tr>
          <tr><td>Steel</td><td>Sound</td><td>≈5900 m/s</td></tr>
          <tr><td>Vacuum</td><td>Light</td><td>2.998 × 10⁸ m/s</td></tr>
          <tr><td>Glass (n ≈ 1.5)</td><td>Light</td><td>≈2.0 × 10⁸ m/s</td></tr>
        </tbody>
      </table>
      <h2>Why quarter wavelengths keep appearing</h2>
      <p>
        Antennas, organ pipes and acoustic treatment all key off fractions of a wavelength,
        because that is where standing-wave nodes and antinodes fall. A quarter-wave antenna
        for 2.4 GHz Wi-Fi is about 31 mm long, which is why the antenna in your router is the
        size it is.
      </p>
    </>
  ),
});

export const lensEquation = makeTool({
  slug: "lens-equation",
  category: "physics",
  group: "Waves and optics",
  title: "Thin lens equation calculator",
  label: "Thin lens",
  description:
    "Find image distance, magnification and image type for a thin lens or mirror from the object distance and focal length.",
  keywords: ["thin lens", "focal length", "magnification", "image distance", "optics"],
  columns: 3,
  inputs: [
    { key: "f", label: "Focal length", unit: "m", initial: "0.05", hint: "Negative for a diverging lens." },
    { key: "do", label: "Object distance", unit: "m", initial: "0.15" },
    { key: "ho", label: "Object height", unit: "m", initial: "", optional: true },
  ],
  compute: ({ n }) => {
    if (!Number.isFinite(n.f) || !Number.isFinite(n.do) || n.f === 0) return null;
    if (Math.abs(n.do - n.f) < 1e-12) {
      return { name: "Image distance", value: "at infinity", rows: [{ label: "Object is at the focal point", value: "rays emerge parallel" }] };
    }
    const di = 1 / (1 / n.f - 1 / n.do);
    const m = -di / n.do;
    const rows = [
      { label: "Magnification", value: `${trim(m, 5)} ×` },
      { label: "Image orientation", value: m < 0 ? "inverted" : "upright" },
      { label: "Image type", value: di > 0 ? "real" : "virtual" },
      { label: "Relative size", value: Math.abs(m) > 1 ? "enlarged" : Math.abs(m) < 1 ? "reduced" : "same size" },
    ];
    if (n.ho > 0) rows.push({ label: "Image height", value: si(m * n.ho, "m") });
    return { name: "Image distance", value: si(di, "m"), rows };
  },
  Article: () => (
    <>
      <p>
        The thin lens equation ties together where an object sits, where its image forms, and
        the focal length of the lens. The same equation describes curved mirrors, with the sign
        conventions adjusted.
      </p>
      <Formula>1/f = 1/dₒ + 1/dᵢ&nbsp;&nbsp;&nbsp;m = −dᵢ / dₒ</Formula>
      <h2>Sign conventions</h2>
      <p>
        Almost every mistake here is a sign error. Using the standard convention: focal length
        is positive for a converging lens and negative for a diverging one. Image distance is
        positive when the image forms on the far side of the lens, which makes it real and
        projectable onto a screen; negative when it forms on the same side as the object, which
        makes it virtual. Negative magnification means the image is inverted.
      </p>
      <h2>The five cases for a converging lens</h2>
      <ul>
        <li><strong>Beyond 2f:</strong> real, inverted, reduced. This is a camera.</li>
        <li><strong>At 2f:</strong> real, inverted, same size.</li>
        <li><strong>Between f and 2f:</strong> real, inverted, enlarged. This is a projector.</li>
        <li><strong>At f:</strong> no image; rays leave parallel. This is a collimator.</li>
        <li><strong>Inside f:</strong> virtual, upright, enlarged. This is a magnifying glass.</li>
      </ul>
      <h2>What &ldquo;thin&rdquo; leaves out</h2>
      <p>
        The model assumes the lens has negligible thickness and that rays stay close to the
        axis. Real lenses suffer spherical aberration, where edge rays focus at a different
        point from central ones, and chromatic aberration, where different colours focus
        differently because the refractive index varies with wavelength. Camera lenses use
        several elements of different glasses precisely to cancel these effects.
      </p>
    </>
  ),
});

export const escapeVelocity = makeTool({
  slug: "escape-velocity",
  category: "physics",
  group: "Thermal and modern",
  title: "Orbital and escape velocity calculator",
  label: "Escape velocity",
  description:
    "Compute escape velocity, circular orbital speed and orbital period for any body from its mass and radius.",
  keywords: ["escape velocity", "orbital velocity", "orbit", "gravity", "period"],
  columns: 3,
  inputs: [
    { key: "m", label: "Body mass", unit: "kg", initial: "5.972e24", hint: "Earth 5.972e24" },
    { key: "r", label: "Radius from centre", unit: "m", initial: "6.371e6" },
    { key: "alt", label: "Altitude above surface", unit: "m", initial: "0", optional: true },
  ],
  compute: ({ n }) => {
    const G = 6.6743e-11;
    const r = n.r + (Number.isFinite(n.alt) ? n.alt : 0);
    if (!(n.m > 0) || !(r > 0)) return null;
    const ve = Math.sqrt((2 * G * n.m) / r);
    const vo = Math.sqrt((G * n.m) / r);
    const t = (2 * PI * r) / vo;
    return {
      name: "Escape velocity",
      value: `${trim(ve / 1000, 5)} km/s`,
      rows: [
        { label: "Circular orbital speed", value: `${trim(vo / 1000, 5)} km/s` },
        { label: "Orbital period", value: `${trim(t / 60, 5)} minutes` },
        { label: "Surface gravity at this radius", value: `${trim((G * n.m) / (r * r), 5)} m/s²` },
        { label: "Escape / orbital ratio", value: `${trim(Math.SQRT2, 4)} (always √2)` },
      ],
    };
  },
  Article: () => (
    <>
      <p>
        Escape velocity is the speed at which an object&rsquo;s kinetic energy exactly equals
        the gravitational potential energy binding it to a body. Launch faster than that,
        ignoring drag, and it never comes back.
      </p>
      <Formula>v_escape = √(2GM / r)&nbsp;&nbsp;&nbsp;v_orbit = √(GM / r)</Formula>
      <p>
        Notice that mass of the escaping object cancels out. A pebble and a spacecraft need the
        same speed. What differs is the energy required to get there, which is why rockets are
        large.
      </p>
      <h2>Escape speed is always √2 times orbital speed</h2>
      <p>
        The two formulas differ only by a factor of two under the root. Circular orbit around
        Earth&rsquo;s surface would need about 7.9 km/s; escaping needs 11.2 km/s. That fixed
        ratio holds for every body in the universe.
      </p>
      <h2>Direction does not matter, drag does</h2>
      <p>
        Escape velocity is a scalar. Fired at any upward angle, an object at that speed will
        leave. This is only true because the derivation is purely energetic and ignores the
        atmosphere. In reality no rocket travels at escape velocity near the ground — it would
        burn up — so launches accelerate gradually as the air thins, and the concept is used as
        an energy budget rather than a literal speed.
      </p>
      <h2>Some figures</h2>
      <table>
        <thead><tr><th>Body</th><th>Escape velocity</th></tr></thead>
        <tbody>
          <tr><td>Moon</td><td>2.38 km/s</td></tr>
          <tr><td>Mars</td><td>5.03 km/s</td></tr>
          <tr><td>Earth</td><td>11.19 km/s</td></tr>
          <tr><td>Jupiter</td><td>59.5 km/s</td></tr>
          <tr><td>Sun</td><td>617.5 km/s</td></tr>
        </tbody>
      </table>
      <p>
        A body whose escape velocity would exceed the speed of light is a black hole, and
        setting v = c in this formula gives the Schwarzschild radius — which is, remarkably,
        the correct answer despite the derivation being entirely Newtonian.
      </p>
    </>
  ),
});

export const density = makeTool({
  slug: "density",
  category: "physics",
  group: "Mechanics",
  title: "Density, mass and volume calculator",
  label: "Density",
  description:
    "Convert between density, mass and volume, with buoyancy in water and specific gravity included.",
  keywords: ["density", "mass", "volume", "specific gravity", "buoyancy"],
  columns: 3,
  inputs: [
    { key: "m", label: "Mass", unit: "kg", initial: "2.7" },
    { key: "v", label: "Volume", unit: "m³", initial: "0.001" },
    { key: "fluid", label: "Fluid density", unit: "kg/m³", initial: "1000", optional: true },
  ],
  compute: ({ n }) => {
    if (!(n.m > 0) || !(n.v > 0)) return null;
    const d = n.m / n.v;
    const rows = [
      { label: "In g/cm³", value: `${trim(d / 1000, 5)}` },
      { label: "Specific gravity (vs water)", value: `${trim(d / 1000, 5)}` },
    ];
    if (n.fluid > 0) {
      const buoy = n.fluid * n.v * 9.80665;
      rows.push({ label: "Buoyant force in that fluid", value: `${trim(buoy, 5)} N` });
      rows.push({ label: "Behaviour", value: d > n.fluid ? "sinks" : d < n.fluid ? "floats" : "neutrally buoyant" });
      if (d < n.fluid) rows.push({ label: "Fraction submerged", value: `${trim((d / n.fluid) * 100, 4)}%` });
    }
    return { name: "Density", value: `${trim(d, 5)} kg/m³`, rows };
  },
  Article: () => (
    <>
      <p>
        Density is mass per unit volume — how much matter is packed into a given space. It is
        an intensive property, meaning it does not depend on how much of the substance you
        have. A gram of aluminium and a tonne of it have the same density.
      </p>
      <Formula>ρ = m / V&nbsp;&nbsp;&nbsp;m = ρ V&nbsp;&nbsp;&nbsp;V = m / ρ</Formula>
      <h2>Units and the convenient accident</h2>
      <p>
        The SI unit is kg/m³, but g/cm³ is used constantly because water is almost exactly
        1.000 g/cm³ at 4 °C. That makes specific gravity — density relative to water — the same
        number, which is why the two get used interchangeably.
      </p>
      <h2>Floating and Archimedes</h2>
      <p>
        An object immersed in a fluid experiences an upward force equal to the weight of the
        fluid it displaces. Whether it floats therefore comes down to a comparison of
        densities. Ice at 917 kg/m³ floats in water at 1000 kg/m³, with 91.7% of its volume
        submerged — which is the origin of the iceberg cliché, and it is very nearly correct.
      </p>
      <p>
        A steel ship floats because the relevant density is that of the whole hull including
        the air inside it, not of the steel. Change that average and the ship sinks.
      </p>
      <h2>Common densities</h2>
      <table>
        <thead><tr><th>Material</th><th>kg/m³</th></tr></thead>
        <tbody>
          <tr><td>Air (sea level)</td><td>1.2</td></tr>
          <tr><td>Balsa</td><td>160</td></tr>
          <tr><td>Ice</td><td>917</td></tr>
          <tr><td>Water</td><td>1000</td></tr>
          <tr><td>Aluminium</td><td>2700</td></tr>
          <tr><td>Steel</td><td>7850</td></tr>
          <tr><td>Lead</td><td>11340</td></tr>
          <tr><td>Gold</td><td>19300</td></tr>
        </tbody>
      </table>
    </>
  ),
});
