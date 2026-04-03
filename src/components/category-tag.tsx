import NextLink from "next/link";
import { twMerge } from "tailwind-merge";

export function toKebabCase(str: string): string {
  return str
    .toLowerCase() // convert to lowercase
    .replace(/\s+/g, "-") // replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, "") // remove non-alphanumeric characters except hyphens
    .replace(/--+/g, "-") // replace consecutive hyphens with a single hyphen
    .replace(/^-+|-+$/g, ""); // remove leading and trailing hyphens
}

interface TagProps {
  tag: string;
  className?: string;
  size?: string;
  href?: string;
}

const tagBaseClassName =
  "inline-flex items-center rounded-full border border-base-300 bg-base-100 px-3 py-1 text-xs font-medium tracking-[0.02em] text-base-content/75 transition-colors";

const CategoryTag = ({ tag, className, size = "sm", href }: TagProps) => {
  const sizeClassName = size === "lg" ? "px-4 py-2 text-sm" : "";
  const resolvedClassName = twMerge(
    tagBaseClassName,
    sizeClassName,
    href &&
      "hover:border-primary/30 hover:bg-base-200 hover:text-base-content focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-base-100",
    className
  );

  switch (size) {
    case "lg": {
      if (!href) return <span className={resolvedClassName}>{tag}</span>;

      return <a href={href} className={resolvedClassName}>{tag}</a>;
    }

    default: {
      if (!href) return <span className={resolvedClassName}>{tag}</span>;

      return <NextLink href={href} className={resolvedClassName}>{tag}</NextLink>;
    }
  }
};

export default CategoryTag;
