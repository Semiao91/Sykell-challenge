export interface UrlAnalysis {
  id: string;
  url: string;
  title: string;
  htmlVersion: string;
  status: "queued" | "running" | "completed" | "error";
  progress: number;
  internalLinks: number;
  externalLinks: number;
  brokenLinks: number;
  headingCounts: {[key: string]: number};
  hasLoginForm: boolean;
  brokenLinkDetails: {url: string; statusCode: number}[];
  analyzedAt?: Date;
}
