export interface IContent {
  id: number;
  span?: number;
  slug?: string;
  title: string;
  topicId: number;
  contentHtml?: string;
  contentMarkdown?: string;
  visibility: boolean;
  UserContent?: any;
  estimateTime: number;
  trackTime: number;
}
