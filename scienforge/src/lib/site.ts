export const SITE = {
  name: "ScienForge",
  tagline: "Calculators and reference for physics, electronics and chemistry",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://scienforge.com",
  // Blank until AdSense approves the domain. Set in Vercel env vars.
  adsenseClient: process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "",
};

export const adsEnabled = Boolean(SITE.adsenseClient);
