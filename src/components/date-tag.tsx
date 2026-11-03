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
        "inline-flex items-center border border-base-300 bg-base-100 px-3 py-1 text-xs font-medium tracking-[0.04em] text-base-content/80",
        className
      )}
    >
      {formatBlogDate(date)}
    </time>
  );
};

export default DateTag;
