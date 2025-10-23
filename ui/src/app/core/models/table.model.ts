import { TableTdType } from "../types/table-td.type";
import { TableAction, TableContextType } from "../types/table-context.type";

export interface ITableRow {
    id: string;
    name: string;
}
export interface ITableColumn {
  key: keyof ITableRow | string; 
  header: string;            
  type: TableTdType;     
}
export interface ITableContext {
    context: TableContextType,
    action: TableAction,
}