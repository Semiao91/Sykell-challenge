import {z} from "zod";

export const scrapeSchema = z.object({
  url: z.string().url({message: "Invalid URL"}),
});

export type ScrapeSchema = z.infer<typeof scrapeSchema>;
