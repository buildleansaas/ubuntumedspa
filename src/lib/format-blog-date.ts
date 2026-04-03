export function formatBlogDate(date: string) {
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return date;

  return new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(parsedDate);
}
