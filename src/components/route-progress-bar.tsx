"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const INITIAL_PROGRESS = 0.08;
const MAX_PROGRESS = 0.9;
const ADVANCE_INTERVAL_MS = 160;
const COMPLETE_DELAY_MS = 180;
const RESET_DELAY_MS = 220;

function canStartNavigation(event: MouseEvent) {
  return !event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

function getNavigationTarget(event: MouseEvent) {
  const target = event.target;

  if (!(target instanceof Element)) {
    return null;
  }

  const anchor = target.closest("a");

  if (!(anchor instanceof HTMLAnchorElement)) {
    return null;
  }

  if (anchor.target && anchor.target !== "_self") {
    return null;
  }

  if (anchor.hasAttribute("download") || anchor.getAttribute("rel")?.includes("external")) {
    return null;
  }

  const href = anchor.getAttribute("href");

  if (!href || href.startsWith("#")) {
    return null;
  }

  const url = new URL(anchor.href, window.location.href);

  if (url.origin !== window.location.origin) {
    return null;
  }

  if (url.pathname === window.location.pathname && url.search === window.location.search) {
    return null;
  }

  return url.href;
}

export default function RouteProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const completeTimeoutRef = useRef<number | null>(null);
  const resetTimeoutRef = useRef<number | null>(null);
  const isInitialRenderRef = useRef(true);
  const isNavigatingRef = useRef(false);
  const startNavigationRef = useRef<() => void>(() => undefined);
  const completeNavigationRef = useRef<() => void>(() => undefined);
  const routeKey = `${pathname}?${searchParams.toString()}`;

  startNavigationRef.current = () => {
    isNavigatingRef.current = true;

    if (completeTimeoutRef.current) {
      window.clearTimeout(completeTimeoutRef.current);
      completeTimeoutRef.current = null;
    }

    if (resetTimeoutRef.current) {
      window.clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = null;
    }

    setIsVisible(true);
    setProgress((currentProgress) => (currentProgress > INITIAL_PROGRESS ? currentProgress : INITIAL_PROGRESS));

    if (intervalRef.current) {
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setProgress((currentProgress) => {
        if (currentProgress >= MAX_PROGRESS) {
          return currentProgress;
        }

        const remaining = MAX_PROGRESS - currentProgress;
        return Math.min(MAX_PROGRESS, currentProgress + Math.max(remaining * 0.18, 0.03));
      });
    }, ADVANCE_INTERVAL_MS);
  };

  completeNavigationRef.current = () => {
    isNavigatingRef.current = false;

    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (completeTimeoutRef.current) {
      window.clearTimeout(completeTimeoutRef.current);
    }

    if (resetTimeoutRef.current) {
      window.clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = null;
    }

    setProgress(1);

    completeTimeoutRef.current = window.setTimeout(() => {
      setIsVisible(false);
      resetTimeoutRef.current = window.setTimeout(() => {
        setProgress(0);
      }, RESET_DELAY_MS);
    }, COMPLETE_DELAY_MS);
  };

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (!canStartNavigation(event)) {
        return;
      }

      if (!getNavigationTarget(event)) {
        return;
      }

      startNavigationRef.current();
    };

    const handlePopState = () => {
      startNavigationRef.current();
    };

    document.addEventListener("click", handleDocumentClick);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
      window.removeEventListener("popstate", handlePopState);

      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }

      if (completeTimeoutRef.current) {
        window.clearTimeout(completeTimeoutRef.current);
      }

      if (resetTimeoutRef.current) {
        window.clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isInitialRenderRef.current) {
      isInitialRenderRef.current = false;
      return;
    }

    if (!isNavigatingRef.current) {
      return;
    }

    completeNavigationRef.current();
  }, [routeKey]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[9999] h-[2px] origin-left bg-primary transition-[opacity,transform] duration-200 ease-out"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: `scaleX(${progress})`,
      }}
    />
  );
}
