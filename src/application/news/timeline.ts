import type { NewsItem, TimelineGroup, TimelineNewsItem } from "@/domain/news/news";

const DAY_FORMATTER = new Intl.DateTimeFormat("es-ES", {
  day: "2-digit",
  month: "long",
});

const RELATIVE_TIME_FORMATTER = new Intl.RelativeTimeFormat("es-ES", {
  numeric: "auto",
});

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MS_PER_HOUR = 60 * 60 * 1000;
const MS_PER_MINUTE = 60 * 1000;

export function normalizeNewsItems(items: NewsItem[]): TimelineNewsItem[] {
  return sortNewsByDate(items).map((item) => ({
    ...item,
    publishedDate: new Date(item.publishedAt),
    searchText: buildSearchText(item),
  }));
}

export function sortNewsByDate(items: NewsItem[]): NewsItem[] {
  return [...items].sort(
    (firstItem, secondItem) =>
      new Date(secondItem.publishedAt).getTime() - new Date(firstItem.publishedAt).getTime(),
  );
}

export function groupNewsByDay(
  items: TimelineNewsItem[],
  referenceDate = new Date(),
): TimelineGroup[] {
  const groups = new Map<string, TimelineNewsItem[]>();

  for (const item of items) {
    const dayKey = toDateKey(item.publishedDate);
    const groupItems = groups.get(dayKey) ?? [];
    groupItems.push(item);
    groups.set(dayKey, groupItems);
  }

  return [...groups.entries()].map(([dayKey, groupItems]) => ({
    id: dayKey,
    label: getDayLabel(dayKey, referenceDate),
    accent: isToday(dayKey, referenceDate) ? "lime" : "cyan",
    items: groupItems,
  }));
}

export function filterNewsItems(items: TimelineNewsItem[], query: string): TimelineNewsItem[] {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) {
    return items;
  }

  return items.filter((item) => item.searchText.includes(normalizedQuery));
}

export function getLatestPublishedDate(items: TimelineNewsItem[]): Date | null {
  const [latestItem] = sortNewsByDate(items);

  return latestItem ? new Date(latestItem.publishedAt) : null;
}

export function formatUpdatedAt(latestPublishedDate: Date | null, referenceDate = new Date()): string {
  if (!latestPublishedDate) {
    return "Sin actualizaciones";
  }

  const difference = latestPublishedDate.getTime() - referenceDate.getTime();
  const absoluteDifference = Math.abs(difference);

  if (absoluteDifference < MS_PER_MINUTE) {
    return "Actualizado hace menos de un minuto";
  }

  if (absoluteDifference < MS_PER_HOUR) {
    return `Actualizado ${RELATIVE_TIME_FORMATTER.format(Math.round(difference / MS_PER_MINUTE), "minute")}`;
  }

  if (absoluteDifference < MS_PER_DAY) {
    return `Actualizado ${RELATIVE_TIME_FORMATTER.format(Math.round(difference / MS_PER_HOUR), "hour")}`;
  }

  return `Actualizado ${RELATIVE_TIME_FORMATTER.format(Math.round(difference / MS_PER_DAY), "day")}`;
}

export function getDayLabel(dayKey: string, referenceDate = new Date()): string {
  const todayKey = toDateKey(referenceDate);
  const yesterdayKey = toDateKey(new Date(Date.parse(`${todayKey}T00:00:00.000Z`) - MS_PER_DAY));

  if (dayKey === todayKey) {
    return "Hoy";
  }

  if (dayKey === yesterdayKey) {
    return "Ayer";
  }

  return DAY_FORMATTER.format(new Date(`${dayKey}T00:00:00`));
}

export function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function buildSearchText(item: NewsItem): string {
  return normalizeText(`${item.title} ${item.summary} ${item.source}`);
}

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function isToday(dayKey: string, referenceDate: Date): boolean {
  return dayKey === toDateKey(referenceDate);
}
