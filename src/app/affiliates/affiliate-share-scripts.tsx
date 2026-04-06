"use client";

import { useMemo } from "react";
import { Copy } from "lucide-react";

import { Button } from "components/ui/button";
import { useToast } from "components/ui/use-toast";
import useAffiliateLocalProfile from "hooks/use-affiliate-local-profile";
import { buildAffiliateLink } from "lib/affiliates";

const FALLBACK_HOME_URL = "https://www.williamsburgmedspa.com/";

const shareScripts = [
  {
    title: "Text message to a friend",
    note: "Best for warm, personal referrals.",
    message: (url: string) =>
      `Omg if you're thinking about Botox, filler, or PRP, go see Jenny at Williamsburg Med Spa, you'll love her: ${url}`,
  },
  {
    title: "DM reply when someone asks who you trust",
    note: "Best for one-to-one conversations.",
    message: (url: string) =>
      `Honestly I'd send you to Jenny at Williamsburg Med Spa, she's so gentle and you'll love her: ${url}`,
  },
  {
    title: "Instagram story or short caption",
    note: "Best for casual social promotion.",
    message: (url: string) =>
      `Omg if you want calm, natural aesthetic care, go to Williamsburg Med Spa, you'll be obsessed: ${url}`,
  },
] as const;

export default function AffiliateShareScripts() {
  const { toast } = useToast();
  const affiliateProfile = useAffiliateLocalProfile();

  const shareUrl = useMemo(() => {
    if (!affiliateProfile) return FALLBACK_HOME_URL;
    return buildAffiliateLink(FALLBACK_HOME_URL, affiliateProfile.affiliateCode);
  }, [affiliateProfile]);

  const handleCopy = async (value: string, label: string) => {
    if (typeof window === "undefined") return;

    try {
      await navigator.clipboard.writeText(value);
      toast({ title: `${label} copied` });
    } catch {
      toast({ title: "Unable to copy right now.", variant: "destructive" });
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
      {shareScripts.map((item) => {
        const message = item.message(shareUrl);

        return (
          <article key={item.title} className="border-t border-base-300 pt-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm uppercase tracking-[0.18em] text-base-content/60">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-base-content/60">{item.note}</p>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleCopy(message, item.title)}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
            </div>

            <p className="mt-5 text-base leading-relaxed text-base-content/80">{message}</p>
          </article>
        );
      })}
    </div>
  );
}
