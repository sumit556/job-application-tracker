const pad = (value) => String(value).padStart(2, "0");

export const toISODate = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const todayISO = () => toISODate(new Date());

export const formatDate = (iso) => {
  if (!iso) return "";

  const parts = iso.split("-").map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return "";

  const date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
};

export const formatDateTime = (iso) => {
  if (!iso) return "";

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export const daysFromToday = (iso) => {
  if (!iso) return null;

  const today = new Date(`${todayISO()}T00:00:00`);
  const target = new Date(`${iso}T00:00:00`);

  if (Number.isNaN(target.getTime())) return null;

  return Math.round((target.getTime() - today.getTime()) / 86400000);
};

export const isOverdue = (iso) => {
  const days = daysFromToday(iso);
  return days !== null && days < 0;
};

export const isDueToday = (iso) => daysFromToday(iso) === 0;

export const isWithinDays = (iso, days) => {
  const difference = daysFromToday(iso);
  return difference !== null && difference > 0 && difference <= days;
};
