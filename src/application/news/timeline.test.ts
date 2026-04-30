import { describe, expect, it } from "vitest";
import { newsItemsSchema, type NewsItem } from "@/domain/news/news";
import {
  filterNewsItems,
  formatUpdatedAt,
  getDayLabel,
  getLatestPublishedDate,
  groupNewsByDay,
  normalizeNewsItems,
  sortNewsByDate,
} from "./timeline";

const referenceDate = new Date("2026-04-30T12:00:00Z");

const newsItems: NewsItem[] = [
  {
    id: "older",
    title: "VS Code mejora sus agentes",
    summary: "Nuevas integraciones para navegar proyectos grandes.",
    url: "https://example.com/older",
    source: "X",
    publishedAt: "2026-04-28T09:00:00Z",
  },
  {
    id: "newer",
    title: "OpenAI publica mejoras para agentes",
    summary: "Mas control para desarrolladores.",
    url: "https://example.com/newer",
    source: "X",
    publishedAt: "2026-04-30T10:00:00Z",
  },
  {
    id: "yesterday",
    title: "Anthropic mejora Claude Code",
    summary: "Ejecucion en paralelo y contexto mas estable.",
    url: "https://example.com/yesterday",
    source: "X",
    publishedAt: "2026-04-29T10:00:00Z",
  },
];

describe("news schema", () => {
  it("accepts valid news items", () => {
    expect(() => newsItemsSchema.parse(newsItems)).not.toThrow();
  });

  it("rejects invalid URLs", () => {
    expect(() =>
      newsItemsSchema.parse([
        {
          ...newsItems[0],
          url: "not-a-url",
        },
      ]),
    ).toThrow();
  });

  it("rejects invalid dates", () => {
    expect(() =>
      newsItemsSchema.parse([
        {
          ...newsItems[0],
          publishedAt: "30/04/2026",
        },
      ]),
    ).toThrow();
  });
});

describe("timeline application service", () => {
  it("sorts news by descending publication date", () => {
    const sortedItems = sortNewsByDate(newsItems);

    expect(sortedItems.map((item) => item.id)).toEqual(["newer", "yesterday", "older"]);
  });

  it("groups news by day with Spanish labels", () => {
    const groups = groupNewsByDay(normalizeNewsItems(newsItems), referenceDate);

    expect(groups.map((group) => group.label)).toEqual(["Hoy", "Ayer", "28 de abril"]);
  });

  it("filters news by title, summary, or source", () => {
    const normalizedItems = normalizeNewsItems(newsItems);

    expect(filterNewsItems(normalizedItems, "openai")).toHaveLength(1);
    expect(filterNewsItems(normalizedItems, "paralelo")).toHaveLength(1);
    expect(filterNewsItems(normalizedItems, "x")).toHaveLength(3);
  });

  it("returns the original collection when the query is empty", () => {
    const normalizedItems = normalizeNewsItems(newsItems);

    expect(filterNewsItems(normalizedItems, "   ")).toHaveLength(3);
  });

  it("labels today, yesterday, and previous dates", () => {
    expect(getDayLabel("2026-04-30", referenceDate)).toBe("Hoy");
    expect(getDayLabel("2026-04-29", referenceDate)).toBe("Ayer");
    expect(getDayLabel("2026-04-28", referenceDate)).toBe("28 de abril");
  });

  it("returns the latest publication date", () => {
    const latestDate = getLatestPublishedDate(normalizeNewsItems(newsItems));

    expect(latestDate?.toISOString()).toBe("2026-04-30T10:00:00.000Z");
  });

  it("formats the latest update as relative text", () => {
    expect(formatUpdatedAt(new Date("2026-04-30T11:30:00Z"), referenceDate)).toBe(
      "Actualizado hace 30 minutos",
    );
    expect(formatUpdatedAt(null, referenceDate)).toBe("Sin actualizaciones");
  });
});
