export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  createdAt: Date;
  modifiedAt: Date;
  tags: string[];
  category: string;
  description?: string;
  url?: string;
  isFavorite: boolean;
}

export interface DocumentCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export type DocumentSortField = 'name' | 'createdAt' | 'modifiedAt' | 'size' | 'type';
export type SortOrder = 'asc' | 'desc';