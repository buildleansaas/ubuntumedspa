import type { MDXComponents } from "mdx/types";
import { cn } from "lib/utils";

export function Anchor({ className, ...properties }: JSX.IntrinsicElements["a"]) {
  return (
    <a
      className={cn(
        "text-base-content underline decoration-base-300 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-base-100",
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
        "mt-14 border-t border-base-300 pt-8 text-3xl leading-[1.15] tracking-tight text-base-content text-balance md:text-4xl",
        className
      )}
      {...properties}
    />
  );
}

export function Heading3({ className, ...properties }: JSX.IntrinsicElements["h3"]) {
  return (
    <h3
      className={cn("mt-10 text-2xl leading-snug tracking-tight text-base-content text-balance", className)}
      {...properties}
    />
  );
}

export function Paragraph({ className, ...properties }: JSX.IntrinsicElements["p"]) {
  return <p className={cn("my-6 max-w-[68ch] text-base leading-8 text-base-content/85", className)} {...properties} />;
}

export function OrderedList({ className, ...properties }: JSX.IntrinsicElements["ol"]) {
  return (
    <ol
      className={cn("my-6 max-w-[68ch] list-decimal pl-6 leading-8 text-base-content/85 marker:text-base-content", className)}
      {...properties}
    />
  );
}

export function UnorderedList({ className, ...properties }: JSX.IntrinsicElements["ul"]) {
  return (
    <ul
      className={cn("my-6 max-w-[68ch] list-disc pl-6 leading-8 text-base-content/85 marker:text-base-content", className)}
      {...properties}
    />
  );
}

export function ListItem({ className, ...properties }: JSX.IntrinsicElements["li"]) {
  return <li className={cn("mb-2 pl-1", className)} {...properties} />;
}

export function Pre({ className, ...properties }: JSX.IntrinsicElements["pre"]) {
  return (
    <pre
      className={cn(
        "my-8 overflow-x-auto border border-base-300 bg-base-200 p-5 text-sm leading-7 text-base-content",
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
        className ? "" : "border border-base-300 bg-base-200 px-1.5 py-0.5",
        className
      )}
      {...properties}
    />
  );
}

export function Table({ className, ...properties }: JSX.IntrinsicElements["table"]) {
  return (
    <div className="my-8 overflow-x-auto border border-base-300 bg-base-100">
      <table className={cn("min-w-full border-collapse text-left text-sm text-base-content/85", className)} {...properties} />
    </div>
  );
}

export function TableHead({ className, ...properties }: JSX.IntrinsicElements["thead"]) {
  return <thead className={cn("border-b border-base-300 bg-base-200/80", className)} {...properties} />;
}

export function TableBody({ className, ...properties }: JSX.IntrinsicElements["tbody"]) {
  return <tbody className={cn("divide-y divide-base-300", className)} {...properties} />;
}

export function TableRow({ className, ...properties }: JSX.IntrinsicElements["tr"]) {
  return <tr className={cn("align-top", className)} {...properties} />;
}

export function TableHeader({ className, ...properties }: JSX.IntrinsicElements["th"]) {
  return <th className={cn("px-4 py-3 font-medium text-base-content", className)} {...properties} />;
}

export function TableCell({ className, ...properties }: JSX.IntrinsicElements["td"]) {
  return <td className={cn("px-4 py-3 leading-7", className)} {...properties} />;
}

export function Blockquote({ className, ...properties }: JSX.IntrinsicElements["blockquote"]) {
  return (
    <blockquote
      className={cn(
        "my-8 max-w-[68ch] border-l border-base-300 py-1 pl-5 text-lg leading-8 text-base-content/80",
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
