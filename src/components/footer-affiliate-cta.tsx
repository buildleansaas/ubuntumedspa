"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Copy, Link2, MessageSquare, Share2 } from "lucide-react";

import { Button } from "components/ui/button";
import { useToast } from "components/ui/use-toast";
import useAffiliateLocalProfile from "hooks/use-affiliate-local-profile";
import { buildAffiliateLink, buildAffiliateShareMessage } from "lib/affiliates";

function getSmsHref(message: string) {
  return `sms:?&body=${encodeURIComponent(message)}`;
}

export default function FooterAffiliateCta() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchString = searchParams.toString();
  const { toast } = useToast();
  const affiliateProfile = useAffiliateLocalProfile();

  const currentShareUrl = useMemo(() => {
    if (!affiliateProfile || typeof window === "undefined") return "";

    const relative = `${pathname}${searchString ? `?${searchString}` : ""}`;
    const absolute = new URL(relative, window.location.origin).toString();
    return buildAffiliateLink(absolute, affiliateProfile.affiliateCode);
  }, [affiliateProfile, pathname, searchString]);

  const currentShareText = useMemo(
    () => (currentShareUrl ? buildAffiliateShareMessage(currentShareUrl) : ""),
    [currentShareUrl]
  );

  const handleCopy = async (value: string, label: string) => {
    if (!value || typeof window === "undefined") return;

    try {
      await navigator.clipboard.writeText(value);
      toast({ title: `${label} copied` });
    } catch {
      toast({ title: "Unable to copy right now.", variant: "destructive" });
    }
  };

  if (!affiliateProfile) {
    return (
      <div className="mx-auto max-w-4xl rounded-xl border border-base-300 bg-base-100 px-4 py-4 md:px-6 md:py-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="text-left">
            <p className="text-[11px] uppercase tracking-[0.2em] text-base-content/55">Share With Your Friends</p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-base-content/75">
              Want your own referral link? Enter your name and email once, then use the whole site as shareable
              marketing material.
            </p>
          </div>
          <Button asChild variant="secondary" className="w-full md:w-auto">
            <Link href="/affiliates">Get Your Referral Link</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl rounded-xl border border-base-300 bg-base-100 px-4 py-4 md:px-6 md:py-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="text-left">
          <p className="text-[11px] uppercase tracking-[0.2em] text-base-content/55">Share With Your Friends</p>
          <p className="mt-2 text-sm leading-6 text-base-content/75">
            Your code is <span className="font-medium text-base-content">{affiliateProfile.affiliateCode}</span>. Use
            this page or any page on the site as your referral link.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={() => handleCopy(currentShareUrl, "Referral link")}>
            <Link2 className="mr-2 h-4 w-4" />
            Copy Link
          </Button>
          <Button variant="secondary" size="sm" onClick={() => handleCopy(currentShareText, "Text message")}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Text
          </Button>
          <Button size="sm" asChild>
            <a href={getSmsHref(currentShareText)}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Text This Page
            </a>
          </Button>
        </div>
      </div>
      <div className="mt-3 flex items-start gap-2 text-xs leading-5 text-base-content/55">
        <Share2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        The link above automatically points to this page with your referral code attached.
      </div>
    </div>
  );
}
