
export interface Endpoint {
  nama: string;
  category: string;
  method: 'GET' | 'POST';
  url: string;
  param?: string;
  model?: string[];
  style?: string[];
  query?: string;
  media_type?: 'jpeg' | 'png' | 'gif' | 'mp4' | 'json';
}

export interface StatsData {
  Request?: string;
  runtime?: string;
}

export type GroupedEndpoints = {
  [category: string]: Endpoint[];
};
