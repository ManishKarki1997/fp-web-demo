import { PaginationType } from "@/types/ApiTypes";

export type TagListColumnActionType = 'Edit' | 'Delete' | 'Restore'


export type TagType = {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export type TagTypeWithCount = TagType & { count: number }

export type TagListFiltersType = {
  search?: string;
}

export type TagListType = {
  data: TagTypeWithCount[];
  pagination: PaginationType;
}