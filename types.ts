export enum Topic {
  AI = 'AI Technology',
  ECOMMERCE = 'Cross-border E-commerce'
}

export type Language = 'zh' | 'en';

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface TrendItem {
  id: string;
  title: string;
  summary: string;
  impact: string;
  takeaway: string;
  sources: GroundingSource[];
}

export interface TrendReport {
  topic: Topic;
  date: string;
  items: TrendItem[];
  rawMarkdown: string; // Keep raw for copy functionality
  language: Language;
}

export type Platform = 'dingtalk' | 'wechat';
