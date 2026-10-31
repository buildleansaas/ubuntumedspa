"use client";

import { useEffect } from "react";

const LEGACY_ID = "o-shot-callout";
const NEXT_ID = "oh-shot-callout";

export default function LegacyOhShotHash() {
  useEffect(() => {
    const sync = () => {
      if (window.location.hash !== `#${LEGACY_ID}`) return;
      const target = document.getElementById(NEXT_ID);
      if (!target) return;
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#${NEXT_ID}`);
      target.scrollIntoView({ block: "start" });
    };

    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  return null;
}
