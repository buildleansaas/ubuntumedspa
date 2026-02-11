export const generateParagraph = (title: string) => {
  const shortTitle = title.replace(/\s+in\s+williamsburg,\s*va\s*$/i, "").trim();
  return `Explore ${shortTitle} at Williamsburg Med Spa in Williamsburg, VA. Learn benefits, what to expect, and FAQs.`.trim();
};
