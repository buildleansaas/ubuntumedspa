import Image from "next/image";

import { cn } from "lib/utils";

interface CmaCredentialStripProps {
  className?: string;
  centered?: boolean;
}

export default function CmaCredentialStrip({ className, centered = false }: CmaCredentialStripProps) {
  return (
    <div
      className={cn(
        "flex w-fit max-w-full items-center gap-3 border border-base-300 bg-base-100 px-3.5 py-3",
        centered && "mx-auto",
        className
      )}
    >
      <Image
        src="/brand/cma-logo.png"
        alt="Cellular Medicine Association"
        width={150}
        height={66}
        className="h-auto w-[84px] shrink-0 sm:w-[96px]"
      />

      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-base-content/75">Certified Provider</p>
        <p className="mt-1 text-sm leading-5 text-base-content/85">
          Cellular Medicine Association-trained and certified OH-Shot provider.
        </p>
      </div>
    </div>
  );
}
