export interface Field {
  id: string;
  name: string;
  displayName: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  aggregationType?: AggregationType;
  format?: string;
}

export type AggregationType = 
  | 'sum'
  | 'min'
  | 'max'
  | 'avg'
  | 'count'
  | 'distinctCount';

export interface CalculatedField extends Field {
  formula: string;
  dependencies: string[];
}
