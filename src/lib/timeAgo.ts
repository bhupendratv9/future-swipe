export const getTimeAgo = (dateString: string) => {
  const now = new Date();
  const created = new Date(dateString);

  const diffMs = now.getTime() - created.getTime();

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHr < 24) return `${diffHr} hour ago`;
  return `${diffDays} days ago`;
};