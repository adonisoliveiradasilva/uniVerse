export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface IAlert {
  id: number;
  message: string;
  type: AlertType;
}