// Alert Types
export type AlertType = 'report' | 'price' | 'news' | 'publication' | 'scheduled';

export type AlertFrequency = 'realtime' | 'daily' | 'weekly' | 'monthly';

export type PriceCondition = 'above' | 'below' | 'change_percent';

// Report interface
export interface Report {
  id: string;
  name: string;
  geography: string;
  commodity: string;
  type: string;
}

// Base Alert Config
export interface BaseAlertConfig {
  frequency: AlertFrequency;
}

// Report Alert Config
export interface ReportAlertConfig extends BaseAlertConfig {
  reports: Report[];
}

// Price Alert Config
export interface PriceAlertConfig extends BaseAlertConfig {
  symbol: string;
  symbolName: string;
  condition: PriceCondition;
  threshold: number;
  currentPrice?: number;
}

// News Alert Config
export interface NewsAlertConfig extends BaseAlertConfig {
  keywords: string[];
  sources?: string[];
  topics?: string[];
}

// Publication Alert Config
export interface PublicationAlertConfig extends BaseAlertConfig {
  publications: string[];
  categories?: string[];
}

// Scheduled Alert Config
export interface ScheduledAlertConfig extends BaseAlertConfig {
  scheduleTime: string; // HH:mm format
  scheduleDays: number[]; // 0-6, Sunday to Saturday
  includedAlertTypes: AlertType[];
}

// Union type for all configs
export type AlertConfig =
  | ReportAlertConfig
  | PriceAlertConfig
  | NewsAlertConfig
  | PublicationAlertConfig
  | ScheduledAlertConfig;

// Main Alert interface
export interface Alert {
  id: string;
  name: string;
  type: AlertType;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  config: AlertConfig;
}

// Type guards
export function isReportAlert(alert: Alert): alert is Alert & { config: ReportAlertConfig } {
  return alert.type === 'report';
}

export function isPriceAlert(alert: Alert): alert is Alert & { config: PriceAlertConfig } {
  return alert.type === 'price';
}

export function isNewsAlert(alert: Alert): alert is Alert & { config: NewsAlertConfig } {
  return alert.type === 'news';
}

export function isPublicationAlert(alert: Alert): alert is Alert & { config: PublicationAlertConfig } {
  return alert.type === 'publication';
}

export function isScheduledAlert(alert: Alert): alert is Alert & { config: ScheduledAlertConfig } {
  return alert.type === 'scheduled';
}

// Alert Type Display Names
export const ALERT_TYPE_LABELS: Record<AlertType, string> = {
  report: 'Report Alert',
  price: 'Price Alert',
  news: 'News Alert',
  publication: 'Publication Alert',
  scheduled: 'Scheduled Alert',
};

// Frequency Display Names
export const FREQUENCY_LABELS: Record<AlertFrequency, string> = {
  realtime: 'Real-time',
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
};
