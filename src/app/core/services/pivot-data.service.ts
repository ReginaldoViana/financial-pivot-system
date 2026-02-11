import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FinancialRecord, PivotData, PivotRow } from '../models/financial-data.model';
import { PivotConfig } from '../models/pivot-config.model';
import { Field, AggregationType, CalculatedField } from '../models/field.model';
import { groupBy, sumBy, meanBy, minBy, maxBy, uniqBy } from 'lodash-es';
import { format } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class PivotDataService {
  private dataSubject = new BehaviorSubject<FinancialRecord[]>([]);
  private calculatedFieldsSubject = new BehaviorSubject<CalculatedField[]>([]);
  
  configSubject = new BehaviorSubject<PivotConfig>({
    rows: [
      { id: 'dataPrevisao', name: 'dataPrevisao', displayName: 'Data de Previsão', type: 'date' }
    ],
    columns: [
      { id: 'tipo', name: 'tipo', displayName: 'Tipo', type: 'string' }
    ],
    values: [
      { id: 'valorConta', name: 'valorConta', displayName: 'Valor da Conta', type: 'number', aggregationType: 'sum' },
      { id: 'aPagarReceber', name: 'aPagarReceber', displayName: 'A Pagar ou Receber', type: 'number', aggregationType: 'sum' }
    ],
    filters: [],
    calculatedFields: []
  });

  data$ = this.dataSubject.asObservable();
  config$ = this.configSubject.asObservable();
  calculatedFields$ = this.calculatedFieldsSubject.asObservable();

  constructor() {
    this.loadMockData();
  }

  private loadMockData(): void {
    const mockData: FinancialRecord[] = [
      // Março 2025
      {
        id: '1',
        dataPrevisao: new Date('2025-03-23'),
        clienteFornecedor: 'BANCO DO BRASIL',
        telefone: '(35) 9851-0000',
        tipo: 'Contas a Pagar',
        valorConta: -622.94,
        aPagarReceber: -622.94,
        banco: 'Banco do Brasil',
        agencia: '1234-5'
      },
      {
        id: '2',
        dataPrevisao: new Date('2025-03-24'),
        clienteFornecedor: 'Cliente ABC Ltda',
        telefone: '(11) 99999-1234',
        tipo: 'Contas a Receber',
        valorConta: 55724.87,
        aPagarReceber: 32185.75,
        banco: 'Itaú',
        agencia: '0567-8'
      },
      {
        id: '3',
        dataPrevisao: new Date('2025-03-24'),
        clienteFornecedor: 'Fornecedor XYZ',
        telefone: '(21) 3333-4444',
        tipo: 'Contas a Pagar',
        valorConta: -19867.40,
        aPagarReceber: -19867.40,
        banco: 'Bradesco',
        agencia: '2345-6'
      },
      {
        id: '4',
        dataPrevisao: new Date('2025-03-26'),
        clienteFornecedor: 'CEMIG Distribuição',
        telefone: '(31) 116',
        tipo: 'Contas a Pagar',
        valorConta: -1041.80,
        aPagarReceber: -1041.80,
        banco: 'Caixa',
        agencia: '0001'
      },
      {
        id: '5',
        dataPrevisao: new Date('2025-03-27'),
        clienteFornecedor: 'Empresa Tech Solutions',
        telefone: '(11) 4002-8922',
        tipo: 'Contas a Receber',
        valorConta: 28500.00,
        aPagarReceber: 28500.00,
        banco: 'Santander',
        agencia: '7890-1'
      },
      {
        id: '6',
        dataPrevisao: new Date('2025-03-28'),
        clienteFornecedor: 'Locadora de Veículos SA',
        telefone: '(31) 3245-6789',
        tipo: 'Contas a Pagar',
        valorConta: -3250.00,
        aPagarReceber: -3250.00,
        banco: 'Banco do Brasil',
        agencia: '4567-8'
      },
      // Abril 2025
      {
        id: '7',
        dataPrevisao: new Date('2025-04-02'),
        clienteFornecedor: 'Cliente Premium LTDA',
        telefone: '(19) 98765-4321',
        tipo: 'Contas a Receber',
        valorConta: 42800.00,
        aPagarReceber: 42800.00,
        banco: 'Itaú',
        agencia: '1234-5'
      },
      {
        id: '8',
        dataPrevisao: new Date('2025-04-05'),
        clienteFornecedor: 'Copasa MG',
        telefone: '(31) 115',
        tipo: 'Contas a Pagar',
        valorConta: -456.78,
        aPagarReceber: -456.78,
        banco: 'Caixa',
        agencia: '0001'
      },
      {
        id: '9',
        dataPrevisao: new Date('2025-04-08'),
        clienteFornecedor: 'Distribuidora Nacional',
        telefone: '(11) 2222-3333',
        tipo: 'Contas a Pagar',
        valorConta: -15680.50,
        aPagarReceber: -15680.50,
        banco: 'Bradesco',
        agencia: '5678-9'
      },
      {
        id: '10',
        dataPrevisao: new Date('2025-04-10'),
        clienteFornecedor: 'Consultoria Empresarial',
        telefone: '(21) 99887-6655',
        tipo: 'Contas a Receber',
        valorConta: 18900.00,
        aPagarReceber: 18900.00,
        banco: 'Banco do Brasil',
        agencia: '9012-3'
      },
      {
        id: '11',
        dataPrevisao: new Date('2025-04-12'),
        clienteFornecedor: 'Operadora Telecom',
        telefone: '(0800) 123-4567',
        tipo: 'Contas a Pagar',
        valorConta: -890.00,
        aPagarReceber: -890.00,
        banco: 'Itaú',
        agencia: '3456-7'
      },
      {
        id: '12',
        dataPrevisao: new Date('2025-04-15'),
        clienteFornecedor: 'Indústria Metalúrgica',
        telefone: '(35) 3456-7890',
        tipo: 'Contas a Receber',
        valorConta: 67500.00,
        aPagarReceber: 45000.00,
        banco: 'Santander',
        agencia: '2345-6'
      },
      {
        id: '13',
        dataPrevisao: new Date('2025-04-18'),
        clienteFornecedor: 'Gráfica Impressa',
        telefone: '(31) 3111-2222',
        tipo: 'Contas a Pagar',
        valorConta: -2340.00,
        aPagarReceber: -2340.00,
        banco: 'Caixa',
        agencia: '0023'
      },
      {
        id: '14',
        dataPrevisao: new Date('2025-04-20'),
        clienteFornecedor: 'Supermercado Atacadão',
        telefone: '(11) 4444-5555',
        tipo: 'Contas a Pagar',
        valorConta: -5678.90,
        aPagarReceber: -5678.90,
        banco: 'Bradesco',
        agencia: '8901-2'
      },
      // Maio 2025
      {
        id: '15',
        dataPrevisao: new Date('2025-05-02'),
        clienteFornecedor: 'Comercial Alimentos',
        telefone: '(19) 3333-4444',
        tipo: 'Contas a Receber',
        valorConta: 33250.00,
        aPagarReceber: 33250.00,
        banco: 'Itaú',
        agencia: '6789-0'
      },
      {
        id: '16',
        dataPrevisao: new Date('2025-05-05'),
        clienteFornecedor: 'Seguradora Nacional',
        telefone: '(11) 3030-4040',
        tipo: 'Contas a Pagar',
        valorConta: -4500.00,
        aPagarReceber: -4500.00,
        banco: 'Banco do Brasil',
        agencia: '1111-1'
      },
      {
        id: '17',
        dataPrevisao: new Date('2025-05-10'),
        clienteFornecedor: 'Loja Virtual Online',
        telefone: '(21) 5555-6666',
        tipo: 'Contas a Receber',
        valorConta: 12890.50,
        aPagarReceber: 12890.50,
        banco: 'Nubank',
        agencia: '0001'
      },
      {
        id: '18',
        dataPrevisao: new Date('2025-05-15'),
        clienteFornecedor: 'Transportadora Rápida',
        telefone: '(35) 9999-8888',
        tipo: 'Contas a Pagar',
        valorConta: -8760.00,
        aPagarReceber: -8760.00,
        banco: 'Santander',
        agencia: '4321-0'
      },
      {
        id: '19',
        dataPrevisao: new Date('2025-05-20'),
        clienteFornecedor: 'Escritório Contábil',
        telefone: '(31) 7777-8888',
        tipo: 'Contas a Pagar',
        valorConta: -1850.00,
        aPagarReceber: -1850.00,
        banco: 'Itaú',
        agencia: '5432-1'
      },
      {
        id: '20',
        dataPrevisao: new Date('2025-05-25'),
        clienteFornecedor: 'Fábrica de Móveis',
        telefone: '(19) 2222-1111',
        tipo: 'Contas a Receber',
        valorConta: 89000.00,
        aPagarReceber: 62300.00,
        banco: 'Bradesco',
        agencia: '6543-2'
      }
    ];

    this.dataSubject.next(mockData);
  }

  updateConfig(config: Partial<PivotConfig>): void {
    const currentConfig = this.configSubject.value;
    this.configSubject.next({ ...currentConfig, ...config });
  }

  generatePivotData(): PivotData {
    const data = this.dataSubject.value;
    const config = this.configSubject.value;

    let filteredData = this.applyFilters(data, config.filters);
    const pivotRows = this.groupByRows(filteredData, config);
    const grandTotal = this.calculateGrandTotal(filteredData, config.values);

    return {
      rows: pivotRows,
      grandTotal
    };
  }

  private applyFilters(data: FinancialRecord[], filters: any[]): FinancialRecord[] {
    return data;
  }

  private groupByRows(
    data: FinancialRecord[],
    config: PivotConfig,
    level: number = 0
  ): PivotRow[] {
    if (level >= config.rows.length) {
      return [];
    }

    const currentField = config.rows[level];
    const grouped = groupBy(data, (record: any) => {
      return this.getFieldValue(record, currentField);
    });

    const rows: PivotRow[] = [];

    for (const [key, records] of Object.entries(grouped)) {
      const values: { [key: string]: number } = {};
      
      config.values.forEach(valueField => {
        values[valueField.id] = this.aggregate(
          records,
          valueField.id,
          valueField.aggregationType || 'sum'
        );
      });

      if (config.columns.length > 0) {
        const columnField = config.columns[0];
        const columnGroups = groupBy(records, (r: any) => 
          this.getFieldValue(r, columnField)
        );

        for (const [colKey, colRecords] of Object.entries(columnGroups)) {
          config.values.forEach(valueField => {
            const columnKey = `${colKey}_${valueField.id}`;
            values[columnKey] = this.aggregate(
              colRecords,
              valueField.id,
              valueField.aggregationType || 'sum'
            );
          });
        }
      }

      const row: PivotRow = {
        key,
        label: key,
        level,
        expanded: false,
        values,
        rawData: records,
        children: this.groupByRows(records, config, level + 1)
      };

      rows.push(row);
    }

    return rows;
  }

  private getFieldValue(record: any, field: Field): string {
    const value = record[field.id];
    
    if (field.type === 'date' && value instanceof Date) {
      return format(value, 'dd/MM/yyyy');
    }
    
    return String(value || '');
  }

  private aggregate(
    records: FinancialRecord[],
    fieldId: string,
    type: AggregationType
  ): number {
    switch (type) {
      case 'sum':
        return sumBy(records, (r: any) => Number(r[fieldId]) || 0);
      case 'avg':
        return meanBy(records, (r: any) => Number(r[fieldId]) || 0);
      case 'min':
        const minRecord = minBy(records, (r: any) => Number(r[fieldId]) || 0);
        return minRecord ? Number((minRecord as any)[fieldId]) : 0;
      case 'max':
        const maxRecord = maxBy(records, (r: any) => Number(r[fieldId]) || 0);
        return maxRecord ? Number((maxRecord as any)[fieldId]) : 0;
      case 'count':
        return records.length;
      case 'distinctCount':
        return uniqBy(records, fieldId).length;
      default:
        return 0;
    }
  }

  private calculateGrandTotal(
    data: FinancialRecord[],
    valueFields: Field[]
  ): { [key: string]: number } {
    const total: { [key: string]: number } = {};
    
    valueFields.forEach(field => {
      total[field.id] = this.aggregate(
        data,
        field.id,
        field.aggregationType || 'sum'
      );
    });

    return total;
  }

  getAvailableFields(): Field[] {
    const baseFields: Field[] = [
      { id: 'dataPrevisao', name: 'dataPrevisao', displayName: 'Data de Previsão (completa)', type: 'date' },
      { id: 'clienteFornecedor', name: 'clienteFornecedor', displayName: 'Cliente ou Fornecedor (Nome Fantasia)', type: 'string' },
      { id: 'telefone', name: 'telefone', displayName: 'Telefone 1', type: 'string' },
      { id: 'tipo', name: 'tipo', displayName: 'Tipo', type: 'string' },
      { id: 'valorConta', name: 'valorConta', displayName: 'Soma de Valor da Conta', type: 'number', aggregationType: 'sum' },
      { id: 'aPagarReceber', name: 'aPagarReceber', displayName: 'Soma de A Pagar ou Receber', type: 'number', aggregationType: 'sum' },
      { id: 'jurosPercentual', name: 'jurosPercentual', displayName: '% de Juros ao Mês do Boleto', type: 'number', aggregationType: 'avg' },
      { id: 'multaPercentual', name: 'multaPercentual', displayName: '% de Multa por Atraso do Boleto', type: 'number', aggregationType: 'avg' },
      { id: 'banco', name: 'banco', displayName: 'Banco para Transferência', type: 'string' },
      { id: 'agencia', name: 'agencia', displayName: 'Agência para Transferência', type: 'string' }
    ];

    // Adicionar campos calculados
    const calculatedFields = this.calculatedFieldsSubject.value.map(cf => ({
      ...cf,
      displayName: cf.displayName,
      aggregationType: cf.aggregationType || 'sum' as AggregationType
    }));

    return [...baseFields, ...calculatedFields];
  }

  addCalculatedField(field: CalculatedField): void {
    const currentFields = this.calculatedFieldsSubject.value;
    this.calculatedFieldsSubject.next([...currentFields, field]);
  }

  removeCalculatedField(fieldId: string): void {
    const currentFields = this.calculatedFieldsSubject.value;
    this.calculatedFieldsSubject.next(currentFields.filter(f => f.id !== fieldId));
  }

  getCalculatedFields(): CalculatedField[] {
    return this.calculatedFieldsSubject.value;
  }
}
