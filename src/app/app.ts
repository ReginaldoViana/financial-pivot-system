import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { PivotTable } from './features/financial/pivot-table/pivot-table';
import { ChartViewer } from './features/financial/chart-viewer/chart-viewer';
import { Toolbar } from './features/financial/toolbar/toolbar';
import { FieldListModal } from './features/financial/field-list-modal/field-list-modal';
import { CalculatedFieldModal } from './features/financial/calculated-field-modal/calculated-field-modal';
import { ExportService } from './core/services/export.service';
import { PivotDataService } from './core/services/pivot-data.service';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    MatTabsModule,
    MatDialogModule,
    MatIconModule,
    PivotTable,
    ChartViewer,
    Toolbar
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  @ViewChild(PivotTable) pivotTable!: PivotTable;
  @ViewChild(ChartViewer) chartViewer!: ChartViewer;

  constructor(
    private dialog: MatDialog,
    private exportService: ExportService,
    private pivotService: PivotDataService
  ) {}

  onRefresh(): void {
    this.pivotTable?.loadData();
    this.chartViewer?.loadChartData();
  }

  onOpenFieldList(): void {
    const dialogRef = this.dialog.open(FieldListModal, {
      width: '1200px',
      height: '600px',
      data: {
        config: this.pivotService.configSubject.value
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.pivotService.updateConfig(result);
        this.onRefresh();
      }
    });
  }

  onOpenCalculatedField(): void {
    const dialogRef = this.dialog.open(CalculatedFieldModal, {
      width: '900px',
      height: '700px',
      data: {
        fields: this.pivotService.getAvailableFields()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Adicionar o campo calculado à configuração atual
        const currentConfig = this.pivotService.configSubject.value;
        const newField = {
          id: result.id,
          name: result.name,
          displayName: result.displayName,
          type: 'number' as const,
          aggregationType: 'sum' as const
        };
        
        this.pivotService.updateConfig({
          ...currentConfig,
          values: [...currentConfig.values, newField],
          calculatedFields: [...(currentConfig.calculatedFields || []), result]
        });
        
        this.onRefresh();
      }
    });
  }

  onExport(type: string): void {
    const pivotData = this.pivotService.generatePivotData();
    
    switch (type) {
      case 'excel':
        this.exportService.exportToExcel(pivotData);
        break;
      case 'pdf':
        this.exportService.exportToPDF('pivot-container');
        break;
      case 'html':
        this.exportService.exportToHTML('pivot-container');
        break;
      case 'csv':
        this.exportService.exportToCSV(pivotData.rows);
        break;
      case 'print':
        this.exportService.printReport('pivot-container');
        break;
    }
  }

  onChartChange(type: string): void {
    if (this.chartViewer) {
      this.chartViewer.changeChartType(type);
    }
  }
}
