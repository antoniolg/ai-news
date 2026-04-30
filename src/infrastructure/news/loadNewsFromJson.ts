import news from "@/content/news.json";
import { groupNewsByDay, normalizeNewsItems } from "@/application/news/timeline";
import { newsItemsSchema } from "@/domain/news/news";
import type { TimelineGroup } from "@/domain/news/news";

export function loadTimelineGroups(referenceDate = new Date()): TimelineGroup[] {
  const parsedNews = newsItemsSchema.parse(news);
  const timelineItems = normalizeNewsItems(parsedNews);

  return groupNewsByDay(timelineItems, referenceDate);
}
