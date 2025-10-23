import { TableTdType } from "../types/table-td.type";

export interface ITableRow {
    id: string;
    name: string;
}

export interface ITableColumn {
  key: keyof ITableRow | string; 
  header: string;            
  type: TableTdType;     
}