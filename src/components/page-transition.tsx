"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, type ReactNode } from "react";

// A short fade and 6px rise on the page content after a client navigation. The header and footer sit outside this
// wrapper, so they never move. The server HTML is never hidden: nothing animates on the first load, and the animation
// is a Web Animations API call (no class with opacity:0 waiting on JS). Reduced motion: no animation at all.
const KEYFRAMES: Keyframe[] = [
  { opacity: 0, transform: "translate3d(0, 6px, 0)" },
  { opacity: 1, transform: "translate3d(0, 0, 0)" },
];
const TIMING: KeyframeAnimationOptions = { duration: 220, easing: "cubic-bezier(0.16, 1, 0.3, 1)" };

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const previousPath = useRef(pathname);

  // Layout effect: runs after React commits the new page and before the browser paints it, so there is no flash.
  useLayoutEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    const el = ref.current;
    if (!el || typeof el.animate !== "function") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const animation = el.animate(KEYFRAMES, TIMING);
    return () => animation.cancel();
  }, [pathname]);

  return (
    <div ref={ref} className="flex w-full flex-col">
      {children}
    </div>
  );
}
