import { Checkout } from "@polar-sh/nextjs";

// $9 "Big Dumb Energy" checkout. The Polar access token stays server-side
// (Vercel env var, never committed). The pricing button hits
// /api/checkout?products=<id>; Polar redirects to its hosted checkout, then to
// POLAR_SUCCESS_URL (the /success page) once payment completes.
// Polar needs an ABSOLUTE successUrl. POLAR_SUCCESS_URL overrides at deploy;
// the fallback is built from the site origin so it is always a valid URL.
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dumbometer.xyz";

export const GET = Checkout({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  successUrl:
    process.env.POLAR_SUCCESS_URL ?? `${SITE}/return?checkout_id={CHECKOUT_ID}`,
  server: (process.env.POLAR_SERVER as "sandbox" | "production") ?? "production",
});
