"use client";

import { useEffect, useMemo, useState } from "react";
import * as yup from "yup";
import { Copy, Link2, Loader, MessageSquare, Share2 } from "lucide-react";

import { Button } from "components/ui/button";
import { useToast } from "components/ui/use-toast";
import useAffiliateLocalProfile from "hooks/use-affiliate-local-profile";
import {
  AFFILIATE_CODE_MAX_LENGTH,
  AFFILIATE_CODE_MIN_LENGTH,
  buildAffiliateLink,
  buildAffiliateShareMessage,
  isAffiliateCodeLengthValid,
  normalizeAffiliateCode,
  writeAffiliateLocalProfile,
} from "lib/affiliates";
import { cn } from "lib/utils";

type FormState = {
  name: string;
  email: string;
};

const DEFAULT_FORM_STATE: FormState = {
  name: "",
  email: "",
};

interface AffiliateRegistrationFormProps {
  variant?: "standalone" | "embedded";
}

function getSmsHref(message: string) {
  return `sms:?&body=${encodeURIComponent(message)}`;
}

export default function AffiliateRegistrationForm({
  variant = "standalone",
}: AffiliateRegistrationFormProps) {
  const { toast } = useToast();
  const affiliateProfile = useAffiliateLocalProfile();
  const [loading, setLoading] = useState(false);
  const [savingAffiliateCode, setSavingAffiliateCode] = useState(false);
  const [affiliateCodeError, setAffiliateCodeError] = useState<string | null>(null);
  const [editableAffiliateCode, setEditableAffiliateCode] = useState("");
  const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);
  const isEmbedded = variant === "embedded";

  useEffect(() => {
    setEditableAffiliateCode(affiliateProfile?.affiliateCode || "");
    setAffiliateCodeError(null);
  }, [affiliateProfile?.affiliateCode]);

  const referralUrl = useMemo(() => {
    if (!affiliateProfile || typeof window === "undefined") return "";
    return buildAffiliateLink(`${window.location.origin}/`, affiliateProfile.affiliateCode);
  }, [affiliateProfile]);

  const shareMessage = useMemo(() => {
    if (!referralUrl) return "";
    return buildAffiliateShareMessage(referralUrl);
  }, [referralUrl]);

  const normalizedEditableAffiliateCode = normalizeAffiliateCode(editableAffiliateCode);
  const hasAffiliateCodeChanged = Boolean(
    affiliateProfile && normalizedEditableAffiliateCode && normalizedEditableAffiliateCode !== affiliateProfile.affiliateCode
  );

  const inputClassName = cn(
    "mt-2 w-full rounded-xl border border-base-300 bg-base-100 px-4 py-3 text-base text-base-content transition-colors placeholder:text-base-content/35 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10",
    !isEmbedded && "shadow-sm"
  );

  const affiliateCodeInputClassName =
    "mt-3 w-full rounded-[1.35rem] border border-base-300 bg-base-100 px-5 py-4 text-xl tracking-tight text-base-content shadow-sm transition-colors placeholder:text-base-content/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 sm:text-2xl";

  const shellClassName =
    "rounded-[1.75rem] border border-base-300 bg-base-100 px-6 py-6 shadow-sm sm:px-8 sm:py-8 md:px-10 md:py-10";

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

      const nextProfile = body.affiliate;
      setFormState(DEFAULT_FORM_STATE);
      writeAffiliateLocalProfile(nextProfile);
      toast({
        title: body.recovered || !body.created ? "We found your existing affiliate link." : "Your referral link is ready.",
      });
    } catch (error) {
      toast({
        title: error instanceof Error ? error.message : "Please check the form and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAffiliateCodeSave = async () => {
    if (!affiliateProfile) return;

    const nextAffiliateCode = normalizeAffiliateCode(editableAffiliateCode);

    if (!nextAffiliateCode) {
      const errorMessage = "Referral code is required.";
      setAffiliateCodeError(errorMessage);
      toast({ title: errorMessage, variant: "destructive" });
      return;
    }

    if (!isAffiliateCodeLengthValid(nextAffiliateCode)) {
      const errorMessage = `Referral code must be between ${AFFILIATE_CODE_MIN_LENGTH} and ${AFFILIATE_CODE_MAX_LENGTH} characters.`;
      setAffiliateCodeError(errorMessage);
      toast({ title: errorMessage, variant: "destructive" });
      return;
    }

    setSavingAffiliateCode(true);
    setAffiliateCodeError(null);

    try {
      const response = await fetch("/api/affiliates/code", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: affiliateProfile.email,
          affiliateCode: nextAffiliateCode,
        }),
      });
      const body = await response.json();

      if (!response.ok) {
        const errorMessage = body.error || "Unable to update referral code.";
        setAffiliateCodeError(errorMessage);
        toast({ title: errorMessage, variant: "destructive" });
        return;
      }

      writeAffiliateLocalProfile(body.affiliate);
      setAffiliateCodeError(null);
      toast({ title: body.updated ? "Referral code updated." : "Referral code already up to date." });
    } catch {
      const errorMessage = "Unable to update referral code.";
      setAffiliateCodeError(errorMessage);
      toast({ title: errorMessage, variant: "destructive" });
    } finally {
      setSavingAffiliateCode(false);
    }
  };

  if (affiliateProfile) {
    return (
      <div className={cn(shellClassName, "w-full")}>
        <p className="text-sm uppercase tracking-[0.18em] text-base-content/60">Your referral tools</p>
        <h3 className="mt-3 text-2xl font-light text-base-content">Your link is live.</h3>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-base-content/75">
          We found the affiliate tied to <span className="font-medium text-base-content">{affiliateProfile.email}</span>.
          Update your code below any time, and old links you&apos;ve already shared will keep working.
        </p>

        <div className="mt-6 rounded-[1.5rem] border border-base-300 bg-base-200/55 p-5 sm:p-6">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.18em] text-base-content/55">Edit referral code</p>
            <h4 className="mt-2 text-xl font-light tracking-tight text-base-content sm:text-2xl">
              Make your link easier to remember.
            </h4>
            <p className="mt-2 text-sm leading-6 text-base-content/65 sm:text-base">
              Pick the version you want people to type or copy. Old links you&apos;ve already shared will still work.
            </p>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold text-base-content" htmlFor="affiliate-code">
              Referral code
            </label>
            <input
              className={affiliateCodeInputClassName}
              id="affiliate-code"
              name="affiliate-code"
              value={editableAffiliateCode}
              onChange={(event) => setEditableAffiliateCode(event.target.value)}
              placeholder="your-referral-code"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
            />
            <p className="mt-3 text-sm leading-6 text-base-content/60">
              Use lowercase letters, numbers, and hyphens. Any older links tied to you will keep routing correctly.
            </p>
            {affiliateCodeError ? <p className="mt-2 text-sm text-error">{affiliateCodeError}</p> : null}
          </div>

          <div className="mt-5 flex flex-col gap-3 border-t border-base-300/80 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-6 text-base-content/60">
              Your referral URL and share tools update as soon as you save.
            </p>

            <Button
              type="button"
              onClick={handleAffiliateCodeSave}
              disabled={!hasAffiliateCodeChanged || savingAffiliateCode}
              className="w-full sm:w-auto"
            >
              {savingAffiliateCode ? (
                <>
                  <Loader className="mr-2 size-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Code"
              )}
            </Button>
          </div>
        </div>

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
    <form className={cn(shellClassName, "w-full")} onSubmit={handleSubmit}>
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
        <Button type="submit" disabled={loading} className="w-full md:w-auto">
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
