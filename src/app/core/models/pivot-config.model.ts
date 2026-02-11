import { Field, CalculatedField } from './field.model';

export interface PivotConfig {
  rows: Field[];
  columns: Field[];
  values: Field[];
  filters: FilterConfig[];
  calculatedFields: CalculatedField[];
}

export interface FilterConfig {
  fieldId: string;
  operator: FilterOperator;
  value: any;
}

export type FilterOperator = 
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'greaterThan'
  | 'lessThan'
  | 'between'
  | 'in';
