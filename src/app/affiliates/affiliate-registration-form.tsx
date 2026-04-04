"use client";

import { useEffect, useMemo, useState } from "react";
import * as yup from "yup";
import { Copy, Link2, Loader, MessageSquare, Share2 } from "lucide-react";

import { Button } from "components/ui/button";
import { useToast } from "components/ui/use-toast";
import {
  AFFILIATE_PROFILE_STORAGE_KEY,
  buildAffiliateLink,
  buildAffiliateShareMessage,
  type AffiliateLocalProfile,
} from "lib/affiliates";

type FormState = {
  name: string;
  email: string;
};

const DEFAULT_FORM_STATE: FormState = {
  name: "",
  email: "",
};

function getSmsHref(message: string) {
  return `sms:?&body=${encodeURIComponent(message)}`;
}

export default function AffiliateRegistrationForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);
  const [affiliateProfile, setAffiliateProfile] = useState<AffiliateLocalProfile | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const raw = window.localStorage.getItem(AFFILIATE_PROFILE_STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as AffiliateLocalProfile;
      if (!parsed?.affiliateCode || !parsed?.affiliateName || !parsed?.affiliateId || !parsed?.email) return;
      setAffiliateProfile(parsed);
    } catch {
      window.localStorage.removeItem(AFFILIATE_PROFILE_STORAGE_KEY);
    }
  }, []);

  const referralUrl = useMemo(() => {
    if (!affiliateProfile || typeof window === "undefined") return "";
    return buildAffiliateLink(`${window.location.origin}/`, affiliateProfile.affiliateCode);
  }, [affiliateProfile]);

  const shareMessage = useMemo(() => {
    if (!referralUrl) return "";
    return buildAffiliateShareMessage(referralUrl);
  }, [referralUrl]);

  const inputClassName =
    "mt-2 w-full rounded-xl border border-base-300 bg-base-100 px-4 py-3 text-base text-base-content shadow-sm transition-colors placeholder:text-base-content/35 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10";

  const handleCopy = async (value: string, label: string) => {
    if (!value || typeof window === "undefined") return;

    try {
      await navigator.clipboard.writeText(value);
      toast({ title: `${label} copied` });
    } catch {
      toast({ title: "Unable to copy right now.", variant: "destructive" });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const schema = yup.object({
      name: yup.string().required(),
      email: yup.string().email().required(),
    });

    try {
      await schema.validate(formState, { abortEarly: false });
      const response = await fetch("/api/affiliates/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });
      const body = await response.json();

      if (!response.ok) {
        toast({ title: body.error || "Something went wrong. Please try again later.", variant: "destructive" });
        return;
      }

      const nextProfile = body.affiliate as AffiliateLocalProfile;
      setAffiliateProfile(nextProfile);
      setFormState(DEFAULT_FORM_STATE);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(AFFILIATE_PROFILE_STORAGE_KEY, JSON.stringify(nextProfile));
      }

      toast({ title: body.created ? "Your referral link is ready." : "Welcome back. Your link is ready." });
    } catch (error) {
      toast({
        title: error instanceof Error ? error.message : "Please check the form and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (affiliateProfile) {
    return (
      <div className="rounded-[1.75rem] border border-base-300 bg-base-100 px-6 py-8 shadow-sm sm:px-8 sm:py-10 md:px-10">
        <p className="text-sm uppercase tracking-[0.18em] text-base-content/60">Your referral tools</p>
        <h3 className="mt-3 text-2xl font-light text-base-content">Your link is live.</h3>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-base-content/75">
          Your code is <span className="font-medium text-base-content">{affiliateProfile.affiliateCode}</span>. Start
          with your homepage link below, then use the Share With Your Friends utility in the footer to generate links
          for any page on the site.
        </p>

        <div className="mt-6 rounded-2xl border border-base-300 bg-base-200/60 p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-base-content/55">Default referral link</p>
          <p className="mt-2 break-all text-sm leading-6 text-base-content/80">{referralUrl}</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={() => handleCopy(referralUrl, "Referral link")}>
            <Link2 className="mr-2 h-4 w-4" />
            Copy Link
          </Button>
          <Button variant="secondary" onClick={() => handleCopy(shareMessage, "Text message")}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Text
          </Button>
          <Button variant="secondary" asChild>
            <a href={getSmsHref(shareMessage)}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Text It Now
            </a>
          </Button>
        </div>

        <div className="mt-6 flex items-start gap-2 text-sm leading-6 text-base-content/60">
          <Share2 className="mt-1 h-4 w-4 shrink-0" />
          We provide the link, the guide, and copy-ready text. You just send people to the site.
        </div>
      </div>
    );
  }

  return (
    <form
      className="rounded-[1.75rem] border border-base-300 bg-base-100 px-6 py-6 shadow-sm sm:px-8 sm:py-8 md:px-10 md:py-10"
      onSubmit={handleSubmit}
    >
      <div className="border-b border-base-300 pb-6">
        <p className="text-sm uppercase tracking-[0.18em] text-base-content/60">Get your referral link</p>
        <p className="mt-3 max-w-2xl text-base text-base-content/70">
          Enter your full name and email once. We&apos;ll generate your affiliate code instantly so you can start
          sharing right away.
        </p>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-base-content" htmlFor="name">
            Full name
          </label>
          <input
            className={inputClassName}
            id="name"
            name="name"
            value={formState.name}
            onChange={handleChange}
            placeholder="Your full name"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-base-content" htmlFor="email">
            Email
          </label>
          <input
            className={inputClassName}
            id="email"
            name="email"
            type="email"
            value={formState.email}
            onChange={handleChange}
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 border-t border-base-300 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-base-content/60">
          You&apos;ll get a code instantly, plus a homepage link and copy-ready text you can use right away.
        </p>
        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? (
            <>
              <Loader className="mr-2 size-4 animate-spin" /> Creating...
            </>
          ) : (
            "Get My Referral Link"
          )}
        </Button>
      </div>
    </form>
  );
}
