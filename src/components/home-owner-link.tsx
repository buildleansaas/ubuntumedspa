import Link from "next/link";

// The homepage owns "med spa williamsburg va" (ScaleSleek finding f_majveah6ld, 2026-11-06).
// Pages that also showed up for that search link back to / with the exact words as the link text.
export const HOME_OWNER_ANCHOR = "med spa williamsburg va";

// Dynamic routes that render this link. Static pages import the component directly.
export const HOME_OWNER_LINK_PROCEDURES = new Set(["xeomin", "botox", "blomdahl-ear-piercing"]);
export const HOME_OWNER_LINK_POSTS = new Set([
  "kybella-alternatives-in-williamsburg-va",
  "coolsculpting-alternatives-in-williamsburg-va",
]);

export default function HomeOwnerLink({ className = "" }: { className?: string }) {
  return (
    <p className={`text-sm leading-6 text-base-content/70 ${className}`}>
      Our treatments, team, and booking options are all on our{" "}
      <Link href="/" className="font-medium text-primary hover:underline">
        {HOME_OWNER_ANCHOR}
      </Link>{" "}
      home page.
    </p>
  );
}
