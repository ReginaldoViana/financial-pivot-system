import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PivotDataService } from '../../../core/services/pivot-data.service';
import { PivotData, PivotRow } from '../../../core/models/financial-data.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pivot-table',
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './pivot-table.html',
  styleUrl: './pivot-table.scss',
})
export class PivotTable implements OnInit, OnDestroy {
  pivotData: PivotData | null = null;
  displayedColumns: string[] = [];
  dynamicColumns: Array<{
    id: string;
    label: string;
    valueKey: string;
    groupTitle?: string;
    showGroupTitle?: boolean;
  }> = [];
  private configSubscription?: Subscription;

  constructor(
    private pivotService: PivotDataService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Inscrever nas mudanças de configuração para atualização instantânea
    this.configSubscription = this.pivotService.config$.subscribe(() => {
      this.loadData();
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.configSubscription?.unsubscribe();
  }

  loadData(): void {
    this.pivotData = this.pivotService.generatePivotData();
    this.setupColumns();
  }

  private setupColumns(): void {
    const config = this.pivotService.configSubject.value;
    const columns: string[] = ['label'];
    this.dynamicColumns = [];

    // Tipos de coluna (baseado nos dados)
    const columnTypes = [
      { id: 'ContasReceber', label: '1. Contas a Receber', valuePrefix: 'Contas a Receber' },
      { id: 'ContasPagar', label: '2. Contas a Pagar', valuePrefix: 'Contas a Pagar' }
    ];

    // Adicionar colunas para cada tipo e cada valor configurado
    columnTypes.forEach((colType, typeIndex) => {
      config.values.forEach((valueField, fieldIndex) => {
        const colId = `${colType.id}_${valueField.id}`;
        columns.push(colId);
        
        this.dynamicColumns.push({
          id: colId,
          label: valueField.displayName,
          valueKey: `${colType.valuePrefix}_${valueField.id}`,
          groupTitle: colType.label,
          showGroupTitle: fieldIndex === 0
        });
      });
    });

    // Adicionar colunas de total para cada valor
    config.values.forEach((valueField, index) => {
      const colId = `total_${valueField.id}`;
      columns.push(colId);
      
      this.dynamicColumns.push({
        id: colId,
        label: valueField.displayName,
        valueKey: valueField.id,
        groupTitle: 'Totais',
        showGroupTitle: index === 0
      });
    });

    this.displayedColumns = columns;
  }

  toggleExpand(row: PivotRow): void {
    row.expanded = !row.expanded;
  }

  getRowStyle(row: PivotRow): any {
    return {
      'padding-left': `${row.level * 24}px`
    };
  }

  formatCurrency(value: number): string {
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Math.abs(value));

    return value < 0 ? `-${formatted}` : formatted;
  }

  getValueClass(value: number): string {
    return value < 0 ? 'negative-value' : 'positive-value';
  }

  getGrandTotalColumns(): string[] {
    const config = this.pivotService.configSubject.value;
    return config.values.map(v => v.id);
  }

  getFlattenedRows(rows: PivotRow[]): PivotRow[] {
    const result: PivotRow[] = [];
    
    rows.forEach(row => {
      result.push(row);
      if (row.expanded && row.children && row.children.length > 0) {
        result.push(...this.getFlattenedRows(row.children));
      }
    });

    return result;
  }
}
