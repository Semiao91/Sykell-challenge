import {z} from "zod";

export const scrapeSchema = z.object({
  url: z.string().url({message: "Invalid URL"}),
});

export type ScrapeSchema = z.infer<typeof scrapeSchema>;

export const urlDeleteSchema = z.object({
  id: z.string({message: "Invalid ID format"}),
});

export type UrlDeleteSchema = z.infer<typeof urlDeleteSchema>;
