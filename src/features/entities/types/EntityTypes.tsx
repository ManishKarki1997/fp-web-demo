export type EntityListColumnActionType = 'View' | 'Edit' | 'Delete' | 'Restore' | 'UploadPicture'

export type EntityType = {
  id: number;
  balance: number;
  name: string;
  email?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  address?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type EntityDetailStats = {
  totalPayments: number;
  totalPurchases: number;
  totalSales: number;
  totalTransactions: number;
}

export type EntityDetailType = {
  data: EntityType;
  stats?: EntityDetailStats;
}

export type EntityDetailChartShemaType = {
  id: number;
  fromDate?: string;
  toDate?: string;
}