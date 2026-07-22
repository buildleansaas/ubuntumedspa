"use client";

import type { ReactNode } from "react";

import { trackPhoneClick, type PhoneCtaLocation } from "lib/analytics";

type TrackedPhoneLinkProps = {
  children: ReactNode;
  className?: string;
  href: `tel:${string}`;
  location: PhoneCtaLocation;
};

export default function TrackedPhoneLink({ children, className, href, location }: TrackedPhoneLinkProps) {
  return (
    <a className={className} href={href} onClick={() => trackPhoneClick(location)}>
      {children}
    </a>
  );
}
