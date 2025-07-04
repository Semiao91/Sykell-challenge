export interface UrlAnalysis {
  ID: string;
  url: string;
  title: string;
  html_version: string;
  status: "queued" | "running" | "complete" | "error";
  progress: number;
  internal_links: number;
  external_links: number;
  broken_links: number;
  heading_counts: {[key: string]: number};
  has_login_form: boolean;
  broken_link_details: {url: string; status: number}[];
  analyzedAt?: Date;
}
