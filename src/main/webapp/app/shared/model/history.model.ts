import { IBook } from 'app/shared/model/book.model';

export interface IHistory {
  id?: number;
  points?: number | null;
  createdDate?: number | null;
  createdBy?: string | null;
  book?: IBook | null;
}

export const defaultValue: Readonly<IHistory> = {};
