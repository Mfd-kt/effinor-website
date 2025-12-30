export type VisitorStatus = "active" | "left";

export interface Visitor {
  id: string;
  ip: string;
  status: VisitorStatus;
  currentPage: string;
  source: string;
  browser: string;
  device: string;
  country?: string;
  city?: string;
  lastSeen: Date;
  sessionId: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export interface VisitorSession {
  id: string;
  visitorId: string;
  pages: PageView[];
  device: string;
  browser: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  startedAt: Date;
  lastActivity: Date;
}

export interface PageView {
  path: string;
  title: string;
  viewedAt: Date;
  duration?: number;
}

