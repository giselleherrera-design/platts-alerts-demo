import {
  Alert,
  Report,
  AlertType,
  ReportAlertConfig,
  PriceAlertConfig,
  NewsAlertConfig,
  PublicationAlertConfig,
  ScheduledAlertConfig,
} from '../types/alerts';

// Available reports for selection
export const availableReports: Report[] = [
  {
    id: 'rep-001',
    name: 'Analytics Year-End Report',
    geography: 'Global',
    commodity: 'Multi-commodity',
    type: 'Analytics Report',
  },
  {
    id: 'rep-002',
    name: 'Australia Coal Data',
    geography: 'Asia Pacific',
    commodity: 'Coal',
    type: 'Market Data',
  },
  {
    id: 'rep-003',
    name: 'Basic Market Model: Gulf Demand',
    geography: 'North America',
    commodity: 'Oil',
    type: 'Market Model',
  },
  {
    id: 'rep-004',
    name: 'Canadian Observer History',
    geography: 'North America',
    commodity: 'Natural Gas',
    type: 'Market Report',
  },
  {
    id: 'rep-005',
    name: 'Megawatt Daily',
    geography: 'North America',
    commodity: 'Power',
    type: 'Market Report',
  },
  {
    id: 'rep-006',
    name: 'Power Sales Analysis',
    geography: 'North America',
    commodity: 'Power',
    type: 'Analytics Report',
  },
  {
    id: 'rep-007',
    name: 'Gas Daily',
    geography: 'North America',
    commodity: 'Natural Gas',
    type: 'Market Report',
  },
  {
    id: 'rep-008',
    name: 'Inside FERC',
    geography: 'North America',
    commodity: 'Power',
    type: 'Market Report',
  },
  {
    id: 'rep-009',
    name: 'European Gas Markets',
    geography: 'Europe',
    commodity: 'Natural Gas',
    type: 'Market Report',
  },
  {
    id: 'rep-010',
    name: 'LNG Daily',
    geography: 'Global',
    commodity: 'LNG',
    type: 'Market Report',
  },
  {
    id: 'rep-011',
    name: 'Crude Oil Marketwire',
    geography: 'Global',
    commodity: 'Oil',
    type: 'Market Report',
  },
  {
    id: 'rep-012',
    name: 'Metals Daily',
    geography: 'Global',
    commodity: 'Metals',
    type: 'Market Report',
  },
];

// Available price symbols
export const availablePriceSymbols = [
  { symbol: 'AAGPL00', name: 'US Northeast Power', commodity: 'Power' },
  { symbol: 'AAGNG00', name: 'Henry Hub Natural Gas', commodity: 'Natural Gas' },
  { symbol: 'PCAAS00', name: 'Brent Crude', commodity: 'Oil' },
  { symbol: 'PCAAC00', name: 'WTI Crude', commodity: 'Oil' },
  { symbol: 'MTAAU00', name: 'Gold Spot', commodity: 'Metals' },
  { symbol: 'MTAAG00', name: 'Silver Spot', commodity: 'Metals' },
  { symbol: 'AAGNB00', name: 'NBP Natural Gas', commodity: 'Natural Gas' },
  { symbol: 'AETDH00', name: 'East Texas Agua Dulce Hub', commodity: 'Natural Gas' },
];

// Mock alerts data matching the screenshots
export const mockAlerts: Alert[] = [
  {
    id: 'alert-001',
    name: 'My Energy Docs',
    type: 'report',
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    config: {
      frequency: 'realtime',
      reports: [
        availableReports[0], // Analytics Year-End Report
        availableReports[1], // Australia Coal Data
        availableReports[2], // Basic Market Model
        availableReports[3], // Canadian Observer History
        availableReports[4], // Megawatt Daily
        availableReports[5], // Power Sales Analysis
      ],
    } as ReportAlertConfig,
  },
  {
    id: 'alert-002',
    name: 'US Northeast Power',
    type: 'price',
    isActive: true,
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-18T11:00:00Z',
    config: {
      frequency: 'realtime',
      symbol: 'AAGPL00',
      symbolName: 'US Northeast Power',
      condition: 'above',
      threshold: 75.0,
      currentPrice: 72.5,
    } as PriceAlertConfig,
  },
  {
    id: 'alert-003',
    name: 'OPEC News',
    type: 'news',
    isActive: true,
    createdAt: '2024-01-08T08:00:00Z',
    updatedAt: '2024-01-19T16:00:00Z',
    config: {
      frequency: 'realtime',
      keywords: ['OPEC', 'oil production', 'crude output'],
      sources: ['Reuters', 'Bloomberg', 'S&P Global'],
      topics: ['Energy', 'Oil & Gas'],
    } as NewsAlertConfig,
  },
  {
    id: 'alert-004',
    name: 'Gas and Power',
    type: 'publication',
    isActive: true,
    createdAt: '2024-01-05T07:00:00Z',
    updatedAt: '2024-01-17T09:00:00Z',
    config: {
      frequency: 'daily',
      publications: ['Gas Daily', 'Megawatt Daily', 'Power Markets Week'],
      categories: ['Natural Gas', 'Power'],
    } as PublicationAlertConfig,
  },
  {
    id: 'alert-005',
    name: 'My Daily Digest',
    type: 'scheduled',
    isActive: true,
    createdAt: '2024-01-01T06:00:00Z',
    updatedAt: '2024-01-16T08:00:00Z',
    config: {
      frequency: 'daily',
      scheduleTime: '08:00',
      scheduleDays: [1, 2, 3, 4, 5], // Monday to Friday
      includedAlertTypes: ['report', 'price', 'news'],
    } as ScheduledAlertConfig,
  },
  {
    id: 'alert-006',
    name: 'OPEC News',
    type: 'news',
    isActive: true,
    createdAt: '2024-01-12T10:00:00Z',
    updatedAt: '2024-01-21T12:00:00Z',
    config: {
      frequency: 'realtime',
      keywords: ['OPEC+', 'Saudi Arabia', 'production cuts'],
      sources: ['S&P Global Platts'],
    } as NewsAlertConfig,
  },
  {
    id: 'alert-007',
    name: 'Gas and Power',
    type: 'price',
    isActive: true,
    createdAt: '2024-01-14T11:00:00Z',
    updatedAt: '2024-01-22T15:00:00Z',
    config: {
      frequency: 'realtime',
      symbol: 'AAGNG00',
      symbolName: 'Henry Hub Natural Gas',
      condition: 'change_percent',
      threshold: 5.0,
      currentPrice: 2.85,
    } as PriceAlertConfig,
  },
  {
    id: 'alert-008',
    name: 'East Texas Agua Dulce Hub',
    type: 'price',
    isActive: true,
    createdAt: '2024-01-13T09:30:00Z',
    updatedAt: '2024-01-23T10:00:00Z',
    config: {
      frequency: 'realtime',
      symbol: 'AETDH00',
      symbolName: 'East Texas Agua Dulce Hub',
      condition: 'below',
      threshold: 2.50,
      currentPrice: 2.65,
    } as PriceAlertConfig,
  },
];

// News topics for selection
export const newsTopics = [
  'Oil & Gas',
  'Power & Renewables',
  'Metals & Mining',
  'Petrochemicals',
  'Agriculture',
  'Shipping',
  'Carbon & ESG',
  'Economics',
  'Geopolitics',
];

// News sources
export const newsSources = [
  'S&P Global Platts',
  'S&P Global Market Intelligence',
  'Reuters',
  'Bloomberg',
  'Financial Times',
  'Wall Street Journal',
];

// Helper function to generate unique IDs
export const generateId = (): string => {
  return `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Helper function to get current timestamp
export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

// Default configurations for new alerts
export const defaultAlertConfigs: Record<AlertType, Partial<Alert['config']>> = {
  report: {
    frequency: 'realtime',
    reports: [],
  },
  price: {
    frequency: 'realtime',
    symbol: '',
    symbolName: '',
    condition: 'above',
    threshold: 0,
  },
  news: {
    frequency: 'realtime',
    keywords: [],
    sources: [],
    topics: [],
  },
  publication: {
    frequency: 'daily',
    publications: [],
    categories: [],
  },
  scheduled: {
    frequency: 'daily',
    scheduleTime: '08:00',
    scheduleDays: [1, 2, 3, 4, 5],
    includedAlertTypes: [],
  },
};
