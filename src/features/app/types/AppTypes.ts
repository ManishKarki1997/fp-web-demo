
export type EntityRankChartShemaType = {
  fromDate?: string;
  toDate?: string;
  type?: string;
  maxEntities?: number;
}

export type EntityLoansTableFilterType = {
  fromDate?: string;
  toDate?: string;
  search?: string;
}

type EntityLoanEntityType = {
  id: number;
  name: string;
  avatarUrl: string | null;
}

export type EntityLoanListColumnActionType = 'View'

export type EntityLoanType = {
  id: number;
  amount: number;
  remainingBalance: number;
  note: string;
  entity: EntityLoanEntityType;
  avatarUrl?: string;
  address?: string;
  status: string;
  _count: {
    repayments: number;
  };
  attachments?: Array<{ url: string; }>
}


export type BestPerformingTagsChartShemaType = {
  fromDate?: string;
  toDate?: string;
  type?: string;
  maxTags?: number;
}