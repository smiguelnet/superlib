export interface IRanking {
  userId?: number;
  userName?: string;
  email?: string;
  points?: number;
  books?: number;
  categories?: any[];
}

export const defaultValue: Readonly<IRanking> = {};
