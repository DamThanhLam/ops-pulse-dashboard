export function displayValue(value: unknown, fallback = "-") {
  if (value === undefined || value === null || value === "") return fallback;
  return String(value);
}

export function formatDateTime(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

export function shortId(value?: string | number | null, visible = 10) {
  if (value === undefined || value === null || value === "") return "-";
  const text = String(value);
  return text.length > visible + 6 ? `${text.slice(0, visible)}…${text.slice(-4)}` : text;
}
