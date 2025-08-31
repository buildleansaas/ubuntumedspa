import { twMerge } from "tailwind-merge";

interface TagProps {
  date: string;
  className?: string;
}

const DateTag = ({ date, className }: TagProps) => {
  return (
    <time
      dateTime={new Date(date).toISOString()}
      className={twMerge("rounded-lg px-2 py-1 m-1 bg-primary text-base-content", className)}
    >
      {new Date(date).toLocaleDateString("en-US", {
        dateStyle: "long",
      })}
    </time>
  );
};

export default DateTag;
