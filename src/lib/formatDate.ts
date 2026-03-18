/**
 * Formats a date string to "Month Day, Year" format.
 * Handles both "YYYY-MM-DD" (Sanity) and "MM-DD-YY" (fallback) inputs.
 */
export function formatDate(dateStr: string): string {
  let d: Date;

  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    // YYYY-MM-DD from Sanity
    const [y, m, day] = dateStr.split("-").map(Number);
    d = new Date(y, m - 1, day);
  } else if (/^\d{2}-\d{2}-\d{2}$/.test(dateStr)) {
    // MM-DD-YY fallback format
    const [m, day, y] = dateStr.split("-").map(Number);
    d = new Date(2000 + y, m - 1, day);
  } else {
    return dateStr;
  }

  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
