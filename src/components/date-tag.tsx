import { twMerge } from "tailwind-merge";

import { formatBlogDate } from "lib/format-blog-date";

interface TagProps {
  date: string;
  className?: string;
}

const DateTag = ({ date, className }: TagProps) => {
  const parsedDate = new Date(date);

  return (
    <time
      dateTime={Number.isNaN(parsedDate.getTime()) ? date : parsedDate.toISOString()}
      className={twMerge(
        "inline-flex items-center rounded-full border border-base-300 bg-base-100 px-3 py-1 text-xs font-medium tracking-[0.02em] text-base-content/75",
        className
      )}
    >
      {formatBlogDate(date)}
    </time>
  );
};

export default DateTag;
