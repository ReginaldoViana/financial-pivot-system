export interface FinancialRecord {
  id: string;
  dataPrevisao: Date;
  clienteFornecedor: string;
  telefone?: string;
  tipo: 'Contas a Receber' | 'Contas a Pagar';
  valorConta: number;
  aPagarReceber: number;
  jurosPercentual?: number;
  multaPercentual?: number;
  banco?: string;
  agencia?: string;
}

export interface PivotData {
  rows: PivotRow[];
  grandTotal: PivotTotal;
}

export interface PivotRow {
  key: string;
  label: string;
  level: number;
  expanded: boolean;
  children?: PivotRow[];
  values: { [key: string]: number };
  rawData: FinancialRecord[];
}

export interface PivotTotal {
  [key: string]: number;
}
