export interface ICategory {
  id?: number;
  title?: string | null;
  points?: number;
  totalBooks?: number;
}

export const defaultValue: Readonly<ICategory> = {};
