export function upsertByKey<T>(items: T[], item: T, getKey: (value: T) => string) {
  const key = getKey(item);
  const exists = items.some((current) => getKey(current) === key);
  return exists ? items.map((current) => (getKey(current) === key ? item : current)) : [item, ...items];
}
