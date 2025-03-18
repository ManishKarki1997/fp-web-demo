export type TransactionListColumnActionType = 'View' | 'Edit' | 'Delete' | 'Complete'

type TagObjectType = {
  label: string;
  value: number;
}

export type TransactionAttachmentType = {
  id: number;
  url: string;
}

export type TransactionType = {
  id: number;
  type?: string;
  amount: string;
  note?: string;
  date: Date;
  createdAt: string;
  updatedAt: string;
  entityId: string;
  tags: TagObjectType[];
  interestRate?: string;
  startDate?: string;
  endDate?: string;
  remainingBalance?: string;
  status?: string;
  parentId?: number;
  loanMonthsSpan: number;
  attachments: TransactionAttachmentType[]
}

export type TransactionListFiltersType = {
  search?: string;
  entityId?: string;
  type?: string;
  tags?: number[];
  from?: string;
  to?: string;
}