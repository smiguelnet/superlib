export interface IRanking {
  userId?: number;
  userName?: string;
  email?: string;
  points?: number;
  books?: number;
  categories?: {
    category?: any;
    points?: number;
    books?: number;
    trophy?: boolean;
  }[];
}

export const defaultValue: Readonly<IRanking> = {};
