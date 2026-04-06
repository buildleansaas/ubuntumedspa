"use client";

import Link from "next/link";
import { Copy, Link2, MessageSquare, Share2 } from "lucide-react";

import { Button } from "components/ui/button";
import { useToast } from "components/ui/use-toast";
import useAffiliateLocalProfile from "hooks/use-affiliate-local-profile";
import { buildAffiliateLink, buildAffiliateShareMessage } from "lib/affiliates";

function getSmsHref(message: string) {
  return `sms:?&body=${encodeURIComponent(message)}`;
}

export default function FooterAffiliateCta() {
  const { toast } = useToast();
  const affiliateProfile = useAffiliateLocalProfile();

  const handleCopy = async (value: string, label: string) => {
    if (!value || typeof window === "undefined") return;

    try {
      await navigator.clipboard.writeText(value);
      toast({ title: `${label} copied` });
    } catch {
      toast({ title: "Unable to copy right now.", variant: "destructive" });
    }
  };

  const getCurrentShareDetails = () => {
    if (!affiliateProfile || typeof window === "undefined") return null;

    const shareUrl = buildAffiliateLink(window.location.href, affiliateProfile.affiliateCode);
    return {
      shareUrl,
      shareText: buildAffiliateShareMessage(shareUrl),
    };
  };

  if (!affiliateProfile) {
    return (
      <section className="w-full text-left">
        <p className="text-[11px] uppercase tracking-[0.24em] text-base-content/60">Affiliate Program</p>
        <h3 className="mt-3 text-2xl/snug md:text-3xl/snug font-light tracking-tight text-base-content">
          Get your referral link and start sharing.
        </h3>
        <p className="mt-4 max-w-xl text-base md:text-lg leading-relaxed text-base-content/80">
          Enter your name and email once, then use the whole site as shareable marketing material with your code
          attached.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/affiliates">Get Your Referral Link</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full text-left">
      <p className="text-[11px] uppercase tracking-[0.24em] text-base-content/60">Share With Your Friends</p>
      <h3 className="mt-3 text-2xl/snug md:text-3xl/snug font-light tracking-tight text-base-content">
        Your referral tools are ready.
      </h3>
      <p className="mt-4 max-w-xl text-base md:text-lg leading-relaxed text-base-content/80">
        Your code is <span className="font-mono text-base-content">{affiliateProfile.affiliateCode}</span>. Use this
        page or any page on the site as your referral link.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            const details = getCurrentShareDetails();
            if (!details) return;
            void handleCopy(details.shareUrl, "Referral link");
          }}
        >
          <Link2 className="mr-2 h-4 w-4" />
          Copy Link
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            const details = getCurrentShareDetails();
            if (!details) return;
            void handleCopy(details.shareText, "Text message");
          }}
        >
          <Copy className="mr-2 h-4 w-4" />
          Copy Text
        </Button>
        <Button
          size="sm"
          onClick={() => {
            const details = getCurrentShareDetails();
            if (!details || typeof window === "undefined") return;
            window.location.href = getSmsHref(details.shareText);
          }}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Text This Page
        </Button>
      </div>

      <div className="mt-4 flex items-start gap-2 text-sm leading-6 text-base-content/60">
        <Share2 className="mt-1 h-4 w-4 shrink-0" />
        The link above automatically points to this page with your referral code attached.
      </div>
    </section>
  );
}
