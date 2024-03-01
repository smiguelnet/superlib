import { ICategory } from 'app/shared/model/category.model';

export interface IBook {
  id?: number;
  title?: string | null;
  pages?: number | null;
  author?: string | null;
  year?: number | null;
  category?: ICategory | null;
}

export const defaultValue: Readonly<IBook> = {};
