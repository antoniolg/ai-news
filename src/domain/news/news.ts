import { z } from "zod";

export const newsSourceSchema = z.enum(["X"]);

export const newsItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  url: z.string().url(),
  source: newsSourceSchema,
  publishedAt: z.string().datetime({ offset: true }),
});

export const newsItemsSchema = z.array(newsItemSchema);

export type NewsSource = z.infer<typeof newsSourceSchema>;
export type NewsItem = z.infer<typeof newsItemSchema>;

export type TimelineNewsItem = NewsItem & {
  publishedDate: Date;
  searchText: string;
};

export type TimelineGroup = {
  id: string;
  label: string;
  accent: "lime" | "cyan";
  items: TimelineNewsItem[];
};
