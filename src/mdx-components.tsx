import type { MDXComponents } from "mdx/types";
import { cn } from "lib/utils";

export function Anchor({ className, ...properties }: JSX.IntrinsicElements["a"]) {
  return (
    <a
      className={cn(
        "rounded-md text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:text-primary-focus hover:decoration-primary/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-base-100",
        className
      )}
      {...properties}
    />
  );
}

export function Heading1(_: JSX.IntrinsicElements["h1"]) {
  return null;
}

export function Heading2({ className, ...properties }: JSX.IntrinsicElements["h2"]) {
  return (
    <h2
      className={cn(
        "mt-14 text-3xl/snug font-semibold tracking-tight text-base-content text-balance sm:text-4xl/snug",
        className
      )}
      {...properties}
    />
  );
}

export function Heading3({ className, ...properties }: JSX.IntrinsicElements["h3"]) {
  return (
    <h3
      className={cn("mt-10 text-xl/snug font-semibold text-base-content text-balance sm:text-2xl/snug", className)}
      {...properties}
    />
  );
}

export function Paragraph({ className, ...properties }: JSX.IntrinsicElements["p"]) {
  return <p className={cn("my-6 text-base leading-8 text-base-content/80", className)} {...properties} />;
}

export function OrderedList({ className, ...properties }: JSX.IntrinsicElements["ol"]) {
  return (
    <ol
      className={cn("my-6 list-decimal pl-6 leading-8 text-base-content/80 marker:text-base-content", className)}
      {...properties}
    />
  );
}

export function UnorderedList({ className, ...properties }: JSX.IntrinsicElements["ul"]) {
  return (
    <ul
      className={cn("my-6 list-disc pl-6 leading-8 text-base-content/80 marker:text-base-content", className)}
      {...properties}
    />
  );
}

export function ListItem({ className, ...properties }: JSX.IntrinsicElements["li"]) {
  return <li className={cn("pl-1 mb-2", className)} {...properties} />;
}

export function Pre({ className, ...properties }: JSX.IntrinsicElements["pre"]) {
  return (
    <pre
      className={cn(
        "my-8 overflow-x-auto rounded-2xl border border-base-300 bg-base-200 p-5 text-sm leading-7 text-base-content",
        className
      )}
      {...properties}
    />
  );
}

export function Code({ className, ...properties }: JSX.IntrinsicElements["code"]) {
  return (
    <code
      className={cn(
        "font-mono text-[0.95em] text-base-content",
        className ? "" : "rounded-md bg-base-200 px-1.5 py-0.5",
        className
      )}
      {...properties}
    />
  );
}

export function Table({ className, ...properties }: JSX.IntrinsicElements["table"]) {
  return (
    <div className="my-8 overflow-x-auto rounded-2xl border border-base-300 bg-base-100 shadow-sm">
      <table className={cn("min-w-full border-collapse text-left text-sm text-base-content/80", className)} {...properties} />
    </div>
  );
}

export function TableHead({ className, ...properties }: JSX.IntrinsicElements["thead"]) {
  return <thead className={cn("bg-base-200/80", className)} {...properties} />;
}

export function TableBody({ className, ...properties }: JSX.IntrinsicElements["tbody"]) {
  return <tbody className={cn("divide-y divide-base-300", className)} {...properties} />;
}

export function TableRow({ className, ...properties }: JSX.IntrinsicElements["tr"]) {
  return <tr className={cn("align-top", className)} {...properties} />;
}

export function TableHeader({ className, ...properties }: JSX.IntrinsicElements["th"]) {
  return <th className={cn("px-4 py-3 font-semibold text-base-content", className)} {...properties} />;
}

export function TableCell({ className, ...properties }: JSX.IntrinsicElements["td"]) {
  return <td className={cn("px-4 py-3 leading-7", className)} {...properties} />;
}

export function Blockquote({ className, ...properties }: JSX.IntrinsicElements["blockquote"]) {
  return (
    <blockquote
      className={cn(
        "my-8 rounded-r-2xl border-l-4 border-primary/60 bg-base-200/60 px-5 py-4 text-base italic leading-8 text-base-content/75",
        className
      )}
      {...properties}
    />
  );
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: Anchor,
    h1: Heading1,
    h2: Heading2,
    h3: Heading3,
    p: Paragraph,
    ol: OrderedList,
    ul: UnorderedList,
    li: ListItem,
    pre: Pre,
    code: Code,
    table: Table,
    thead: TableHead,
    tbody: TableBody,
    tr: TableRow,
    th: TableHeader,
    td: TableCell,
    blockquote: Blockquote,
    ...components,
  };
}
