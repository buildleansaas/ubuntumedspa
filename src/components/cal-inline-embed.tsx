"use client";

import { useEffect, useMemo } from "react";

type Props = {
  calLink: string;
  namespace: string;
  name?: string;
  email?: string;
  phone?: string;
  metadata?: Record<string, string>;
};

declare global {
  interface Window {
    Cal?: any;
  }
}

const loadCalScript = () => {
  const scriptId = "wms-cal-embed-script";

  if (document.getElementById(scriptId)) return;

  const script = document.createElement("script");
  script.id = scriptId;
  script.async = true;
  script.src = "https://app.cal.com/embed/embed.js";
  document.head.appendChild(script);
};

export default function CalInlineEmbed({ calLink, namespace, name, email, phone, metadata }: Props) {
  const elementId = useMemo(() => `cal-inline-${namespace.replace(/[^a-z0-9-]/gi, "-")}`, [namespace]);

  useEffect(() => {
    if (!calLink) return;

    loadCalScript();

    const init = () => {
      if (!window.Cal) return false;

      const cal = window.Cal;
      cal("init", namespace, { origin: "https://app.cal.com" });

      const config: Record<string, string> = {};
      if (name) config.name = name;
      if (email) config.email = email;
      if (phone) {
        config.location = JSON.stringify({
          value: "phone",
          optionValue: phone,
        });
      }

      Object.entries(metadata || {}).forEach(([key, value]) => {
        config[`metadata[${key}]`] = value;
      });

      cal.ns[namespace]("inline", {
        elementOrSelector: `#${elementId}`,
        calLink,
        config,
      });

      cal.ns[namespace]("ui", {
        hideEventTypeDetails: false,
        layout: "month_view",
      });

      return true;
    };

    if (init()) return;

    const interval = window.setInterval(() => {
      if (init()) window.clearInterval(interval);
    }, 200);

    return () => {
      window.clearInterval(interval);
      const element = document.getElementById(elementId);
      if (element) element.innerHTML = "";
    };
  }, [calLink, elementId, email, metadata, name, namespace, phone]);

  return <div id={elementId} className="w-full min-h-[700px]" />;
}
