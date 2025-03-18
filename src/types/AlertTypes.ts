export type IAlert = {
  id: number;
  name: string;
  keyword: string;
  website: string;
  notifyEmail: string;
  sendAttachment: boolean;
  createdAt: string;
  updatedAt: string;
  userId: number;
}

export type IAlertLog = {
  id: number;
  createdAt: Date;
  chapterNumber: number;
  testMode: boolean;
  alert: {
    name: string;
    keyword: string;
    website: string;
  };
}

export type AlertListColumnActionType = 'Edit' | 'Delete' | "Test";

export type AlertLogsListColumnActionType =  "Test";

export interface IAlertListTableAction {
  action: AlertListColumnActionType;
  row: IAlert;
}